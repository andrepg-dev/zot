"use client";

import PageComponent from "@/components/layouts/page-component";
import {
  FunnelIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";

import {
  Button,
  Card,
  CardBody,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@heroui/react";

import Title from "@/components/global/title";
import Chip from "@/components/ui/chip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ViewMode = "table" | "cards";

export default function WaitListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const rows = [
    {
      id: "a898324j-23487-123",
      name: "Brocoli Launch",
      "email-sending-quantity": 300,
      status: "Active",
      users: `403 registration`,
      "referal-emails": `343 referal emails`,
    },
  ];

  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email-sending-quantity",
      label: "Email Sending Quantity",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "users",
      label: "User registered",
    },
    {
      key: "referal-emails",
      label: "Referal emails",
    },
  ];

  const router = useRouter();

  const handleCardClick = (key: string) => {
    router.push(`/app/launch/waitlist/${key}`);
  };

  const handleView = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/app/launch/waitlist/${id}`);
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/app/launch/waitlist/${id}/edit`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete:", id);
  };

  return (
    <PageComponent>
      <Title
        description="Setup your wait-list to launch your product"
        className="mb-6"
      >
        Wait-List
      </Title>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name..."
              variant="bordered"
              startContent={
                <MagnifyingGlassIcon className="text-default-300 size-5" />
              }
              size="sm"
              isClearable
              classNames={{
                base: "max-w-sm",
                inputWrapper: "border-1",
              }}
            />

            <Button
              size="sm"
              variant="light"
              className="min-w-max border border-dashed"
            >
              <FunnelIcon className="size-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "cards" ? "faded" : "light"}
              className="min-w-max"
              onPress={() => setViewMode("cards")}
            >
              <ViewColumnsIcon className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "table" ? "faded" : "light"}
              className="min-w-max"
              onPress={() => setViewMode("table")}
            >
              <ListBulletIcon className="size-4" />
            </Button>

            <Button
              as={Link}
              href="/app/launch/waitlist"
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
          <span className="text-default-400 text-small">
            Total {rows.length} waitlists
          </span>
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
            classNames={{
              th: "!rounded-b-none bg-",
              wrapper: "p-0 border",
              td: "first:before:rounded-none last:before:rounded-e-none cursor-pointer",
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
                <TableRow key={item.id} className="hover:bg-default-200">
                  {(columnKey: any) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.length === 0 ? (
              <div className="col-span-full text-center text-default-400 py-8">
                No waitlists to display.
              </div>
            ) : (
              rows.map((item) => (
                <Card
                  key={item.id}
                  isPressable
                  onPress={() => handleCardClick(item.id)}
                  className="hover:bg-default-100 transition cursor-pointer border"
                  radius="sm"
                >
                  <CardBody className="p-5">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1 flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            ID: {item.id}
                          </p>
                        </div>
                        <Chip label={item.status} status={"active"} />
                      </div>
                      <div className="flex flex-col gap-2 pt-2 border-t border-default-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Email Sending Quantity:
                          </span>
                          <span className="text-xs ">
                            {item["email-sending-quantity"]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Users registered:
                          </span>
                          <span className="text-xs ">{item.users}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Referal emails:
                          </span>
                          <span className="text-xs ">
                            {item["referal-emails"]}
                          </span>
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
