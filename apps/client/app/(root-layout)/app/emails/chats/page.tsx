"use client";

import {
  deleteAiConversation,
  editAiConversation,
  getAiConversations,
  type AiConversation
} from "@/actions/ai/ai-email.actions";
import GlobalButton from "@/components/global/button";
import PageActions from "@/components/global/page-actions";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
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
  type UpdateAiConversationValues
} from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
  const [selectedConversation, setSelectedConversation] = useState<AiConversation | null>(null);

  const deleteModal = useDisclosure();
  const editModal = useDisclosure();

  const { data, isPending } = useQuery({
    queryKey: ["ai-conversations"],
    queryFn: getAiConversations
  });

  const conversations = ((data ?? []) as AiConversation[]).filter((c) =>
    (c.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAiConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
      addToast({ description: "Conversation deleted", color: "success" });
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAiConversationValues }) =>
      editAiConversation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
      addToast({ description: "Conversation updated", color: "success" });
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  const { register, handleSubmit, reset } = useForm<UpdateAiConversationValues>({
    resolver: zodResolver(updateAiConversationSchema)
  });

  function handleEditOpen(conversation: AiConversation) {
    setSelectedConversation(conversation);
    reset({ title: conversation.title });
    editModal.onOpen();
  }

  function handleDeleteOpen(conversation: AiConversation) {
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
        searchPlaceholder="Search chats..."
        onSearchChange={setSearch}
        className="w-full"
      />

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner size="sm" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Type>No chats yet</Type>
          <Type variant="sm" className="text-muted-foreground">
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
                href={`/app/new/email/template?conversationId=${c._id}&isEdition=true`}
                className="truncate cursor-pointer"
              >
                <Type className="truncate">{c.title || "Untitled chat"}</Type>
              </Link>
              <Type variant="sm" className="text-muted-foreground text-center">
                Draft
              </Type>
              <Type variant="sm" className="text-muted-foreground text-right">
                {timeAgo(c.updatedAt)}
              </Type>
              <div className="flex items-center gap-3">
                <GlobalButton
                  size="sm"
                  radius="sm"
                  variant="light"
                  isIconOnly
                  onPress={() => handleEditOpen(c)}
                >
                  <PencilSquareIcon className="size-4" />
                </GlobalButton>
                <GlobalButton
                  size="sm"
                  radius="sm"
                  variant="light"
                  color="danger"
                  isIconOnly
                  onPress={() => handleDeleteOpen(c)}
                >
                  <TrashIcon className="size-4" />
                </GlobalButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={deleteModal.isOpen} onOpenChange={deleteModal.onOpenChange} radius="sm">
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
                  onPress={() => handleConfirmDelete(onClose)}
                  isLoading={deleteMutation.isPending}
                >
                  Delete
                </GlobalButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={editModal.isOpen} onOpenChange={editModal.onOpenChange} radius="sm">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit((values) => onEditSubmit(values, onClose))}>
              <ModalHeader>Rename Conversation</ModalHeader>
              <ModalBody>
                <InputComponent
                  radius="sm"
                  label="Title"
                  placeholder="Conversation title"
                  {...register("title")}
                />
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={onClose}>
                  Cancel
                </GlobalButton>
                <GlobalButton type="submit" color="primary" isLoading={editMutation.isPending}>
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
