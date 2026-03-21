"use client";

import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
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
import {
  createApiKeySchema,
  updateApiKeySchema,
  type CreateApiKeyValues,
  type UpdateApiKeyValues
} from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  createApiKey,
  deleteApiKey,
  getApiKeys,
  updateApiKey
} from "@/actions/api-key/api-key.actions";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import CopyButton from "@/components/ui/copy-button";
import InputComponent from "@/components/ui/input";
import { TrashIcon } from "@heroicons/react/24/outline";

const columns = [
  { key: "name", label: "Name" },
  { key: "apiKey", label: "API Key" },
  { key: "createdAt", label: "Created" },
  { key: "actions", label: "Actions" }
] as const;

type ApiKeyTableColumn = (typeof columns)[number];
type ApiKeyTableColumnKey = ApiKeyTableColumn["key"];

type ModalPhase = "form" | "created" | "edit";

export default function ApiKeys() {
  const modal = useDisclosure();
  const queryClient = useQueryClient();
  const [modalPhase, setModalPhase] = useState<ModalPhase>("form");
  const [createdKey, setCreatedKey] = useState<string>("");
  const [editingItem, setEditingItem] = useState<{ _id: string; name: string } | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateApiKeyValues>({
    resolver: zodResolver(createApiKeySchema)
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm<UpdateApiKeyValues>({
    resolver: zodResolver(updateApiKeySchema)
  });

  const { data, isPending } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => await getApiKeys()
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateApiKeyValues) => createApiKey(values),
    onSuccess: (response: any) => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      addToast({ description: "API key created", color: "success" });
      setCreatedKey(response.apiKey);
      setModalPhase("created");
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateApiKeyValues }) =>
      updateApiKey(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      addToast({ description: "API key updated", color: "success" });
      handleCloseModal();
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

  const onEditSubmit = (values: UpdateApiKeyValues) => {
    if (!editingItem) return;
    updateMutation.mutate({ id: editingItem._id, values });
  };

  const handleCloseModal = () => {
    modal.onClose();
    setModalPhase("form");
    setCreatedKey("");
    setEditingItem(null);
    reset();
    resetEdit();
  };

  const handleOpenEdit = (item: { _id: string; name: string }) => {
    setEditingItem(item);
    resetEdit({ name: item.name });
    setModalPhase("edit");
    modal.onOpen();
  };

  const renderModalContent = (onClose: () => void) => {
    if (modalPhase === "created") {
      return (
        <>
          <ModalHeader>API Key Created</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Type>
                Make sure to copy your API key now. You won{"'"}t be able to see it again.
              </Type>
              <div className="flex items-center gap-2 rounded-sm border p-3">
                <Type className="break-all font-mono">{createdKey}</Type>
                <CopyButton text={createdKey} className="min-w-7 h-7 shrink-0">
                  Copy
                </CopyButton>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <GlobalButton color="primary" onPress={handleCloseModal}>
              Done
            </GlobalButton>
          </ModalFooter>
        </>
      );
    }

    if (modalPhase === "edit") {
      return (
        <form onSubmit={handleEditSubmit(onEditSubmit)}>
          <ModalHeader>Edit API Key</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <Type className="font-medium">Name</Type>
              <Controller
                name="name"
                control={editControl}
                render={({ field }) => (
                  <InputComponent
                    placeholder="e.g. Production, Development"
                    maxLength={50}
                    isInvalid={!!editErrors.name}
                    errorMessage={editErrors.name?.message}
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
            <GlobalButton variant="light" onPress={handleCloseModal}>
              Cancel
            </GlobalButton>
            <GlobalButton
              color="primary"
              type="submit"
              isLoading={updateMutation.isPending}
            >
              Save
            </GlobalButton>
          </ModalFooter>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Create API Key</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            <Type variant="sm" className="text-muted-foreground">
              Give your API key a name to help you identify it later.
            </Type>

            <Type className="font-medium mt-4">Name</Type>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputComponent
                  placeholder="My Wait-List Integration"
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
          <GlobalButton variant="light" onPress={handleCloseModal}>
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
    );
  };

  return (
    <PageComponent>
      <Title
        description={
          <>
            You have permission to view and manage all API keys.
            <br />
            <br />
            Do not share your API key with others or expose it in the browser or other client-side
            code. To protect your account{"'"}s security, Zot may automatically disable any API key
            that has leaked publicly.
          </>
        }
        className="mb-6"
        rightChildren={
          <GlobalButton
            color="primary"
            startContent={<PlusIcon className="size-4" />}
            onPress={() => {
              setModalPhase("form");
              modal.onOpen();
            }}
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
        <TableHeader<ApiKeyTableColumn> columns={[...columns]}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody items={rows} isLoading={isPending} emptyContent={<Type>No API keys yet.</Type>}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey: string | number) => {
                const valueMap: Record<ApiKeyTableColumnKey, ReactNode> = {
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
                    <div className="flex items-center gap-1">
                      <GlobalButton
                        isIconOnly
                        variant="light"
                        onPress={() => handleOpenEdit(item)}
                      >
                        <PencilIcon className="size-3.5" />
                      </GlobalButton>
                      <GlobalButton
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => deleteMutation.mutate(item._id)}
                      >
                        <TrashIcon className="size-3.5" />
                      </GlobalButton>
                    </div>
                  )
                };

                return (
                  <TableCell>{valueMap[columnKey as ApiKeyTableColumnKey]}</TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={modal.isOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
        radius="sm"
        isDismissable={modalPhase !== "created"}
        hideCloseButton={modalPhase === "created"}
      >
        <ModalContent>
          {(onClose) => renderModalContent(onClose)}
        </ModalContent>
      </Modal>
    </PageComponent>
  );
}
