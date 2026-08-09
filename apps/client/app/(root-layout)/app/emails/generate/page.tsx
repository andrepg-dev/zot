"use client";

import { SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGenerationEmailSchema,
  type CreateGenerationEmailValues,
  type GenerationEmail
} from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { formatDate } from "@/lib/format-date";
import Chip from "@/components/ui/chip";
import Type from "@/components/type";
import PageComponent from "@/components/layouts/page-component";
import Title from "@/components/global/title";
import GlobalButton from "@/components/global/button";
import SkillsPicker from "@/components/email-generation/skills-picker";
import {
  createGenerationEmail,
  deleteGenerationEmail,
  getGenerationEmails
} from "@/actions/ai/generation.actions";

const STATUS_CHIP = {
  draft: "neutral",
  generating: "warning",
  ready: "active",
  failed: "danger"
} as const;

export default function GenerateEmailsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteModal = useDisclosure();
  const [skills, setSkills] = useState<string[]>([]);
  const [selected, setSelected] = useState<GenerationEmail | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["generation-emails"],
    queryFn: getGenerationEmails
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateGenerationEmailValues>({
    resolver: zodResolver(createGenerationEmailSchema),
    defaultValues: { prompt: "" }
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateGenerationEmailValues) => createGenerationEmail(values),
    onSuccess: (email) => {
      addToast({ description: "Email created", color: "success" });
      queryClient.invalidateQueries({ queryKey: ["generation-emails"] });
      reset({ prompt: "" });
      setSkills([]);
      router.push(`/app/emails/generate/${email._id}`);
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGenerationEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generation-emails"] });
      addToast({ description: "Email deleted", color: "danger" });
      setSelected(null);
      deleteModal.onClose();
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const emails = data ?? [];

  const onSubmit = (values: CreateGenerationEmailValues) => {
    createMutation.mutate({ ...values, skills });
  };

  return (
    <PageComponent className="pt-0">
      <form className="flex flex-col gap-3 max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
        <Title description="Describe the campaign. Name the goal, audience and main call to action for a stronger first draft.">
          Generate an email
        </Title>

        <Controller
          control={control}
          name="prompt"
          render={({ field }) => (
            <Textarea
              {...field}
              errorMessage={errors.prompt?.message}
              isDisabled={createMutation.isPending}
              isInvalid={!!errors.prompt}
              maxRows={10}
              minRows={3}
              placeholder="A launch announcement for our new pricing, aimed at trial users, with a clear upgrade CTA"
              radius="sm"
            />
          )}
        />

        <div className="flex items-center justify-between gap-2">
          <SkillsPicker
            isDisabled={createMutation.isPending}
            selected={skills}
            onChange={setSkills}
          />

          <GlobalButton
            color="primary"
            isLoading={createMutation.isPending}
            startContent={<SparklesIcon className="size-4" />}
            type="submit"
          >
            Generate
          </GlobalButton>
        </div>
      </form>

      <div className="mt-10 flex flex-col gap-3">
        <Type variant="h4">Your generated emails</Type>

        {isPending ? (
          <div className="flex justify-center py-16">
            <Spinner variant="dots" />
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <SparklesIcon className="size-5" />
            <Type>No generated emails yet</Type>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emails.map((email) => (
              <Card
                key={email._id}
                isPressable
                className="border border-default-200"
                radius="none"
                onPress={() => router.push(`/app/emails/generate/${email._id}`)}
              >
                <CardBody className="flex flex-col gap-2 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Type className="truncate" variant="h6">
                      {email.title}
                    </Type>
                    <GlobalButton
                      isIconOnly
                      aria-label={`Delete ${email.title}`}
                      color="danger"
                      variant="light"
                      onPress={() => {
                        setSelected(email);
                        deleteModal.onOpen();
                      }}
                    >
                      <TrashIcon className="size-4" />
                    </GlobalButton>
                  </div>

                  <Type className="text-muted-foreground line-clamp-2" variant="sm">
                    {email.prompt}
                  </Type>

                  <div className="flex items-center gap-2">
                    <Chip status={STATUS_CHIP[email.status]}>{email.status}</Chip>
                    {email.updatedAt ? (
                      <Type className="text-muted-foreground" variant="sm">
                        {formatDate(email.updatedAt)}
                      </Type>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={deleteModal.isOpen} radius="none" onClose={deleteModal.onClose}>
        <ModalContent>
          <ModalHeader>Delete generated email</ModalHeader>
          <ModalBody>
            <Type>
              {`"${selected?.title ?? ""}" and all of its versions will be permanently deleted.`}
            </Type>
          </ModalBody>
          <ModalFooter>
            <GlobalButton variant="light" onPress={deleteModal.onClose}>
              Cancel
            </GlobalButton>
            <GlobalButton
              color="danger"
              isLoading={deleteMutation.isPending}
              onPress={() => selected && deleteMutation.mutate(selected._id)}
            >
              Delete
            </GlobalButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageComponent>
  );
}
