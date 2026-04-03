"use client";

import { getEmailSendRecordsList } from "@/actions/emails/emails.actions";
import GlobalDrawer from "@/components/global/drawer";
import Type from "@/components/type";
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
  TableRow,
  useDisclosure
} from "@heroui/react";
import type { EmailSendRecordItem } from "@repo/packages/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { formatDateTime } from "@/lib/format-date";

const columns = [
  { key: "position", label: "#" },
  { key: "subject", label: "Subject" },
  { key: "from", label: "From" },
  { key: "replyTo", label: "Reply To" },
  { key: "quantitySent", label: "Sent" },
  { key: "status", label: "Status" },
  { key: "sentSuccessfully", label: "Successful" },
  { key: "failedCount", label: "Failed" },
  { key: "createdAt", label: "Date" }
];

export default function UsersTable({ id }: { id: string }) {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<EmailSendRecordItem | null>(null);
  const detailDrawer = useDisclosure();

  const { data: records, isPending } = useQuery({
    queryKey: [id, "email-records-list"],
    queryFn: async () => await getEmailSendRecordsList(id)
  });

  const filteredRecords = React.useMemo(() => {
    if (!records) return [];
    if (!search.trim()) return records;
    const query = search.toLowerCase();
    return records.filter(
      (record) =>
        record.payload.subject.toLowerCase().includes(query) ||
        record.payload.from.toLowerCase().includes(query) ||
        record.recipientEmails.some((email) => email.toLowerCase().includes(query)) ||
        formatDateTime(record.createdAt).toLowerCase().includes(query)
    );
  }, [records, search]);

  function handleRowClick(record: EmailSendRecordItem) {
    setSelectedRecord(record);
    detailDrawer.onOpen();
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search by subject, email or date..."
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
            {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""}
          </span>
        </div>

        <Table
          aria-label="Email Send Records Table"
          isStriped
          radius="sm"
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
            items={filteredRecords.map((record, index) => ({ ...record, position: index + 1 }))}
            isLoading={isPending}
            loadingContent={<Spinner size="sm" />}
            emptyContent={<Type>No emails sent yet.</Type>}
          >
            {(item) => (
              <TableRow key={item._id} onClick={() => handleRowClick(item)}>
                {(columnKey) => {
                  const allSucceeded = item.failedCount === 0;
                  const allFailed = item.sentSuccessfully === 0;

                  const valueMap: Record<string, React.ReactNode> = {
                    position: (
                      <span className="text-muted-foreground font-mono">{item.position}</span>
                    ),
                    subject: (
                      <span className="font-mono text-xs truncate max-w-[200px] block">
                        {item.payload.subject}
                      </span>
                    ),
                    from: (
                      <span className="font-mono text-xs truncate max-w-[180px] block text-muted-foreground">
                        {item.payload.from}
                      </span>
                    ),
                    replyTo: item.payload.options.replyTo ? (
                      <span className="font-mono text-xs truncate max-w-[180px] block text-muted-foreground">
                        {item.payload.options.replyTo}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    ),
                    quantitySent: <span className="font-mono">{item.quantitySent}</span>,
                    status: allSucceeded ? (
                      <Chip status="active">Success</Chip>
                    ) : allFailed ? (
                      <Chip status="danger">Failed</Chip>
                    ) : (
                      <Chip status="warning">Partial</Chip>
                    ),
                    sentSuccessfully: (
                      <span className="font-mono text-green-500">{item.sentSuccessfully}</span>
                    ),
                    failedCount: (
                      <span
                        className={`font-mono ${item.failedCount > 0 ? "text-red-500" : "text-muted-foreground"}`}
                      >
                        {item.failedCount}
                      </span>
                    ),
                    createdAt: (
                      <span className="text-muted-foreground font-mono text-xs">
                        {formatDateTime(item.createdAt)}
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

      <GlobalDrawer
        isOpen={detailDrawer.isOpen}
        onOpenChange={detailDrawer.onOpenChange}
        size="3xl"
        expandedSize="4xl"
      >
        <DrawerHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Email record details</h2>
            {selectedRecord &&
              (selectedRecord.failedCount === 0 ? (
                <Chip status="active">Success</Chip>
              ) : selectedRecord.sentSuccessfully === 0 ? (
                <Chip status="danger">Failed</Chip>
              ) : (
                <Chip status="warning">Partial</Chip>
              ))}
          </div>
          <p className="text-sm text-muted-foreground font-normal">
            {selectedRecord ? formatDateTime(selectedRecord.createdAt) : "—"}
          </p>
        </DrawerHeader>

        <DrawerBody className="pb-20">
          {selectedRecord && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Type variant="base">Emails Sent</Type>
                  <Type>{String(selectedRecord.quantitySent)}</Type>
                </div>

                <div className="flex items-center gap-2">
                  <Type variant="base">Successful</Type>
                  <span className="font-mono text-sm">{selectedRecord.sentSuccessfully}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Type variant="base">Failed</Type>
                  <span
                    className={`font-mono text-sm ${selectedRecord.failedCount > 0 ? "" : "text-muted-foreground"}`}
                  >
                    {selectedRecord.failedCount}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Type variant="h6">Subject</Type>
                <Type variant="code">{selectedRecord.payload.subject}</Type>
              </div>

              <div className="flex flex-col gap-1">
                <Type variant="h6">From</Type>
                <Type variant="code">{selectedRecord.payload.from}</Type>
              </div>

              {selectedRecord.payload.options.replyTo && (
                <div className="flex flex-col gap-1">
                  <Type variant="h6">Reply To</Type>
                  <Type variant="code">{selectedRecord.payload.options.replyTo}</Type>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <Type variant="h6">HTML</Type>
                <pre className="text-xs font-mono bg-default-100 p-3 rounded-sm border overflow-auto max-h-60">
                  {selectedRecord.payload.options.html}
                </pre>
              </div>

              <div className="flex flex-col gap-1">
                <Type variant="h6">Recipients · {selectedRecord.recipientEmails.length}</Type>
                <div className="flex flex-col bg-default-100 rounded-sm border overflow-auto max-h-60 mt-2">
                  {selectedRecord.recipientEmails.map((email) => (
                    <span
                      key={email}
                      className="text-xs font-mono px-3 py-2 border-b last:border-b-0"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRecord.failedEmails.length > 0 && (
                <div className="flex flex-col gap-1">
                  <Type variant="h6">Failed · {selectedRecord.failedEmails.length}</Type>
                  <div className="flex flex-col bg-default-100 rounded-sm border overflow-auto max-h-60 mt-2">
                    {selectedRecord.failedEmails.map((email) => (
                      <span
                        key={email}
                        className="text-xs font-mono px-3 py-2 border-b last:border-b-0"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-1 border-t pt-4">
                <Type variant="h6">Support</Type>
                <Type variant="sm" className="text-muted-foreground">
                  Having trouble? Contact us at{" "}
                  <a href="mailto:support@zot.so" className="text-primary-400 hover:underline">
                    support@zot.so
                  </a>
                </Type>
              </div>
            </div>
          )}
        </DrawerBody>
      </GlobalDrawer>
    </>
  );
}
