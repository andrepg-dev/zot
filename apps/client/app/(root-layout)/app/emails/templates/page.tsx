"use client";

import type { EmailTemplate } from "@repo/packages/shared/schemas";

import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  SparklesIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import {
  DrawerBody,
  DrawerHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  deleteEmailTemplate,
  getEmailTemplates
} from "@/actions/email-templates/email-templates.actions";
import GlobalButton from "@/components/global/button";
import GlobalDrawer from "@/components/global/drawer";
import PageActions from "@/components/global/page-actions";
import PageComponent from "@/components/layouts/page-component";
import EmailTemplateCardSkeleton from "@/components/skeletons/email-template/card";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import { formatDateTime } from "@/lib/format-date";

export default function EmailTemplatesPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteModal = useDisclosure();
  const detailsDrawer = useDisclosure();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["email-templates"],
    queryFn: getEmailTemplates
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      addToast({ description: "Template deleted", color: "danger" });
      setSelectedTemplate(null);
      deleteModal.onClose();
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const handleOpenDelete = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    deleteModal.onOpen();
  };

  const handleOpenDetails = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    detailsDrawer.onOpen();
  };

  const templates = ((data ?? []) as EmailTemplate[]).filter((t) =>
    t.alias.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageComponent className="pt-0">
      <PageActions searchPlaceholder="Search template..." onSearchChange={setSearch} />

      <span className="text-default-400 text-small">Total {templates.length} templates</span>

      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6 mt-4">
          <EmailTemplateCardSkeleton />
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <SparklesIcon className="size-5" />
          <Type>No templates yet</Type>
          <Type className="text-muted-foreground" variant="sm">
            Start creating email templates with AI
          </Type>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4">
          {templates.map((template) => (
            <div key={template._id} className="flex flex-col gap-2 relative group">
              <div className="bg-white/90 w-full aspect-video flex justify-center relative overflow-hidden">
                {/* Covers the card so the whole preview opens the editor, while
                    leaving the actions menu above it clickable on its own. */}
                <button
                  aria-label={`Open ${template.alias}`}
                  className="absolute inset-0 z-10 cursor-pointer"
                  type="button"
                  onClick={() => router.push(`/app/new/email/template?id=${template._id}`)}
                />
                <div className="group-hover:scale-[1.02] w-3/4 h-3/4 bottom-0 absolute rounded-sm overflow-hidden transition">
                  <Image
                    alt={`Preview of ${template.alias} template`}
                    className="object-cover"
                    height={700}
                    src={template.preview}
                    width={700}
                  />
                </div>

                <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Dropdown placement="bottom-end" radius="sm">
                    <DropdownTrigger>
                      <GlobalButton
                        isIconOnly
                        className="backdrop-blur-sm border hover:bg-default-50"
                        size="sm"
                        variant="solid"
                      >
                        <EllipsisHorizontalIcon className="size-4" />
                      </GlobalButton>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Template actions"
                      itemClasses={{ title: "text-xs", base: "gap-2" }}
                    >
                      <DropdownItem
                        key="details"
                        startContent={<EyeIcon className="size-3.5" />}
                        onPress={() => handleOpenDetails(template)}
                      >
                        View details
                      </DropdownItem>
                      <DropdownItem
                        key="edit"
                        startContent={<PencilIcon className="size-3.5" />}
                        onPress={() => router.push(`/app/new/email/template?id=${template._id}`)}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<TrashIcon className="size-3.5" />}
                        onPress={() => handleOpenDelete(template)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex flex-col">
                  <Type className="text-medium" variant="h6">
                    {template.alias}
                  </Type>
                  <Type className="text-muted-foreground">{template._id}</Type>
                </div>

                {template.status == "published" && (
                  <Chip className="capitalize" status="neutral">
                    {template.status}
                  </Chip>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        radius="sm"
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTemplate(null);
            deleteModal.onClose();
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Template</ModalHeader>
              <ModalBody>
                <Type className="text-muted-foreground">
                  Are you sure you want to delete{" "}
                  <Type variant="code">{selectedTemplate?.alias}</Type>? This action cannot be
                  undone.
                </Type>
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={onClose}>
                  Cancel
                </GlobalButton>
                <GlobalButton
                  color="danger"
                  isLoading={deleteMutation.isPending}
                  onPress={() => {
                    if (selectedTemplate) deleteMutation.mutate(selectedTemplate._id);
                  }}
                >
                  Delete
                </GlobalButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <GlobalDrawer
        isOpen={detailsDrawer.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTemplate(null);
            detailsDrawer.onClose();
          }
        }}
      >
        {selectedTemplate && (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <Type variant="h4">{selectedTemplate.alias}</Type>
              <p className="text-sm text-muted-foreground font-normal">
                Template details and preview
              </p>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <Type className="text-muted-foreground">Status</Type>
                  <Chip
                    className="capitalize"
                    status={selectedTemplate.status === "published" ? "active" : "neutral"}
                  >
                    {selectedTemplate.status}
                  </Chip>
                </div>
                <div className="flex justify-between items-center">
                  <Type className="text-muted-foreground">Subject</Type>
                  <Type>{selectedTemplate.subject || "—"}</Type>
                </div>
                <div className="flex justify-between items-center">
                  <Type className="text-muted-foreground">Created</Type>
                  <Type>{formatDateTime(selectedTemplate.createdAt)}</Type>
                </div>
                <div className="flex justify-between items-center">
                  <Type className="text-muted-foreground">Last updated</Type>
                  <Type>{formatDateTime(selectedTemplate.updatedAt)}</Type>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Type variant="h6">Preview</Type>
                <div className="rounded-sm border overflow-hidden bg-white">
                  <Image
                    alt={selectedTemplate.alias}
                    className="w-full h-auto object-contain"
                    height={600}
                    src={selectedTemplate.preview}
                    width={800}
                  />
                </div>
              </div>

              <GlobalButton
                className="w-full"
                onPress={() => {
                  detailsDrawer.onClose();
                  router.push(`/app/new/email/template?id=${selectedTemplate._id}`);
                }}
              >
                Edit template
              </GlobalButton>
            </DrawerBody>
          </>
        )}
      </GlobalDrawer>
    </PageComponent>
  );
}
