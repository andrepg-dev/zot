"use client";

import { getBlockedUserCount, getBlockedUsers } from "@/actions/wait-list/wait-list-user.actions";
import GlobalDrawer from "@/components/global/drawer";
import Chip from "@/components/ui/chip";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  DrawerBody,
  DrawerHeader,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Type from "../type";

const columns = [
  { key: "email", label: "Email" },
  { key: "reasons", label: "Reasons" },
  { key: "createdAt", label: "Blocked At" }
];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

interface BlockedUsersTableDrawerProps {
  waitlistId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BlockedUsersTableDrawer({
  waitlistId,
  isOpen,
  onOpenChange
}: BlockedUsersTableDrawerProps) {
  const [search, setSearch] = useState("");

  const { data: blockedUsers, isPending } = useQuery({
    queryKey: ["blocked-users", waitlistId],
    queryFn: () => getBlockedUsers(waitlistId),
    enabled: isOpen
  });

  const { data: counts } = useQuery({
    queryKey: ["blocked-user-count", waitlistId],
    queryFn: () => getBlockedUserCount(waitlistId),
    enabled: isOpen
  });

  const filteredUsers = React.useMemo(() => {
    if (!blockedUsers) return [];
    if (!search.trim()) return blockedUsers;
    const query = search.toLowerCase();
    return blockedUsers.filter((user) => user.email.toLowerCase().includes(query));
  }, [blockedUsers, search]);

  return (
    <GlobalDrawer isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" expandedSize="4xl">
      <DrawerHeader className="flex flex-col gap-1">
        <h2 className="text-base font-medium">Blocked Users</h2>
        <p className="text-sm text-muted-foreground font-normal">
          {counts?.total ?? 0} users blocked
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

            <span className="text-default-400 text-small">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </span>
          </div>

          <Table
            aria-label="Blocked Users Table"
            radius="sm"
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
              items={filteredUsers}
              isLoading={isPending}
              loadingContent={<Spinner size="sm" />}
              emptyContent={<Type>No blocked users yet.</Type>}
            >
              {(item) => (
                <TableRow key={item._id}>
                  {(columnKey) => {
                    const valueMap: Record<string, React.ReactNode> = {
                      email: <span className="font-mono">{item.email}</span>,
                      reasons: (
                        <div className="flex gap-1 flex-wrap">
                          {item.reasons.map((reason) => (
                            <Chip key={reason} status="danger">
                              {reason}
                            </Chip>
                          ))}
                        </div>
                      ),
                      createdAt: (
                        <span className="text-muted-foreground font-mono text-xs">
                          {formatDate(item.createdAt)}
                        </span>
                      )
                    };
                    return <TableCell>{valueMap[String(columnKey)]}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DrawerBody>
    </GlobalDrawer>
  );
}
