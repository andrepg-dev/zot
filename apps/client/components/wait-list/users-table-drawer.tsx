"use client";

import { deleteWaitListUser, getWaitListUserCount, getWaitListUsers } from "@/actions/wait-list/wait-list-user.actions";
import GlobalButton from "@/components/global/button";
import GlobalDrawer from "@/components/global/drawer";
import Chip from "@/components/ui/chip";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import {
  DrawerBody,
  DrawerHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
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
import Type from "../type";

import { formatDate } from "@/lib/format-date";

const baseColumns = [
  { key: "position", label: "#" },
  { key: "email", label: "Email" },
  { key: "referredBy", label: "Referred By" },
  { key: "createdAt", label: "Joined" }
];

interface UsersTableDrawerProps {
  waitlistId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UsersTableDrawer({ waitlistId, isOpen, onOpenChange }: UsersTableDrawerProps) {
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [emailsToDelete, setEmailsToDelete] = useState<string[]>([]);
  const confirmModal = useDisclosure();
  const queryClient = useQueryClient();

  const { data: users, isPending } = useQuery({
    queryKey: ["waitlist-users", waitlistId],
    queryFn: () => getWaitListUsers(waitlistId),
    enabled: isOpen
  });

  const { data: counts } = useQuery({
    queryKey: ["waitlist-user-count", waitlistId],
    queryFn: () => getWaitListUserCount(waitlistId),
    enabled: isOpen
  });

  const deleteMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      await Promise.all(emails.map((email) => deleteWaitListUser(waitlistId, email)));
    },
    onSuccess: (_data, emails) => {
      queryClient.invalidateQueries({ queryKey: ["waitlist-users", waitlistId] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-user-count", waitlistId] });
      setSelectedKeys(new Set());
      setEmailsToDelete([]);
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
          Object.values(user.metadata).some((v) =>
            String(v).toLowerCase().includes(query)
          ))
    );
  }, [users, search]);

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
    <>
      <GlobalDrawer isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" expandedSize="5xl">
        <DrawerHeader className="flex flex-col gap-1">
          <h2 className="text-base font-medium">Users Table</h2>
          <p className="text-sm text-muted-foreground font-normal">
            {counts?.total ?? 0} total users · {counts?.referred ?? 0} referred
          </p>
        </DrawerHeader>

        <DrawerBody className="overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Input
                placeholder="Search by email..."
                variant="bordered"
                startContent={<MagnifyingGlassIcon className="text-default-300 size-5" />}
                size="sm"
                isClearable
                value={search}
                onValueChange={setSearch}
                classNames={{
                  base: "max-w-sm",
                  inputWrapper: "border-1"
                }}
              />

              <div className="flex gap-2 items-center">
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

                <span className="text-default-400 text-small">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <Table
              aria-label="Waitlist Users Table"
              radius="sm"
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
                classNames: {
                  wrapper: "before:border-1"
                }
              }}
              classNames={{
                th: "!rounded-b-none",
                wrapper: "p-0 border",
                td: "first:before:rounded-none last:before:rounded-e-none py-3"
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
                items={filteredUsers.map((user, index) => ({ ...user, position: index + 1 }))}
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
                          <span className="text-muted-foreground font-mono truncate block max-w-[200px]">{item.position}</span>
                        ),
                        email: (
                          <span className="font-mono truncate block max-w-[200px]">
                            {item.email}
                          </span>
                        ),
                        referredBy: item.referredBy ? (
                          <span className="font-mono text-xs truncate block max-w-[200px]">
                            {referralCodeToEmail.get(item.referredBy) ?? item.referredBy}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs truncate block max-w-[200px]">—</span>
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
        </DrawerBody>
      </GlobalDrawer>

      <Modal isOpen={confirmModal.isOpen} onOpenChange={confirmModal.onOpenChange} radius="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to remove {emailsToDelete.length} user{emailsToDelete.length > 1 ? "s" : ""} from this waitlist? This action cannot be undone.
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
    </>
  );
}
