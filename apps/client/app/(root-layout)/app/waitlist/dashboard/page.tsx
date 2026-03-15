"use client";

import PageComponent from "@/components/layouts/page-component";
import {
  FunnelIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ViewColumnsIcon
} from "@heroicons/react/24/outline";

import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { deleteWaitList, getWaitLists, updateWaitList } from "@/actions/wait-list/wait-list.actions";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import WaitListCardSkeleton from "@/components/skeletons/wait-list/card";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import { ChevronDownIcon, ClipboardDocumentIcon, NoSymbolIcon, TrashIcon } from "@heroicons/react/24/outline";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ViewMode = "table" | "cards";

export default function WaitListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["waitlists"],
    queryFn: getWaitLists
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => deleteWaitList(id)));
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: ["waitlists"] });
      setSelectedKeys(new Set());
      addToast({
        title: "Deleted",
        description: `${ids.length} waitlist${ids.length > 1 ? "s" : ""} deleted successfully.`,
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

  const disableMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => updateWaitList(id, { isAvailable: false })));
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: ["waitlists"] });
      setSelectedKeys(new Set());
      addToast({
        title: "Disabled",
        description: `${ids.length} waitlist${ids.length > 1 ? "s" : ""} disabled successfully.`,
        color: "warning"
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

  const rows = data ?? [];

  const columns = [
    {
      key: "_id",
      label: "Waitlist ID"
    },
    {
      key: "name",
      label: "Name"
    },
    {
      key: "emailsSent",
      label: "Emails Sent"
    },
    {
      key: "isAvailable",
      label: "Status"
    },
    {
      key: "usersTotal",
      label: "Users registered"
    },
    {
      key: "usersReferred",
      label: "Referred users"
    },
    {
      key: "usersBlocked",
      label: "Users blocked"
    }
  ];

  const router = useRouter();

  return (
    <PageComponent>
      <Title description="Setup your wait-list to launch your product" className="mb-6">
        Wait-List
      </Title>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name..."
              variant="bordered"
              startContent={<MagnifyingGlassIcon className="text-default-300 size-5" />}
              size="sm"
              isClearable
              classNames={{
                base: "max-w-sm",
                inputWrapper: "border-1"
              }}
            />

            <Button size="sm" variant="light" className="min-w-max border border-dashed">
              <FunnelIcon className="size-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <GlobalButton
              variant={viewMode === "cards" ? "faded" : "light"}
              className="min-w-max"
              onPress={() => setViewMode("cards")}
            >
              <ViewColumnsIcon className="size-4" />
            </GlobalButton>
            <GlobalButton
              variant={viewMode === "table" ? "faded" : "light"}
              className="min-w-max"
              onPress={() => setViewMode("table")}
            >
              <ListBulletIcon className="size-4" />
            </GlobalButton>

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
                    key="disable"
                    startContent={<NoSymbolIcon className="size-4" />}
                    onPress={() => disableMutation.mutate(Array.from(selectedKeys))}
                    showDivider
                  >
                    Disable
                  </DropdownItem>

                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<TrashIcon className="size-4" />}
                    onPress={() => deleteMutation.mutate(Array.from(selectedKeys))}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}

            <Button
              as={Link}
              href="/app/waitlist/launch"
              className="bg-primary border-transparent border transition-none"
              startContent={<PlusIcon className="size-5" />}
              size="sm"
              variant="shadow"
              type="button"
            >
              New Launch
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {rows.length} waitlists</span>
          {viewMode === "table" && (
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select className="bg-transparent outline-solid outline-transparent text-default-400 text-small">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          )}
        </div>

        {viewMode === "table" ? (
          <Table
            aria-label="Waitlist Table"
            radius="sm"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => {
              if (keys === "all") {
                setSelectedKeys(new Set(rows.map((r: any) => r._id)));
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
              th: "!rounded-b-none bg-",
              wrapper: "p-0 border",
              td: "first:before:rounded-none last:before:rounded-e-none cursor-pointer py-3",
            }}
            onRowAction={(e) => {
              router.push(`/app/launch/waitlist/${e}`);
            }}
          >
            <TableHeader columns={columns}>
              {(column: any) => (
                <TableColumn allowsSorting allowsResizing key={column.key}>
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={rows} emptyContent={"No rows to display."}>
              {(item: any) => (
                <TableRow key={item._id} className="hover:bg-default-200">
                  {(columnKey: any) => {
                    const valueMap: Record<string, any> = {
                      _id: (
                        <div className="flex items-center gap-1.5">
                          <span>{item._id?.slice(0, 8) + "..."}</span>
                          <GlobalButton
                            isIconOnly
                            variant="flat"
                            className="min-w-5 h-5 cursor-pointer"
                            onPress={() => {
                              navigator.clipboard.writeText(item._id);
                              addToast({ title: "Copied", description: "Waitlist ID copied to clipboard." });
                            }}
                          >
                            <ClipboardDocumentIcon className="size-3.5" />
                          </GlobalButton>
                        </div>
                      ),
                      name: (
                        <Type variant="link" as={Link} href={`/app/launch/waitlist/${item._id}`}>
                          {item.name}
                        </Type>
                      ),
                      emailsSent: item.emailsSent,
                      isAvailable: (
                        <Chip status={item.isAvailable ? "active" : "warning"}>
                          {item.isAvailable ? "Active" : "Disabled"}
                        </Chip>
                      ),
                      usersTotal: item.users?.total,
                      usersReferred: item.users?.referred,
                      usersBlocked: item.usersBlocked
                    };
                    return <TableCell>{valueMap[columnKey]}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {isPending ? (
              <WaitListCardSkeleton />
            ) : rows.length === 0 ? (
              <div className="col-span-full text-center text-default-400 py-8">
                No waitlists to display.
              </div>
            ) : (
              rows.map((item: any) => (
                <Card
                  key={item._id}
                  as={Link}
                  href={`/app/launch/waitlist/${item._id}`}
                  isPressable
                  disableRipple
                  className="border"
                  radius="sm"
                >
                  <CardBody className="p-5">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1 flex-1">
                          <Type variant="link">{item.name}</Type>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-muted-foreground">ID: {item._id}</p>
                            <GlobalButton
                              isIconOnly
                              variant="light"
                              className="min-w-5 h-5 cursor-pointer relative z-10"
                              onClick={(e) => {
                                e.stopPropagation(); e.preventDefault();
                                navigator.clipboard.writeText(item._id);
                                addToast({ title: "Copied", description: "Waitlist ID copied to clipboard." });
                              }}
                            >
                              <ClipboardDocumentIcon className="size-3.5" />
                            </GlobalButton>
                          </div>
                        </div>
                        <Chip status={item.isAvailable ? "active" : "warning"}>
                          {item.isAvailable ? "Active" : "Disabled"}
                        </Chip>
                      </div>
                      <div className="flex flex-col gap-2 border-default-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Emails sent:</span>
                          <span className="text-xs ">{item.emailsSent}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Total users:</span>
                          <span className="text-xs ">{item.users?.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Users blocked:</span>
                          <span className="text-xs ">{item.usersBlocked}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </PageComponent>
  );
}
