"use client";

import {
  importWaitListUsers,
  type BulkImportWaitListUserItem
} from "@/actions/wait-list/wait-list-user.actions";
import { getWaitLists } from "@/actions/wait-list/wait-list.actions";
import { getWaitListUsers } from "@/actions/wait-list/wait-list-user.actions";
import GlobalButton from "@/components/global/button";
import PrimaryActionButton from "@/components/global/primary-action-button";
import GlobalTextarea from "@/components/global/Textarea";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { parseCsv, parsePastedEmails, type ImportRowError } from "@/lib/import-users";
import { cn } from "@/lib/utils";
import {
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  Square2StackIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";

export type ImportMethod = "manual" | "paste" | "csv" | "from-waitlist";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  waitlistId: string;
  initialMethod?: ImportMethod;
};

const METHODS: Array<{
  key: ImportMethod;
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    key: "manual",
    label: "Add manually",
    description: "Add a single user by email and name.",
    Icon: PencilSquareIcon
  },
  {
    key: "paste",
    label: "Paste emails",
    description: "Paste a list of emails separated by commas or new lines.",
    Icon: ClipboardDocumentListIcon
  },
  {
    key: "csv",
    label: "Upload CSV",
    description: "Upload a .csv with an email column. Extra columns become metadata.",
    Icon: ArrowUpTrayIcon
  },
  {
    key: "from-waitlist",
    label: "From another waitlist",
    description: "Copy users from another waitlist in your workspace.",
    Icon: Square2StackIcon
  }
];

