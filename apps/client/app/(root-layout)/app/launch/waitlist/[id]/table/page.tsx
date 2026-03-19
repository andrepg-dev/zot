"use client";

import { deleteWaitListUser, getWaitListUsers, getWaitListUserCount } from "@/actions/wait-list/wait-list-user.actions";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import Chip from "@/components/ui/chip";
import {
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  TrashIcon,
  UserGroupIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
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
import { addToast } from "@heroui/toast";
import NumberFlow from "@number-flow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

const columns = [
  { key: "position", label: "#" },
  { key: "email", label: "Email" },
  { key: "referral_code", label: "Referral Code" },
  { key: "referredBy", label: "Referred By" },
  { key: "createdAt", label: "Joined" },
  { key: "actions", label: "" }
];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default function WaitListUsersTable({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isPending } = useQuery({
    queryKey: ["waitlist-users", id],
    queryFn: () => getWaitListUsers(id)
  });

  const { data: counts } = useQuery({
    queryKey: ["waitlist-user-count", id],
    queryFn: () => getWaitListUserCount(id)
  });

  const deleteMutation = useMutation({
    mutationFn: (email: string) => deleteWaitListUser(id, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist-users", id] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-user-count", id] });
      addToast({
        title: "User removed",
        description: "The user has been removed from the waitlist.",
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

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;
    const query = search.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.referral_code.toLowerCase().includes(query)
    );
  }, [users, search]);

  const stats = [
    {
      id: 1,
      title: "Total Users",
      value: counts?.total ?? 0,
      icon: UserGroupIcon,
      iconColor: "text-blue-500"
    },
    {
      id: 2,
      title: "Referred Users",
      value: counts?.referred ?? 0,
      icon: ShareIcon,
      iconColor: "text-green-500"
    },
    {
      id: 3,
      title: "Organic Users",
      value: (counts?.total ?? 0) - (counts?.referred ?? 0),
      icon: UserPlusIcon,
      iconColor: "text-yellow-500"
    }
  ];

  return (
    <>
      <HeaderNavigation
        navigationItems={[
          { label: "Wait-List", pathname: "/app/waitlist/dashboard" },
          { label: "Overview", pathname: `/app/launch/waitlist/${id}` },
          { label: "Users", pathname: "" }
        ]}
      />

      <PageComponent>
        <Title description="View and manage all users registered in this waitlist">
          Users
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {stats.map((stat) => (
            <div key={stat.id} className="border rounded bg-background">
              <div className="px-5 py-4.5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <NumberFlow value={stat.value} className="text-2xl font-semibold" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <stat.icon className={`size-4 ${stat.iconColor}`} />
                    <p className="text-xs text-muted-foreground font-mono">{stat.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search by email or referral code..."
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
            classNames={{
              th: "!rounded-b-none",
              wrapper: "p-0 border",
              td: "first:before:rounded-none last:before:rounded-e-none py-3"
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key} allowsSorting={column.key !== "actions"}>
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={filteredUsers.map((user, index) => ({ ...user, position: index + 1 }))}
              isLoading={isPending}
              loadingContent={<Spinner size="sm" />}
              emptyContent="No users registered yet."
            >
              {(item) => (
                <TableRow key={item._id}>
                  {(columnKey) => {
                    const valueMap: Record<string, React.ReactNode> = {
                      position: (
                        <span className="text-muted-foreground font-mono">{item.position}</span>
                      ),
                      email: <span className="font-mono">{item.email}</span>,
                      referral_code: (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs">{item.referral_code}</span>
                          <GlobalButton
                            isIconOnly
                            variant="flat"
                            className="min-w-5 h-5 cursor-pointer"
                            onPress={() => {
                              navigator.clipboard.writeText(item.referral_code);
                              addToast({
                                title: "Copied",
                                description: "Referral code copied to clipboard."
                              });
                            }}
                          >
                            <ClipboardDocumentIcon className="size-3.5" />
                          </GlobalButton>
                        </div>
                      ),
                      referredBy: item.referredBy ? (
                        <Chip status="active">Referred</Chip>
                      ) : (
                        <Chip status="neutral">Organic</Chip>
                      ),
                      createdAt: (
                        <span className="text-muted-foreground font-mono text-xs">
                          {formatDate(item.createdAt)}
                        </span>
                      ),
                      actions: (
                        <GlobalButton
                          isIconOnly
                          variant="light"
                          className="min-w-5 h-5 cursor-pointer text-danger"
                          onPress={() => deleteMutation.mutate(item.email)}
                          isLoading={deleteMutation.isPending}
                        >
                          <TrashIcon className="size-3.5" />
                        </GlobalButton>
                      )
                    };
                    return <TableCell>{valueMap[String(columnKey)]}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </PageComponent>
    </>
  );
}
