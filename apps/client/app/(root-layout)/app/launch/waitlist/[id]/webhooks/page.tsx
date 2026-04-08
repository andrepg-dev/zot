"use client";

import { getWaitListStats } from "@/actions/wait-list/stats.actions";
import { updateWaitList } from "@/actions/wait-list/wait-list.actions";
import { getWebhookEvents, type WebhookEvent } from "@/actions/wait-list/webhook-events.actions";
import FormField from "@/components/form-field";
import GlobalDrawer from "@/components/global/drawer";
import PrimaryActionButton from "@/components/global/primary-action-button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import InputComponent from "@/components/ui/input";
import { useHotkey } from "@/hooks/use-hotkey";
import { ArrowPathIcon, LinkIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import {
  DrawerBody,
  DrawerHeader,
  Kbd,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdateWaitListValues } from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { use, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formatDateTime } from "@/lib/format-date";

const webhookFormSchema = z.object({
  webhook: z
    .object({
      url: z
        .string()
        .min(1)
        .transform((v) => (v.startsWith("https://") ? v : `https://${v}`)),
      range: z.number().int().min(1)
    })
    .optional()
});

type WebhookFormValues = z.input<typeof webhookFormSchema>;

const columns = [
  { key: "status", label: "Status" },
  { key: "event", label: "Event" },
  { key: "url", label: "URL" },
  { key: "responseStatusCode", label: "Status Code" },
  { key: "sentAt", label: "Sent At" }
];

export default function Webhooks({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const configureDrawer = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const detailDrawer = useDisclosure();

  const toggleConfigureDrawer = useCallback(() => {
    if (configureDrawer.isOpen) configureDrawer.onClose();
    else configureDrawer.onOpen();
  }, [configureDrawer]);

  useHotkey({ key: "p", modifiers: ["meta"], onPress: toggleConfigureDrawer });

  const { data } = useQuery({
    queryKey: [id],
    queryFn: async () => await getWaitListStats(id)
  });

  const { data: events, isPending: isEventsLoading } = useQuery({
    queryKey: ["webhook-events", id],
    queryFn: () => getWebhookEvents(id)
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateWaitListValues) => {
      return await updateWaitList(id, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [id] });
      addToast({
        description: <Type>{response.webhook?.url}</Type>,
        color: "success"
      });
    },
    onError: (err) => {
      addToast({
        title: "Error",
        description: err.message,
        color: "danger"
      });
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    values: {
      webhook: {
        range: data?.webhook?.range ?? 10,
        url: data?.webhook?.url.replace("https://", "") ?? ""
      }
    }
  });

  const onSubmit = (formData: WebhookFormValues) => {
    const url = formData.webhook?.url;
    mutate({
      webhook: {
        url: url ? (url.startsWith("https://") ? url : `https://${url}`) : "",
        range: formData.webhook?.range ?? 10
      }
    });
  };

  function handleRowClick(event: WebhookEvent) {
    setSelectedEvent(event);
    detailDrawer.onOpen();
  }

  return (
    <PageComponent className="flex flex-col gap-6">
      <Title
        description="Receive notification when a user has been registered"
        rightChildren={
          <PrimaryActionButton
            className={data?.webhook?.url ? "bg-primary/30 !text-white" : ""}
            startContent={<WrenchIcon className="size-4" />}
            onPress={configureDrawer.onOpen}
          >
            Configure Webhook{" "}
            <Kbd classNames={{ base: "text-xs" }} keys={["command"]}>
              P
            </Kbd>
          </PrimaryActionButton>
        }
      >
        Webhooks
      </Title>

      <Table
        aria-label="Webhook Events"
        radius="none"
        removeWrapper
        className="bg-default-50 border"
        classNames={{
          td: "py-3"
        }}
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>

        <TableBody
          items={events ?? []}
          isLoading={isEventsLoading}
          loadingContent={<Spinner size="sm" />}
          emptyContent={
            <Type>
              {data?.webhook?.url
                ? "Webhook configured. Events will appear here once triggered."
                : "No webhook configured. Click Configure Webhook to get started."}
            </Type>
          }
        >
          {(item) => (
            <TableRow key={item._id} onClick={() => handleRowClick(item)}>
              {(columnKey) => {
                const valueMap: Record<string, React.ReactNode> = {
                  status:
                    item.status === "success" ? (
                      <Chip status="active">success</Chip>
                    ) : (
                      <Chip status="danger">failed</Chip>
                    ),
                  event: <span className="font-mono text-xs">{item.event}</span>,
                  url: (
                    <span className="font-mono text-xs text-muted-foreground truncate max-w-[200px] block">
                      {item.url}
                    </span>
                  ),
                  responseStatusCode: item.responseStatusCode ? (
                    <span className="font-mono text-xs">{item.responseStatusCode}</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  ),
                  sentAt: item.sentAt ? (
                    <span className="text-muted-foreground font-mono text-xs">
                      {formatDateTime(item.sentAt)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )
                };
                return <TableCell>{valueMap[String(columnKey)]}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Configure Webhook Drawer */}
      <GlobalDrawer
        isOpen={configureDrawer.isOpen}
        onOpenChange={configureDrawer.onOpenChange}
        size="2xl"
        placement="left"
        expandedSize="3xl"
      >
        <DrawerHeader className="flex flex-col gap-1">
          <h2 className="text-base font-medium">Configure Webhook</h2>
          <p className="text-sm text-muted-foreground font-normal">
            Set the URL and trigger frequency for webhook notifications.
          </p>
        </DrawerHeader>

        <DrawerBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Card radius="sm" className="shadow-none border">
              <FormField
                icon={<LinkIcon className="size-4" />}
                title="Webhook URL"
                description="We'll send a POST request to this URL whenever new users join your waitlist."
                className="p-4 text-sm"
                error={errors?.webhook?.url}
                isRequired
              >
                <InputComponent type="url" {...register("webhook.url")} autoFocus />
              </FormField>

              <FormField
                icon={<ArrowPathIcon className="size-4" />}
                title="Send notification every"
                description="Trigger a webhook callback after every N user sign-ups."
                className="p-4 text-sm"
                error={errors?.webhook?.range}
              >
                <InputComponent
                  type="number"
                  {...register("webhook.range", { valueAsNumber: true })}
                />
              </FormField>
              <hr />
              <CardFooter className="flex justify-end">
                <Button
                  color={data?.webhook?.url && !isDirty ? "success" : "primary"}
                  variant={data?.webhook?.url && !isDirty ? "flat" : "solid"}
                  className={
                    data?.webhook?.url && !isDirty
                      ? "text-black bg-success/20 border border-success"
                      : ""
                  }
                  size="sm"
                  type="submit"
                  isLoading={isPending}
                >
                  {data?.webhook?.url && !isDirty ? "Connected" : "Connect"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </DrawerBody>
      </GlobalDrawer>

      {/* Webhook Event Detail Drawer */}
      <GlobalDrawer
        isOpen={detailDrawer.isOpen}
        onOpenChange={detailDrawer.onOpenChange}
        size="xl"
        expandedSize="3xl"
      >
        <DrawerHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2 capitalize">
            <h2 className="text-base font-medium">Event Details</h2>
            {selectedEvent &&
              (selectedEvent.status === "success" ? (
                <Chip status="active" className="flex items-center max-h-5">
                  success
                </Chip>
              ) : (
                <Chip status="danger">failed</Chip>
              ))}
          </div>
          <p className="text-sm text-muted-foreground font-normal">
            {selectedEvent?.sentAt ? formatDateTime(selectedEvent.sentAt) : "—"}
          </p>
        </DrawerHeader>

        <DrawerBody>
          {selectedEvent && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Type variant="h6">Event</Type>
                <Type variant="code">{selectedEvent.event}</Type>
              </div>

              <div className="flex flex-col gap-1">
                <Type variant="h6">URL</Type>
                <Type variant="code">{selectedEvent.url}</Type>
              </div>

              {selectedEvent.responseStatusCode && (
                <div className="flex flex-col gap-1">
                  <Type variant="h6">Response Status Code</Type>
                  <Type variant="code">{String(selectedEvent.responseStatusCode)}</Type>
                </div>
              )}

              {selectedEvent.errorMessage && (
                <div className="flex flex-col gap-1">
                  <Type variant="h6">Error Message</Type>
                  <p className="text-sm text-danger">{selectedEvent.errorMessage}</p>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <Type variant="h6">Payload</Type>
                <pre className="text-xs font-mono bg-default-100 p-3 rounded-sm border overflow-auto max-h-60">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </pre>
              </div>

              {selectedEvent.responseBody && (
                <div className="flex flex-col gap-1">
                  <Type variant="h6">Response Body</Type>
                  <pre className="text-xs font-mono bg-default-100 p-3 rounded-sm border overflow-auto max-h-60">
                    {selectedEvent.responseBody}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DrawerBody>
      </GlobalDrawer>
    </PageComponent>
  );
}