export default function ImportUsersModal({
  isOpen,
  onOpenChange,
  waitlistId,
  initialMethod = "paste"
}: Props) {
  const queryClient = useQueryClient();

  const [method, setMethod] = useState<ImportMethod>(initialMethod);
  const [items, setItems] = useState<BulkImportWaitListUserItem[]>([]);
  const [invalid, setInvalid] = useState<ImportRowError[]>([]);

  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [pasteValue, setPasteValue] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [sourceWaitlistId, setSourceWaitlistId] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMethod(initialMethod);
      resetAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMethod]);

  function resetAll() {
    setItems([]);
    setInvalid([]);
    setManualEmail("");
    setManualName("");
    setPasteValue("");
    setCsvFileName("");
    setSourceWaitlistId("");
  }

  function handleSwitchMethod(next: ImportMethod) {
    setMethod(next);
    setItems([]);
    setInvalid([]);
  }

  // Manual
  function handleManualAdd() {
    const email = manualEmail.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast({ description: "Please enter a valid email", color: "warning" });
      return;
    }
    if (items.some((i) => i.email === email)) {
      addToast({ description: "This email is already in the list", color: "warning" });
      return;
    }
    setItems((prev) => [
      ...prev,
      { email, name: manualName.trim() || undefined }
    ]);
    setManualEmail("");
    setManualName("");
  }

  // Paste
  function handlePasteParse(value: string) {
    setPasteValue(value);
    const parsed = parsePastedEmails(value);
    setItems(parsed.valid);
    setInvalid(parsed.invalid);
  }

  // CSV
  async function handleCsvFile(file: File) {
    setCsvFileName(file.name);
    const text = await file.text();
    const parsed = parseCsv(text);
    setItems(parsed.valid);
    setInvalid(parsed.invalid);
    if (parsed.valid.length === 0 && parsed.invalid.length === 0) {
      addToast({
        description: "No rows found. Make sure the CSV has an email column.",
        color: "warning"
      });
    }
  }

  // From another waitlist
  const { data: waitlists } = useQuery({
    queryKey: ["waitlists"],
    queryFn: () => getWaitLists(),
    enabled: isOpen && method === "from-waitlist"
  });

  const otherWaitlists = useMemo(
    () => (waitlists ?? []).filter((w) => w._id !== waitlistId),
    [waitlists, waitlistId]
  );

  const { data: sourceUsers, isPending: isLoadingSourceUsers } = useQuery({
    queryKey: [sourceWaitlistId, "audience"],
    queryFn: () => getWaitListUsers(sourceWaitlistId),
    enabled: isOpen && method === "from-waitlist" && !!sourceWaitlistId
  });

  useEffect(() => {
    if (method !== "from-waitlist") return;
    if (!sourceUsers) {
      setItems([]);
      return;
    }
    setItems(
      sourceUsers.map((u) => ({
        email: u.email,
        name: u.name,
        metadata: u.metadata as Record<string, unknown> | undefined
      }))
    );
    setInvalid([]);
  }, [sourceUsers, method]);

  const importMutation = useMutation({
    mutationFn: (payload: BulkImportWaitListUserItem[]) =>
      importWaitListUsers(waitlistId, payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [waitlistId, "audience"] });
      queryClient.invalidateQueries({ queryKey: [waitlistId] });

      const parts: string[] = [`${result.added} added`];
      if (result.skipped > 0) parts.push(`${result.skipped} skipped`);
      if (result.errors.length > 0) parts.push(`${result.errors.length} failed`);

      addToast({
        title: "Import complete",
        description: parts.join(" / "),
        color: result.errors.length > 0 ? "warning" : "success"
      });

      onOpenChange(false);
    },
    onError: (err) => {
      addToast({ title: "Import failed", description: err.message, color: "danger" });
    }
  });

  function handleSubmit() {
    if (items.length === 0) {
      addToast({ description: "No users to import", color: "warning" });
      return;
    }
    importMutation.mutate(items);
  }

  function handleRemoveItem(email: string) {
    setItems((prev) => prev.filter((i) => i.email !== email));
  }

  const submitDisabled = items.length === 0 || importMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      radius="none"
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <Type variant="h4">Import users</Type>
              <p className="text-sm text-muted-foreground font-normal">
                Add users to this waitlist using one of the methods below.
              </p>
            </ModalHeader>
            <ModalBody className="p-0">
              <div className="grid grid-cols-[220px_1fr] border-t">
                <div className="border-r flex flex-col">
                  {METHODS.map(({ key, label, description, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSwitchMethod(key)}
                      className={cn(
                        "flex items-start gap-2 px-4 py-3 text-left border-b last:border-b-0 hover:bg-default-100/60 transition-colors cursor-pointer",
                        method === key && "bg-default-100"
                      )}
                    >
                      <Icon className="size-4 mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <Type variant="h6">{label}</Type>
                        <Type variant="sm" className="text-muted-foreground">
                          {description}
                        </Type>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 p-5 min-h-[320px]">
                  {method === "manual" && (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <InputComponent
                          label="Email"
                          placeholder="user@example.com"
                          variant="bordered"
                          size="sm"
                          value={manualEmail}
                          onValueChange={setManualEmail}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleManualAdd();
                            }
                          }}
                        />
                        <InputComponent
                          label="Name (optional)"
                          placeholder="Jane Doe"
                          variant="bordered"
                          size="sm"
                          value={manualName}
                          onValueChange={setManualName}
                        />
                      </div>
                      <div>
                        <GlobalButton
                          size="sm"
                          variant="bordered"
                          onPress={handleManualAdd}
                          isDisabled={!manualEmail.trim()}
                        >
                          Add to list
                        </GlobalButton>
                      </div>
                    </div>
                  )}

                  {method === "paste" && (
                    <GlobalTextarea
                      label="Emails"
                      labelPlacement="outside"
                      placeholder={"jane@example.com\njohn@example.com\n..."}
                      variant="bordered"
                      minRows={6}
                      value={pasteValue}
                      onValueChange={handlePasteParse}
                    />
                  )}

                  {method === "csv" && (
                    <div className="flex flex-col gap-3">
                      <div
                        className="border border-dashed bg-default-50 px-4 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-default-100/60"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ArrowUpTrayIcon className="size-5 text-muted-foreground" />
                        <Type variant="sm">
                          {csvFileName || "Click to choose a .csv file"}
                        </Type>
                        <Type variant="sm" className="text-muted-foreground">
                          email column required. Other columns are saved as metadata.
                        </Type>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleCsvFile(file);
                          e.target.value = "";
                        }}
                      />
                    </div>
                  )}

                  {method === "from-waitlist" && (
                    <div className="flex flex-col gap-3">
                      <Select
                        label="Source waitlist"
                        labelPlacement="outside"
                        variant="bordered"
                        size="sm"
                        radius="none"
                        placeholder="Choose a waitlist"
                        selectedKeys={sourceWaitlistId ? new Set([sourceWaitlistId]) : new Set()}
                        onSelectionChange={(keys) => {
                          const id = Array.from(keys as Set<string>)[0] ?? "";
                          setSourceWaitlistId(id);
                        }}
                      >
                        {otherWaitlists.map((w) => (
                          <SelectItem key={w._id}>{w.name}</SelectItem>
                        ))}
                      </Select>
                      {isLoadingSourceUsers && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Spinner size="sm" />
                          <Type variant="sm">Loading users...</Type>
                        </div>
                      )}
                    </div>
                  )}

                  {(items.length > 0 || invalid.length > 0) && (
                    <div className="flex flex-col gap-2 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="size-4 text-success" />
                          <Type variant="h6">
                            {items.length} user{items.length !== 1 ? "s" : ""} ready
                          </Type>
                        </div>
                        {invalid.length > 0 && (
                          <div className="flex items-center gap-1 text-warning">
                            <ExclamationTriangleIcon className="size-4" />
                            <Type variant="sm">
                              {invalid.length} skipped
                            </Type>
                          </div>
                        )}
                      </div>
                      <div className="border max-h-48 overflow-y-auto bg-default-50">
                        {items.map((item) => (
                          <div
                            key={item.email}
                            className="flex items-center justify-between px-3 py-1.5 border-b last:border-b-0 font-mono"
                          >
                            <Type variant="sm" className="truncate">
                              {item.email}
                              {item.name ? ` (${item.name})` : ""}
                            </Type>
                            {method !== "from-waitlist" && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.email)}
                                className="text-muted-foreground hover:text-foreground cursor-pointer"
                                aria-label="Remove"
                              >
                                <XMarkIcon className="size-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        {invalid.map((row, idx) => (
                          <div
                            key={`invalid-${idx}`}
                            className="flex items-center justify-between px-3 py-1.5 border-b last:border-b-0 font-mono text-muted-foreground"
                          >
                            <Type variant="sm" className="truncate line-through">
                              {row.value}
                            </Type>
                            <Type variant="sm" className="text-warning">
                              {row.reason}
                            </Type>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-t">
              <GlobalButton
                variant="light"
                onPress={onClose}
                isDisabled={importMutation.isPending}
                startContent={<ArrowUturnLeftIcon className="size-4" />}
              >
                Cancel
              </GlobalButton>
              <PrimaryActionButton
                isDisabled={submitDisabled}
                isLoading={importMutation.isPending}
                onPress={handleSubmit}
              >
                Import {items.length > 0 ? `(${items.length})` : ""}
              </PrimaryActionButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
