"use client";

import { sendEmail } from "@/actions/emails/emails.actions";
import { deleteWaitListUser, getWaitListUsers } from "@/actions/wait-list/wait-list-user.actions";
import GlobalButton from "@/components/global/button";
import PrimaryActionButton from "@/components/global/primary-action-button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import CampaignResultAnimation from "@/components/wait-list/campaign-result-animation";
import CampaignSentAnimation, {
  getAnimationHeight,
  getFramesPerRow
} from "@/components/wait-list/campaign-sent-animation";
import { useHotkey } from "@/hooks/use-hotkey";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
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
import { addToast } from "@heroui/toast";
import { Player } from "@remotion/player";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";

import { formatDate } from "@/lib/format-date";

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [search, setSearch] = useState("");
  const sendModal = useDisclosure();

  useHotkey({ key: "k", modifiers: ["meta"], onPress: sendModal.onOpen });

  const queryClient = useQueryClient();

  const { data: users, isPending } = useQuery({
    queryKey: [id, "waitlist-users"],
    queryFn: async () => await getWaitListUsers(id)
  });

  const [quantity, setQuantity] = useState("0");
  const [animationPhase, setAnimationPhase] = useState<"idle" | "list" | "result">("idle");
  const [sentEmails, setSentEmails] = useState<string[]>([]);
  const [sendResult, setSendResult] = useState<"pending" | "success" | "error">("pending");
  const [sendError, setSendError] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const [emailsToDelete, setEmailsToDelete] = useState<string[]>([]);
  const confirmModal = useDisclosure();

  useEffect(() => {
    if (users?.length) setQuantity(String(users.length));
  }, [users?.length]);

  const displayCount = Math.min(sentEmails.length, 50);
  const framesPerRow = getFramesPerRow(displayCount);
  const animationFrames = 10 + displayCount * framesPerRow + 40;
  const animationDurationMs = (animationFrames / 30) * 1000;

  // After list animation finishes, transition to result phase
  useEffect(() => {
    if (animationPhase !== "list") return;
    const timer = setTimeout(() => {
      setAnimationPhase("result");
    }, animationDurationMs);
    return () => clearTimeout(timer);
  }, [animationPhase, animationDurationMs]);

  function handleCloseModal() {
    setAnimationPhase("idle");
    setSendResult("pending");
    sendModal.onClose();
  }

  const { mutate: sendCampaign, isPending: isSending } = useMutation({
    mutationFn: (qty: number) => sendEmail({ waitlistId: id, quantity: qty }),
    onSuccess: (_data, qty) => {
      queryClient.invalidateQueries({ queryKey: [id, "email-records"] });
      queryClient.invalidateQueries({ queryKey: [id, "email-records-list"] });
      posthog.capture("email_campaign_sent", { waitlist_id: id, quantity: qty });
      setSendResult("success");
    },
    onError: (err) => {
      setSendResult("error");
      setSendError(err.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      await deleteWaitListUser(id, emails);
    },
    onSuccess: (_data, emails) => {
      queryClient.invalidateQueries({ queryKey: [id, "waitlist-users"] });
      setSelectedKeys([]);
      setEmailsToDelete([]);
      posthog.capture("waitlist_user_removed", { waitlist_id: id, count: emails.length });
      addToast({
        title: "Removed",
        description: `${emails.length} user${emails.length > 1 ? "s" : ""} removed from the waitlist.`,
        color: "danger"
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

  function handleSend() {
    const qty = Number(quantity);
    const emails = (users ?? []).slice(0, qty).map((u) => u.email);
    setSentEmails(emails);
    setSendResult("pending");
    setSendError("");
    setAnimationPhase("list");
    sendCampaign(qty);
  }

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
    const base = [
      { key: "position", label: "#" },
      { key: "email", label: "Email" },
      { key: "referredBy", label: "Referred By" },
      { key: "createdAt", label: "Joined" }
    ];
    const metaCols = metadataKeys.map((k) => ({ key: `meta_${k}`, label: k }));
    return [...base, ...metaCols];
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
        user.referral_code?.toLowerCase().includes(query) ||
        (user.metadata &&
          Object.values(user.metadata).some((v) => String(v).toLowerCase().includes(query)))
    );
  }, [users, search]);

  const handleDeleteSelected = () => {
    const emails = filteredUsers
      .filter((user) => selectedKeys.includes(user._id))
      .map((user) => user.email);

    if (emails.length === 0) return;

    setEmailsToDelete(emails);
    confirmModal.onOpen();
  };

  function handleConfirmDelete(onClose: () => void) {
    deleteMutation.mutate(emailsToDelete, {
      onSettled: () => onClose()
    });
  }

  return (
    <PageComponent className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Title description="Manage and view all users in this waitlist">Campaign</Title>

        <div className="flex gap-2">
          {selectedKeys.length > 0 && (
            <Dropdown>
              <DropdownTrigger>
                <GlobalButton
                  size="sm"
                  variant="faded"
                  endContent={<ChevronDownIcon className="size-4" />}
                >
                  Actions ({selectedKeys.length})
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

          <PrimaryActionButton
            startContent={<RocketLaunchIcon className="size-4" />}
            onPress={sendModal.onOpen}
          >
            Send campaign
            <Kbd keys={["command"]} className="text-xs">
              K
            </Kbd>
          </PrimaryActionButton>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <InputComponent
            placeholder="Search by email, referral code or metadata..."
            startContent={<MagnifyingGlassIcon className="text-default-300 size-5" />}
            size="sm"
            isClearable
            value={search}
            onValueChange={setSearch}
            className="w-[350px]"
          />

          <span className="text-default-400 text-small">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>

        <Table
          aria-label="Waitlist Users Table"
          isHeaderSticky
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys == "all") {
              setSelectedKeys(filteredUsers.map((u) => u._id));
            } else {
              setSelectedKeys(Array.from(keys as Set<string>));
            }
          }}
          checkboxesProps={{
            size: "sm",
            classNames: { wrapper: "before:border-1" }
          }}
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
            items={filteredUsers}
            isLoading={isPending}
            loadingContent={<Spinner size="sm" />}
            emptyContent={<Type>No users yet.</Type>}
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => {
                  const key = String(columnKey);

                  if (key === "position") {
                    return (
                      <TableCell>
                        <span className="text-muted-foreground font-mono truncate block max-w-[200px]">
                          {item.position}
                        </span>
                      </TableCell>
                    );
                  }

                  if (key === "email") {
                    return (
                      <TableCell>
                        <span className="font-mono text-xs truncate block max-w-[200px]">
                          {item.email}
                        </span>
                      </TableCell>
                    );
                  }

                  if (key === "referredBy") {
                    return (
                      <TableCell>
                        {item.referredBy ? (
                          <span className="font-mono text-xs truncate block max-w-[200px]">
                            {referralCodeToEmail.get(item.referredBy) ?? item.referredBy}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs truncate block max-w-[200px]">
                            —
                          </span>
                        )}
                      </TableCell>
                    );
                  }

                  if (key === "createdAt") {
                    return (
                      <TableCell>
                        <span className="text-muted-foreground font-mono text-xs truncate block max-w-[200px]">
                          {formatDate(item.createdAt)}
                        </span>
                      </TableCell>
                    );
                  }

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

                  return <TableCell>—</TableCell>;
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
            // Phase 1: List scrolling animation
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

            // Phase 2: Result (pending spinner, success, or error)
            if (animationPhase === "result") {
              return (
                <>
                  <ModalBody className="p-0 overflow-hidden">
                    <Player
                      key={sendResult}
                      component={CampaignResultAnimation}
                      inputProps={{
                        status: sendResult,
                        message:
                          sendResult === "success"
                            ? `${sentEmails.length} emails dispatched`
                            : sendResult === "error"
                              ? sendError
                              : "Waiting for server response..."
                      }}
                      durationInFrames={9000}
                      fps={30}
                      compositionWidth={460}
                      compositionHeight={160}
                      autoPlay
                      loop={sendResult === "pending"}
                      style={{ width: "100%", height: 160 }}
                    />
                  </ModalBody>
                  {sendResult !== "pending" && (
                    <ModalFooter className="justify-center">
                      <GlobalButton variant="light" onPress={handleCloseModal}>
                        Close
                      </GlobalButton>
                    </ModalFooter>
                  )}
                </>
              );
            }

            // Default: form
            return (
              <>
                <ModalHeader>Send Email Campaign</ModalHeader>
                <ModalBody>
                  <p className="text-sm text-muted-foreground">
                    How many users do you want to send the email campaign to? There are currently{" "}
                    <strong>{users?.length ?? 0}</strong> users in this waitlist.
                  </p>

                  <InputComponent
                    type="number"
                    placeholder={`Max ${users?.length ?? 0}`}
                    variant="bordered"
                    value={quantity}
                    onValueChange={setQuantity}
                    classNames={{ inputWrapper: "border-1" }}
                  />
                </ModalBody>
                <ModalFooter>
                  <GlobalButton variant="light" onPress={handleCloseModal}>
                    Cancel
                  </GlobalButton>
                  <PrimaryActionButton
                    startContent={<RocketLaunchIcon className="size-4" />}
                    isDisabled={
                      !quantity || Number(quantity) < 1 || Number(quantity) > (users?.length ?? 0)
                    }
                    isLoading={isSending}
                    onPress={handleSend}
                  >
                    Send to {quantity || 0} users
                  </PrimaryActionButton>
                </ModalFooter>
              </>
            );
          }}
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
