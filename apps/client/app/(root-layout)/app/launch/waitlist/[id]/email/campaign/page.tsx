"use client";

import { getWaitListUsers } from "@/actions/wait-list/wait-list-user.actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
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

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [search, setSearch] = useState("");

  const { data: users, isPending } = useQuery({
    queryKey: [id, "waitlist-users"],
    queryFn: async () => await getWaitListUsers(id)
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
          Object.values(user.metadata).some((v) =>
            String(v).toLowerCase().includes(query)
          ))
    );
  }, [users, search]);

  return (
    <PageComponent className="flex flex-col gap-6">
      <Title description="Manage and view all users in this waitlist">Campaign</Title>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search by email, referral code or metadata..."
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
          aria-label="Waitlist Users Table"
          radius="sm"
          selectionMode="multiple"
          checkboxesProps={{
            size: "sm",
            classNames: { wrapper: "before:border-1" }
          }}
          classNames={{
            th: "!rounded-b-none",
            wrapper: "p-0 border",
            td: "first:before:rounded-none last:before:rounded-e-none cursor-pointer py-3"
          }}
        >
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>

          <TableBody
            items={filteredUsers.map((user, index) => ({ ...user, position: index + 1 }))}
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
                        <span className="text-muted-foreground font-mono truncate block max-w-[200px]">{item.position}</span>
                      </TableCell>
                    );
                  }

                  if (key === "email") {
                    return (
                      <TableCell>
                        <span className="font-mono text-xs truncate block max-w-[200px]">{item.email}</span>
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
                          <span className="text-muted-foreground text-xs truncate block max-w-[200px]">—</span>
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
    </PageComponent>
  );
}
