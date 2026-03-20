"use client"

import { getWaitListStats } from "@/actions/wait-list/stats.actions";
import { updateWaitList } from "@/actions/wait-list/wait-list.actions";
import FormField from "@/components/form-field";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import InputComponent from "@/components/ui/input";
import { LinkIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdateWaitListValues } from "@repo/packages/shared/schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const webhookFormSchema = z.object({
  webhook: z.object({
    url: z.string().min(1).transform((v) => (v.startsWith("https://") ? v : `https://${v}`)),
    range: z.number().int().min(1)
  }).optional()
});

type WebhookFormValues = z.input<typeof webhookFormSchema>;

export default function Webhooks({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data } = useQuery({
    queryKey: [id],
    queryFn: async () => await getWaitListStats(id)
  })

  const { mutate } = useMutation({
    mutationFn: async (data: UpdateWaitListValues) => {
      return await updateWaitList(id, { ...data })
    },
    onSuccess: (response) => {
      addToast({
        title: "Updated",
        description: `${response.webhook?.url} configured`,
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
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    mode: "onChange",
    values: {
      webhook: {
        range: data?.webhook.range ?? 0,
        url: data?.webhook.url.replace("https://", "") ?? ""
      }
    }
  })

  const onSubmit = (formData: WebhookFormValues) => {
    const url = formData.webhook?.url;
    mutate({
      webhook: {
        url: url ? (url.startsWith("https://") ? url : `https://${url}`) : "",
        range: formData.webhook?.range ?? 10
      }
    })
  }

  return (
    <PageComponent className="flex flex-col gap-6 w-5xl">
      <Title description="Receive notification when a user has been registered">Webhooks</Title>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card radius="sm">
          <FormField
            icon={<LinkIcon className="size-4" />}
            title="Webhook URL"
            description="Automatically send webhook callbacks for user signup and offboarding events."
            className="p-4"
            error={errors?.webhook?.url}
            isRequired
          >
            <InputComponent
              type="url"
              {...register("webhook.url")}
            />
          </FormField>

          <FormField
            icon={<LinkIcon className="size-4" />}
            title="Send notification every"
            description="Send notification every quantity of users"
            className="p-4"
            error={errors?.webhook?.range}
          >
            <InputComponent type="number" {...register("webhook.range", { valueAsNumber: true })} />
          </FormField>
          <hr />
          <CardFooter className="flex justify-end">
            <Button color="primary" size="sm" type="submit">
              Connect
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageComponent>
  );
}
