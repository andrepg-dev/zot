"use client";

import { getEmailTemplates } from "@/actions/email-templates/email-templates.actions";
import { sendEmailToUsersById } from "@/actions/emails/emails.actions";
import { getWaitListStats } from "@/actions/wait-list/stats.actions";
import { deleteWaitListUser, getWaitListUsers } from "@/actions/wait-list/wait-list-user.actions";
import GlobalButton from "@/components/global/button";
import PrimaryActionButton from "@/components/global/primary-action-button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import InputComponent from "@/components/ui/input";
import CampaignResultAnimation from "@/components/wait-list/campaign-result-animation";
import CampaignSentAnimation, {
  getAnimationHeight,
  getFramesPerRow
} from "@/components/wait-list/campaign-sent-animation";
import { useHotkey } from "@/hooks/use-hotkey";
import { formatDate } from "@/lib/format-date";
import { exportToCsv } from "@/lib/utils";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  RocketLaunchIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { Kbd } from "@heroui/kbd";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure
} from "@heroui/react";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { Player } from "@remotion/player";
import type { EmailTemplate } from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";

const baseColumns = [
  { key: "createdAt", label: "Joined" },
  { key: "email", label: "Email" },
  { key: "referredBy", label: "Referred By" },
  { key: "status", label: "Status" }
];

const STATUS_CHIP: Record<string, "warning" | "primary" | "active" | "neutral"> = {
  waiting: "neutral",
  invited: "active",
  converted: "active",
  churned: "warning"
};

