"use client";

import { getWaitListStats } from "@/actions/wait-list/stats.actions";
import { deleteWaitListUser, getWaitListUsers } from "@/actions/wait-list/wait-list-user.actions";
import GlobalButton from "@/components/global/button";
import PrimaryActionButton from "@/components/global/primary-action-button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import InputComponent from "@/components/ui/input";
import ImportUsersModal, {
  type ImportMethod
} from "@/components/wait-list/import-users-modal";
import SendCampaignModal from "@/components/wait-list/send-campaign-modal";
import { useHotkey } from "@/hooks/use-hotkey";
import { formatDateTime } from "@/lib/format-date";
import { exportToCsv } from "@/lib/utils";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  Square2StackIcon,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

const baseColumns = [
  { key: "createdAt", label: "Joined" },
  { key: "email", label: "Email" },
  { key: "referredBy", label: "Referred By" },
  { key: "position", label: "Position" },
  { key: "status", label: "Status" }
];

function PositionCell({ position }: { position: number }) {
  return (
    <div className="flex items-center gap-1 border bg-default-100/70 w-min">
      <span className="text-xs font-mono px-1.5 py-0.5 rounded-sm">#{position}</span>
    </div>
  );
}

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
  const importModal = useDisclosure();
  const [importMethod, setImportMethod] = useState<ImportMethod>("paste");
  const queryClient = useQueryClient();

  function handleOpenImport(method: ImportMethod) {
    setImportMethod(method);
    importModal.onOpen();
  }

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
    return [...baseColumns, ...metaCols, { key: "action", label: "Action" }];
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

  function handleInvite(userId: string) {
    setSelectedKeys(new Set([userId]));
    sendModal.onOpen();
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

  const campaignUsers = React.useMemo(
    () =>
      (users ?? [])
        .filter((u) => selectedKeys.has(u._id))
        .map((u) => ({
          _id: u._id,
          email: u.email,
          name: u.name,
          position: u.position,
          referredBy: u.referredBy,
          metadata: u.metadata
        })),
    [users, selectedKeys]
  );

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

            <Dropdown>
              <DropdownTrigger>
                <GlobalButton
                  size="sm"
                  variant="faded"
                  startContent={<ArrowUpTrayIcon className="size-4" />}
                  endContent={<ChevronDownIcon className="size-4" />}
                >
                  Add users
                </GlobalButton>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Add users"
                onAction={(key) => handleOpenImport(key as ImportMethod)}
              >
                <DropdownItem
                  key="manual"
                  startContent={<PencilSquareIcon className="size-4" />}
                  description="Add a single user by email"
                >
                  Add manually
                </DropdownItem>
                <DropdownItem
                  key="paste"
                  startContent={<ClipboardDocumentListIcon className="size-4" />}
                  description="Paste a list of emails"
                >
                  Paste emails
                </DropdownItem>
                <DropdownItem
                  key="csv"
                  startContent={<ArrowUpTrayIcon className="size-4" />}
                  description="Upload a .csv file"
                >
                  Upload CSV
                </DropdownItem>
                <DropdownItem
                  key="from-waitlist"
                  startContent={<Square2StackIcon className="size-4" />}
                  description="Copy users from another waitlist"
                >
                  From another waitlist
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

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

        <div className="flex flex-col border bg-background">
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
            isCompact
            radius="none"
            className="bg-default-50 border cursor-pointer"
            classNames={{
              td: "py-3",
              wrapper: "p-0",
              tbody: "font-mono"
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  allowsSorting={column.key !== "action"}
                  className={column.key === "action" ? "text-end" : "capitalize"}
                >
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

                    if (key === "action") {
                      const status = item.status ?? "waiting";
                      return (
                        <TableCell className="flex justify-end items-center gap-2">
                          {status === "waiting" && (
                            <GlobalButton
                              variant="bordered"
                              className="text-xs"
                              onPress={() => handleInvite(item._id)}
                            >
                              Invite
                            </GlobalButton>
                          )}

                          {status != "waiting" && "-"}
                        </TableCell>
                      );
                    }

                    if (key.startsWith("meta_")) {
                      const metaKey = key.replace("meta_", "");
                      const value = item.metadata?.[metaKey];
                      return (
                        <TableCell>
                          <Type
                            variant="sm"
                            className="text-muted-foreground truncate block max-w-[200px]"
                          >
                            {value != null ? String(value) : "—"}
                          </Type>
                        </TableCell>
                      );
                    }

                    const valueMap: Record<string, React.ReactNode> = {
                      email: (
                        <Type variant="sm" as="span" className="truncate block max-w-[200px]">
                          {item.email}
                        </Type>
                      ),
                      position: (
                        <Type variant="sm" as="span">
                          <PositionCell position={item.position ?? 0} />
                        </Type>
                      ),
                      referredBy: item.referredBy ? (
                        <Type variant="sm" className="truncate block max-w-[200px]">
                          {referralCodeToEmail.get(item.referredBy) ?? item.referredBy}
                        </Type>
                      ) : (
                        <Type
                          variant="sm"
                          className="text-muted-foreground truncate block max-w-[200px]"
                        >
                          —
                        </Type>
                      ),
                      createdAt: (
                        <Type
                          variant="sm"
                          className="text-muted-foreground truncate block max-w-[200px]"
                        >
                          {formatDateTime(item.createdAt)}
                        </Type>
                      ),
                      status: (() => {
                        const status = item.status ?? "waiting";
                        return (
                          <Chip status={STATUS_CHIP[status] ?? "neutral"} className="!rounded-sm">
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
      </div>

      <SendCampaignModal
        isOpen={sendModal.isOpen}
        onOpenChange={sendModal.onOpenChange}
        waitlistId={id}
        users={campaignUsers}
      />

      <ImportUsersModal
        isOpen={importModal.isOpen}
        onOpenChange={importModal.onOpenChange}
        waitlistId={id}
        initialMethod={importMethod}
      />

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
