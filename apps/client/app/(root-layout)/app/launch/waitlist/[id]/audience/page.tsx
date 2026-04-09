"use client";

import { getWaitListStats } from "@/actions/wait-list/stats.actions";
import { deleteWaitListUser, getWaitListUsers } from "@/actions/wait-list/wait-list-user.actions";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { formatDate } from "@/lib/format-date";
import { exportToCsv } from "@/lib/utils";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
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
  { key: "position", label: "#" },
  { key: "email", label: "Email" },
  { key: "referredBy", label: "Referred By" },
  { key: "createdAt", label: "Joined" }
];

export default function AudiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [emailsToDelete, setEmailsToDelete] = useState<string[]>([]);
  const confirmModal = useDisclosure();
  const queryClient = useQueryClient();

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

  function handleExportCsv() {
    const source =
      selectedKeys.size > 0 ? filteredUsers.filter((u) => selectedKeys.has(u._id)) : filteredUsers;

    if (source.length === 0) {
      addToast({ description: "No users to export", color: "warning" });
      return;
    }

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
              onPress={handleExportCsv}
            >
              Export CSV
            </GlobalButton>
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
              <TableColumn key={column.key} allowsSorting>
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
              <TableRow key={item._id}>
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
                    position: (
                      <span className="text-muted-foreground font-mono truncate block max-w-[200px]">
                        {item.position}
                      </span>
                    ),
                    email: (
                      <span className="font-mono truncate block max-w-[200px] text-xs">
                        {item.email}
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
                    )
                  };
                  return <TableCell>{valueMap[key]}</TableCell>;
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