export default function AudiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [emailsToDelete, setEmailsToDelete] = useState<string[]>([]);
  const confirmModal = useDisclosure();
  const exportModal = useDisclosure();
  const sendModal = useDisclosure();
  const queryClient = useQueryClient();

  const [animationPhase, setAnimationPhase] = useState<"idle" | "list" | "result">("idle");
  const [sentEmails, setSentEmails] = useState<string[]>([]);

  useHotkey({
    key: "k",
    modifiers: ["meta"],
    onPress: () => {
      if (selectedKeys.size > 0) sendModal.onOpen();
    }
  });

  const { data: users, isPending } = useQuery({
    queryKey: [id, "audience"],
    queryFn: () => getWaitListUsers(id)
  });

  const { data: waitlistStats } = useQuery({
    queryKey: [id],
    queryFn: () => getWaitListStats(id)
  });

  const { data: templates } = useQuery({
    queryKey: ["email-templates"],
    queryFn: getEmailTemplates
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const selectedTemplate = React.useMemo(
    () => ((templates ?? []) as EmailTemplate[]).find((t) => t._id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  const displayCount = Math.min(sentEmails.length, 50);
  const framesPerRow = getFramesPerRow(displayCount);
  const animationFrames = 10 + displayCount * framesPerRow + 40;
  const animationDurationMs = (animationFrames / 30) * 1000;

  useEffect(() => {
    if (animationPhase !== "list") return;
    const timer = setTimeout(() => {
      setAnimationPhase("result");
    }, animationDurationMs);
    return () => clearTimeout(timer);
  }, [animationPhase, animationDurationMs]);

  function handleCloseModal() {
    setAnimationPhase("idle");
    resetSend();
    sendModal.onClose();
  }

  const {
    mutate: sendCampaign,
    isPending: isSending,
    isSuccess: isSendSuccess,
    isError: isSendError,
    error: sendError,
    reset: resetSend
  } = useMutation({
    mutationFn: (userIds: string[]) =>
      sendEmailToUsersById(id, { users: userIds, templateId: selectedTemplate?._id }),
    onSuccess: (_data, userIds) => {
      queryClient.invalidateQueries({ queryKey: [id, "email-records"] });
      queryClient.invalidateQueries({ queryKey: [id, "email-records-list"] });
      posthog.capture("email_campaign_sent", { waitlist_id: id, quantity: userIds.length });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      await deleteWaitListUser(id, emails);
    },
    onSuccess: (_data, emails) => {
      queryClient.invalidateQueries({ queryKey: [id, "audience"] });
      queryClient.invalidateQueries({ queryKey: [id] });
      setSelectedKeys(new Set());
      setEmailsToDelete([]);
      addToast({
        title: "Removed",
        description: `${emails.length} user${emails.length > 1 ? "s" : ""} removed from the waitlist.`,
        color: "danger"
      });
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const metadataKeys = React.useMemo(() => {
    if (!users) return [];
    const keys = new Set<string>();
    users.forEach((user) => {
      if (user.metadata) {
        Object.keys(user.metadata).forEach((k) => keys.add(k));
      }
    });
    return Array.from(keys);
  }, [users]);

  const columns = React.useMemo(() => {
    const metaCols = metadataKeys.map((k) => ({ key: `meta_${k}`, label: k }));
    return [...baseColumns, ...metaCols];
  }, [metadataKeys]);

  const referralCodeToEmail = React.useMemo(() => {
    if (!users) return new Map<string, string>();
    return new Map(users.map((u) => [u.referral_code, u.email]));
  }, [users]);

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;
    const query = search.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        (user.metadata &&
          Object.values(user.metadata).some((v) => String(v).toLowerCase().includes(query)))
    );
  }, [users, search]);

  const exportSource = React.useMemo(
    () =>
      selectedKeys.size > 0 ? filteredUsers.filter((u) => selectedKeys.has(u._id)) : filteredUsers,
    [selectedKeys, filteredUsers]
  );

  function handleExportCsvClick() {
    if (exportSource.length === 0) {
      addToast({ description: "No users to export", color: "warning" });
      return;
    }
    exportModal.onOpen();
  }

  function handleConfirmExport(onClose: () => void) {
    const source = exportSource;

    exportToCsv({
      rows: source,
      headers: ["position", "email", "referredBy", "createdAt", ...metadataKeys],
      getRow: (u) => [
        u.position,
        u.email,
        u.referredBy ? (referralCodeToEmail.get(u.referredBy) ?? u.referredBy) : "",
        u.createdAt,
        ...metadataKeys.map((k) => u.metadata?.[k] ?? "")
      ],
      filename: `${(waitlistStats?.name ?? "waitlist").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}-users-${new Date().toISOString().slice(0, 10)}.csv`
    });

    addToast({ description: `Exported ${source.length} users`, color: "success" });
    onClose();
  }

  function handleDeleteSelected() {
    const emails = filteredUsers
      .filter((user) => selectedKeys.has(user._id))
      .map((user) => user.email);

    if (emails.length === 0) return;

    setEmailsToDelete(emails);
    confirmModal.onOpen();
  }

  function handleConfirmDelete(onClose: () => void) {
    deleteMutation.mutate(emailsToDelete, {
      onSettled: () => onClose()
    });
  }

  function handleRowDoubleClick(userId?: string) {
    if (selectedKeys.size > 0) {
      sendModal.onOpen();
      return;
    }
    if (userId) {
      setSelectedKeys(new Set([userId]));
      sendModal.onOpen();
    }
  }

  function handleSend() {
    const ids = Array.from(selectedKeys);
    const emails = (users ?? []).filter((u) => selectedKeys.has(u._id)).map((u) => u.email);
    setSentEmails(emails);
    setAnimationPhase("list");
    sendCampaign(ids);
  }

  return (
    <PageComponent>
      <Title description="All registered users in this waitlist">Audience</Title>

      <div className="flex flex-col gap-4 mt-6">
        <div className="flex justify-between items-center">
          <InputComponent
            placeholder="Search by email..."
            variant="bordered"
            startContent={<MagnifyingGlassIcon className="text-default-300 size-5" />}
            size="sm"
            isClearable
            value={search}
            onValueChange={setSearch}
          />

          <div className="flex gap-4 items-end">
            <span className="text-default-400 text-small">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </span>

            {selectedKeys.size > 0 && (
              <Dropdown>
                <DropdownTrigger>
                  <GlobalButton
                    size="sm"
                    variant="faded"
                    endContent={<ChevronDownIcon className="size-4" />}
                  >
                    Actions ({selectedKeys.size})
                  </GlobalButton>
                </DropdownTrigger>
                <DropdownMenu aria-label="Actions">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<TrashIcon className="size-4" />}
                    onPress={handleDeleteSelected}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}

            <GlobalButton
              size="sm"
              variant="faded"
              startContent={<ArrowDownTrayIcon className="size-4" />}
              onPress={handleExportCsvClick}
            >
              Export CSV
            </GlobalButton>

            <PrimaryActionButton
              startContent={<RocketLaunchIcon className="size-4" />}
              isDisabled={selectedKeys.size === 0}
              onPress={sendModal.onOpen}
            >
              Send campaign{selectedKeys.size > 0 ? ` (${selectedKeys.size})` : ""}
              <Kbd keys={["command"]} className="text-xs">
                K
              </Kbd>
            </PrimaryActionButton>
          </div>
        </div>

        <Table
          aria-label="Audience Table"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys === "all") {
              setSelectedKeys(new Set(filteredUsers.map((u) => u._id)));
            } else {
              setSelectedKeys(new Set(keys as Set<string>));
            }
          }}
          checkboxesProps={{
            size: "sm",
            classNames: { wrapper: "before:border-1" }
          }}
          radius="none"
          className="bg-default-50 border"
          classNames={{
            td: "py-3",
            wrapper: "p-0"
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} allowsSorting className="capitalize">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody
            items={filteredUsers}
            isLoading={isPending}
            loadingContent={<Spinner size="sm" />}
            emptyContent={<Type>No users registered yet.</Type>}
          >
            {(item) => (
              <TableRow
                key={item._id}
                onDoubleClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleRowDoubleClick(item._id);
                }}
              >
                {(columnKey) => {
                  const key = String(columnKey);

                  if (key.startsWith("meta_")) {
                    const metaKey = key.replace("meta_", "");
                    const value = item.metadata?.[metaKey];
                    return (
                      <TableCell>
                        <span className="font-mono text-xs text-muted-foreground truncate block max-w-[200px]">
                          {value != null ? String(value) : "—"}
                        </span>
                      </TableCell>
                    );
                  }

                  const valueMap: Record<string, React.ReactNode> = {
                    email: (
                      <span className="font-mono truncate block max-w-[200px] text-xs">
                        <span className="text-muted-foreground">#{item.position}</span> {item.email}
                      </span>
                    ),
                    referredBy: item.referredBy ? (
                      <span className="font-mono text-xs truncate block max-w-[200px]">
                        {referralCodeToEmail.get(item.referredBy) ?? item.referredBy}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs truncate block max-w-[200px]">
                        —
                      </span>
                    ),
                    createdAt: (
                      <span className="text-muted-foreground font-mono text-xs truncate block max-w-[200px]">
                        {formatDate(item.createdAt)}
                      </span>
                    ),
                    status: (() => {
                      const status = item.status ?? "waiting";
                      return (
                        <Chip
                          status={STATUS_CHIP[status] ?? "neutral"}
                          className="!rounded-sm"
                        >
                          {status}
                        </Chip>
                      );
                    })()
                  };
                  return <TableCell>{valueMap[key]}</TableCell>;
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={sendModal.isOpen}
        onOpenChange={sendModal.onOpenChange}
        radius="sm"
        isDismissable={animationPhase === "idle"}
        hideCloseButton={animationPhase !== "idle"}
      >
        <ModalContent>
          {() => {
            if (animationPhase === "list") {
              return (
                <ModalBody className="p-0 overflow-hidden">
                  <Player
                    component={CampaignSentAnimation}
                    inputProps={{ emails: sentEmails }}
                    durationInFrames={animationFrames}
                    fps={30}
                    compositionWidth={460}
                    compositionHeight={getAnimationHeight(sentEmails.length)}
                    autoPlay
                    style={{ width: "100%", height: getAnimationHeight(sentEmails.length) }}
                  />
                </ModalBody>
              );
            }

            if (animationPhase === "result") {
              const status = isSendSuccess ? "success" : isSendError ? "error" : "pending";

              return (
                <>
                  <ModalBody className="p-0 overflow-hidden">
                    <Player
                      key={status}
                      component={CampaignResultAnimation}
                      inputProps={{
                        status,
                        message: isSendSuccess
                          ? `${sentEmails.length} emails dispatched`
                          : isSendError
                            ? (sendError?.message ?? "An error occurred")
                            : "Waiting for server response..."
                      }}
                      durationInFrames={9000}
                      fps={30}
                      compositionWidth={460}
                      compositionHeight={160}
                      autoPlay
                      loop={isSending}
                      style={{ width: "100%", height: 160 }}
                    />
                  </ModalBody>
                  {(isSendSuccess || isSendError) && (
                    <ModalFooter className="justify-center">
                      <GlobalButton variant="light" onPress={handleCloseModal}>
                        Close
                      </GlobalButton>
                    </ModalFooter>
                  )}
                </>
              );
            }

            return (
              <>
                <ModalHeader>Send Email Campaign</ModalHeader>
                <ModalBody>
                  <p className="text-sm text-muted-foreground">
                    You are about to send an email campaign to <strong>{selectedKeys.size}</strong>{" "}
                    selected user
                    {selectedKeys.size !== 1 ? "s" : ""}. Do you want to continue?
                  </p>

                  <Select
                    label="Email template"
                    placeholder="Select a template"
                    radius="sm"
                    size="sm"
                    selectedKeys={selectedTemplateId ? [selectedTemplateId] : []}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      if (key === "create-new") {
                        window.open("/app/emails/templates", "_blank");
                        return;
                      }
                      setSelectedTemplateId(key ?? "");
                    }}
                  >
                    <SelectSection title="Templates">
                      {((templates ?? []) as EmailTemplate[]).map((template) => (
                        <SelectItem key={template._id}>{template.alias}</SelectItem>
                      ))}
                    </SelectSection>
                    <SelectSection title="">
                      <SelectItem key="create-new" startContent={<PlusIcon className="size-4" />}>
                        Create new template
                      </SelectItem>
                    </SelectSection>
                  </Select>

                  {selectedTemplate?.preview && (
                    <div className="rounded-sm border overflow-hidden bg-white">
                      <Image
                        src={selectedTemplate.preview}
                        alt={selectedTemplate.alias}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <GlobalButton variant="light" onPress={handleCloseModal}>
                    Cancel
                  </GlobalButton>
                  <PrimaryActionButton
                    startContent={<RocketLaunchIcon className="size-4" />}
                    isDisabled={selectedKeys.size === 0 || !selectedTemplateId}
                    isLoading={isSending}
                    onPress={handleSend}
                  >
                    Send to {selectedKeys.size} user{selectedKeys.size !== 1 ? "s" : ""}
                  </PrimaryActionButton>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>

      <Modal isOpen={exportModal.isOpen} onOpenChange={exportModal.onOpenChange} radius="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Export CSV</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground font-normal">
                  You are about to export {exportSource.length} user
                  {exportSource.length !== 1 ? "s" : ""} to a CSV file. Do you want to continue?
                </p>
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={onClose}>
                  Cancel
                </GlobalButton>
                <GlobalButton color="primary" onPress={() => handleConfirmExport(onClose)}>
                  Export
                </GlobalButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={confirmModal.isOpen} onOpenChange={confirmModal.onOpenChange} radius="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to remove {emailsToDelete.length} user
                  {emailsToDelete.length > 1 ? "s" : ""} from this waitlist? This action cannot be
                  undone.
                </p>
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
    </PageComponent>
  );
}
