"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateAiConversationSchema,
  type GenerationEmail,
  type UpdateAiConversationValues
} from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import InputComponent from "@/components/ui/input";
import Type from "@/components/type";
import PageComponent from "@/components/layouts/page-component";
import PageActions from "@/components/global/page-actions";
import GlobalButton from "@/components/global/button";
import {
  deleteGenerationEmail,
  getGenerationEmails,
  updateGenerationEmail
} from "@/actions/ai/generation.actions";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

export default function EmailChatsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<GenerationEmail | null>(null);

  const deleteModal = useDisclosure();
  const editModal = useDisclosure();

  const { data, isPending } = useQuery({
    queryKey: ["generation-emails"],
    queryFn: getGenerationEmails
  });

  const conversations = ((data ?? []) as GenerationEmail[]).filter((c) =>
    (c.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGenerationEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generation-emails"] });
      addToast({ description: "Conversation deleted", color: "success" });
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAiConversationValues }) =>
      updateGenerationEmail(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generation-emails"] });
      addToast({ description: "Conversation updated", color: "success" });
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  const { register, handleSubmit, reset } = useForm<UpdateAiConversationValues>({
    resolver: zodResolver(updateAiConversationSchema)
  });

  function handleEditOpen(conversation: GenerationEmail) {
    setSelectedConversation(conversation);
    reset({ title: conversation.title });
    editModal.onOpen();
  }

  function handleDeleteOpen(conversation: GenerationEmail) {
    setSelectedConversation(conversation);
    deleteModal.onOpen();
  }

  function handleConfirmDelete(onClose: () => void) {
    if (!selectedConversation) return;

    deleteMutation.mutate(selectedConversation._id, {
      onSettled: () => onClose()
    });
  }

  function onEditSubmit(values: UpdateAiConversationValues, onClose: () => void) {
    if (!selectedConversation) return;

    editMutation.mutate(
      { id: selectedConversation._id, data: values },
      { onSettled: () => onClose() }
    );
  }

  return (
    <PageComponent className="pt-0">
      <PageActions
        className="w-full"
        searchPlaceholder="Search chats..."
        onSearchChange={setSearch}
      />

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner size="sm" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Type>No chats yet</Type>
          <Type className="text-muted-foreground" variant="sm">
            Start a new email conversation to see it here
          </Type>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-[1fr_200px_120px_auto] gap-4 px-4 py-2 text-xs text-muted-foreground">
            <span>Name</span>
            <span>Project</span>
            <span className="text-right">Updated</span>
            <span />
          </div>
          {conversations.map((c) => (
            <div
              key={c._id}
              className="grid grid-cols-[1fr_200px_120px_auto] gap-4 items-center px-4 py-4 hover:bg-default-50"
            >
              <Link
                className="truncate cursor-pointer"
                href={`/app/new/email/template?conversationId=${c._id}&isEdition=true`}
              >
                <Type className="truncate">{c.title || "Untitled chat"}</Type>
              </Link>
              <Type className="text-muted-foreground text-center capitalize" variant="sm">
                {c.status}
              </Type>
              <Type className="text-muted-foreground text-right" variant="sm">
                {c.updatedAt ? timeAgo(c.updatedAt) : ""}
              </Type>
              <div className="flex items-center gap-3">
                <GlobalButton
                  isIconOnly
                  radius="sm"
                  size="sm"
                  variant="light"
                  onPress={() => handleEditOpen(c)}
                >
                  <PencilSquareIcon className="size-4" />
                </GlobalButton>
                <GlobalButton
                  isIconOnly
                  color="danger"
                  radius="sm"
                  size="sm"
                  variant="light"
                  onPress={() => handleDeleteOpen(c)}
                >
                  <TrashIcon className="size-4" />
                </GlobalButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={deleteModal.isOpen} radius="sm" onOpenChange={deleteModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <Type className="text-muted-foreground">
                  Are you sure you want to delete this conversation? This action cannot be undone.
                </Type>
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={onClose}>
                  Cancel
                </GlobalButton>
                <GlobalButton
                  color="danger"
                  isLoading={deleteMutation.isPending}
                  onPress={() => handleConfirmDelete(onClose)}
                >
                  Delete
                </GlobalButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={editModal.isOpen} radius="sm" onOpenChange={editModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit((values) => onEditSubmit(values, onClose))}>
              <ModalHeader>Rename Conversation</ModalHeader>
              <ModalBody>
                <InputComponent
                  label="Title"
                  placeholder="Conversation title"
                  radius="sm"
                  {...register("title")}
                />
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={onClose}>
                  Cancel
                </GlobalButton>
                <GlobalButton color="primary" isLoading={editMutation.isPending} type="submit">
                  Save
                </GlobalButton>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </PageComponent>
  );
}
