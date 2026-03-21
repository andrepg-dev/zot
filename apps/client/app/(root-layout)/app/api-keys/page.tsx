"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import { createApiKeySchema, type CreateApiKeyValues } from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { createApiKey, deleteApiKey, getApiKeys } from "@/actions/api-key/api-key.actions";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { TrashIcon } from "@heroicons/react/24/outline";

const columns = [
  { key: "name", label: "Name" },
  { key: "apiKey", label: "API Key" },
  { key: "createdAt", label: "Created" },
  { key: "actions", label: "Actions" }
];

export default function ApiKeys() {
  const modal = useDisclosure();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateApiKeyValues>({
    resolver: zodResolver(createApiKeySchema)
  });

  const { data, isPending } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => await getApiKeys()
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateApiKeyValues) => createApiKey(values),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      addToast({ description: "API key created", color: "success" });
      modal.onClose();
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      addToast({ description: "API key deleted", color: "danger" });
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const rows = data ?? [];

  const onSubmit = (values: CreateApiKeyValues) => {
    createMutation.mutate(values);
  };

  return (
    <PageComponent>
      <Title
        description="Manage your API keys for programmatic access"
        className="mb-6"
        rightChildren={
          <GlobalButton
            color="primary"
            startContent={<PlusIcon className="size-4" />}
            onPress={modal.onOpen}
          >
            Add API Key
          </GlobalButton>
        }
      >
        API Keys
      </Title>

      <Table
        aria-label="API Keys Table"
        radius="sm"
        classNames={{
          th: "!rounded-b-none",
          wrapper: "p-0 border",
          td: "first:before:rounded-none last:before:rounded-e-none cursor-pointer py-3"
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody items={rows} isLoading={isPending} emptyContent={<Type>No API keys yet.</Type>}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey: string | number) => {
                const valueMap: Record<typeof columns[number]["key"], React.ReactNode> = {
                  name: <Type>{item.name}</Type>,
                  apiKey: (
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs text-muted-foreground">
                        {item.apiKey?.slice(0, 12)}{"..."}
                      </code>
                    </div>
                  ),
                  createdAt: (
                    <Type variant="sm" className="text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Type>
                  ),
                  actions: (
                    <GlobalButton
                      isIconOnly
                      variant="light"
                      color="danger"
                      className="min-w-5 h-5"
                      onPress={() => deleteMutation.mutate(item._id)}
                    >
                      <TrashIcon className="size-3.5" />
                    </GlobalButton>
                  )
                };

                return <TableCell>{valueMap[columnKey]}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={modal.isOpen}
        onOpenChange={(open) => {
          modal.onOpenChange();
          if (!open) reset();
        }}
        radius="sm"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>Create API Key</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <Type variant="sm" className="text-muted-foreground">
                    Give your API key a name to help you identify it later.
                  </Type>

                  <Type className="font-medium mt-4" >Name</Type>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <InputComponent
                        placeholder="e.g. Production, Development"
                        maxLength={50}
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    )}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={onClose}>
                  Cancel
                </GlobalButton>
                <GlobalButton
                  color="primary"
                  type="submit"
                  isLoading={createMutation.isPending}
                >
                  Create
                </GlobalButton>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </PageComponent>
  );
}
