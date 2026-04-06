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
  Kbd,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";

import {
  deleteWaitList,
  getWaitLists,
  updateWaitList
} from "@/actions/wait-list/wait-list.actions";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import WaitListCardSkeleton from "@/components/skeletons/wait-list/card";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import CopyButton from "@/components/ui/copy-button";
import { useHotkey } from "@/hooks/use-hotkey";
import { cn } from "@/lib/utils";
import {
  BoltIcon,
  CheckIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  NoSymbolIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type ViewMode = "table" | "cards";

export default function WaitListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["waitlists"],
    queryFn: getWaitLists
  });

  useHotkey({
    key: "k",
    modifiers: ["meta"],
    onPress: () => {
      router.push("/app/waitlist/launch");
    }
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

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateWaitList(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlists"] });
      setEditingId(null);
      addToast({ description: "Name updated", color: "primary" });
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      updateWaitList(id, { isAvailable }),
    onSuccess: (_data, { isAvailable }) => {
      queryClient.invalidateQueries({ queryKey: ["waitlists"] });
      addToast({
        description: `Waitlist ${isAvailable ? "activated" : "disabled"}`,
        color: isAvailable ? "primary" : "warning"
      });
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  function startEditing(id: string, name: string) {
    setEditingId(id);
    setEditingName(name);
    setTimeout(() => editInputRef.current?.focus(), 0);
  }

  function confirmRename(id: string) {
    const trimmed = editingName.trim();
    if (!trimmed) return;
    renameMutation.mutate({ id, name: trimmed });
  }

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
              endContent={
                <Kbd className="text-xs" keys={["command"]}>
                  K
                </Kbd>
              }
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
              td: "first:before:rounded-none last:before:rounded-e-none cursor-pointer py-3"
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
                          <span title={item._id}>{item._id?.slice(0, 8) + "..."}</span>
                          {/* <GlobalButton
                            isIconOnly
                            variant="flat"
                            className="min-w-5 h-5 cursor-pointer"
                            onPress={() => {
                              navigator.clipboard.writeText(item._id);
                              addToast({
                                title: "Copied",
                                description: "Waitlist ID copied to clipboard."
                              });
                            }}
                          >
                            <ClipboardDocumentIcon className="size-3.5" />
                          </GlobalButton> */}
                          <CopyButton
                            text={item._id}
                            className="max-h-6 max-w-4"
                            variant="light"
                          ></CopyButton>
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
                  className="border border-dashed bg-default-50/60 relative transition-colors group"
                  radius="none"
                >
                  {editingId !== item._id && (
                    <Link
                      href={`/app/launch/waitlist/${item._id}`}
                      className="absolute inset-0 z-10"
                    />
                  )}
                  <CardBody className="p-5 relative z-20 pointer-events-none">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1 flex-1">
                          {editingId === item._id ? (
                            <div className="flex items-center gap-1 pointer-events-auto w-[90%] h-[21px]">
                              <input
                                ref={editInputRef}
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") confirmRename(item._id);
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                className="border-primary outline-none text-sm w-full"
                                maxLength={30}
                              />
                              <GlobalButton
                                isIconOnly
                                variant="light"
                                className="min-w-5 h-5 cursor-pointer"
                                isLoading={renameMutation.isPending}
                                onPress={() => confirmRename(item._id)}
                              >
                                <CheckIcon className="size-3.5 text-primary" />
                              </GlobalButton>
                              <GlobalButton
                                isIconOnly
                                variant="light"
                                className="min-w-5 h-5 cursor-pointer"
                                onPress={() => setEditingId(null)}
                              >
                                <XMarkIcon className="size-3.5" />
                              </GlobalButton>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Type variant="link">{item.name}</Type>
                              <div className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <GlobalButton
                                  isIconOnly
                                  variant="light"
                                  className="min-w-5 h-5 cursor-pointer"
                                  onPress={() => startEditing(item._id, item.name)}
                                >
                                  <PencilIcon className="size-3" />
                                </GlobalButton>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-muted-foreground">ID: {item._id}</p>
                            <div className="pointer-events-auto">
                              <GlobalButton
                                isIconOnly
                                variant="light"
                                className="min-w-5 h-5 cursor-pointer"
                                onPress={() => {
                                  navigator.clipboard.writeText(item._id);
                                  addToast({
                                    title: "Copied",
                                    description: "Waitlist ID copied to clipboard."
                                  });
                                }}
                              >
                                <ClipboardDocumentIcon className="size-3.5" />
                              </GlobalButton>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center pointer-events-auto">
                          <span
                            className={cn(
                              "px-2 py-[2px] h-5.5 flex items-center rounded-l-full text-[10px] tracking-wide border border-r-0",
                              item.isAvailable
                                ? "bg-success/20 text-success"
                                : "bg-warning/20 text-warning"
                            )}
                          >
                            {item.isAvailable ? "Active" : "Disabled"}
                          </span>
                          <Dropdown radius="sm" placement="bottom-end">
                            <DropdownTrigger>
                              <button
                                className={cn(
                                  "h-5.5 px-1 flex items-center rounded-r-full border cursor-pointer",
                                  item.isAvailable
                                    ? "bg-success/20 text-success border-success/20"
                                    : "bg-warning/20 text-warning border-warning/20"
                                )}
                              >
                                <ChevronDownIcon className="size-3" />
                              </button>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Status actions"
                              itemClasses={{ title: "text-xs", base: "gap-2" }}
                            >
                              <DropdownItem
                                key="audience"
                                startContent={<UsersIcon className="size-3.5" />}
                                onPress={() =>
                                  router.push(`/app/launch/waitlist/${item._id}/audience`)
                                }
                              >
                                Audience
                              </DropdownItem>
                              <DropdownItem
                                key="settings"
                                startContent={<Cog6ToothIcon className="size-3.5" />}
                                onPress={() =>
                                  router.push(`/app/launch/waitlist/${item._id}/settings`)
                                }
                              >
                                Settings
                              </DropdownItem>

                              <DropdownItem
                                key="toggle"
                                className="text-warning!"
                                startContent={
                                  item.isAvailable ? (
                                    <NoSymbolIcon className="size-3.5" />
                                  ) : (
                                    <BoltIcon className="size-3.5" />
                                  )
                                }
                                onPress={() =>
                                  toggleStatusMutation.mutate({
                                    id: item._id,
                                    isAvailable: !item.isAvailable
                                  })
                                }
                              >
                                {item.isAvailable ? "Disable" : "Activate"}
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
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
