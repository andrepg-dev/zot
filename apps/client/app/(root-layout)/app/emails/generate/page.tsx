"use client";

import {
  createGenerationEmail,
  deleteGenerationEmail,
  getGenerationEmails,
} from "@/actions/ai/generation.actions";
import SkillsPicker from "@/components/email-generation/skills-picker";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import { formatDateTime } from "@/lib/format-date";
import { SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGenerationEmailSchema,
  type CreateGenerationEmailValues,
  type GenerationEmail,
} from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function GenerateEmailsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteModal = useDisclosure();
  const [skills, setSkills] = useState<string[]>([]);
  const [selected, setSelected] = useState<GenerationEmail | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["generation-emails"],
    queryFn: getGenerationEmails,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGenerationEmailValues>({
    resolver: zodResolver(createGenerationEmailSchema),
    defaultValues: { prompt: "" },
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
    },
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
    },
  });

  const emails = data ?? [];

  const onSubmit = (values: CreateGenerationEmailValues) => {
    createMutation.mutate({ ...values, skills });
  };

  return (
    <PageComponent className="pt-0">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-3xl">
        <div className="flex flex-col gap-0.5">
          <Type variant="h2">Generate an email</Type>
          <Type className="text-muted-foreground">
            Describe the campaign. Name the goal, audience and main call to action for a
            stronger first draft.
          </Type>
        </div>

        <Controller
          name="prompt"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              radius="sm"
              minRows={3}
              maxRows={10}
              placeholder="A launch announcement for our new pricing, aimed at trial users, with a clear upgrade CTA"
              isDisabled={createMutation.isPending}
              isInvalid={!!errors.prompt}
              errorMessage={errors.prompt?.message}
            />
          )}
        />

        <div className="flex items-center justify-between gap-2">
          <SkillsPicker
            selected={skills}
            onChange={setSkills}
            isDisabled={createMutation.isPending}
          />

          <Button
            type="submit"
            radius="sm"
            color="primary"
            startContent={<SparklesIcon className="size-4" />}
            isLoading={createMutation.isPending}
          >
            Generate
          </Button>
        </div>
      </form>

      <div className="mt-10 flex flex-col gap-3">
        <Type variant="h3">Your generated emails</Type>

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
                radius="none"
                isPressable
                onPress={() => router.push(`/app/emails/generate/${email._id}`)}
                className="border border-default-200"
              >
                <CardBody className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <Type variant="h6" className="truncate">
                      {email.title}
                    </Type>
                    <Button
                      size="sm"
                      radius="sm"
                      variant="light"
                      color="danger"
                      isIconOnly
                      aria-label={`Delete ${email.title}`}
                      onPress={() => {
                        setSelected(email);
                        deleteModal.onOpen();
                      }}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>

                  <Type variant="sm" className="text-muted-foreground line-clamp-2">
                    {email.prompt}
                  </Type>

                  <div className="flex items-center gap-2">
                    <Type variant="sm" className="text-muted-foreground">
                      {email.status}
                    </Type>
                    {email.updatedAt ? (
                      <Type variant="sm" className="text-muted-foreground">
                        · {formatDateTime(email.updatedAt)}
                      </Type>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose} radius="none">
        <ModalContent>
          <ModalHeader>Delete generated email</ModalHeader>
          <ModalBody>
            <Type>
              {`"${selected?.title ?? ""}" and all of its versions will be permanently deleted.`}
            </Type>
          </ModalBody>
          <ModalFooter>
            <Button radius="sm" variant="light" onPress={deleteModal.onClose}>
              Cancel
            </Button>
            <Button
              radius="sm"
              color="danger"
              isLoading={deleteMutation.isPending}
              onPress={() => selected && deleteMutation.mutate(selected._id)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageComponent>
  );
}
