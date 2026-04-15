"use client";

import GlobalDrawer from "@/components/global/drawer";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import { formatDate } from "@/lib/format-date";
import { DrawerBody, DrawerHeader } from "@heroui/react";

export interface UserDetails {
  _id: string;
  email: string;
  name?: string;
  position: number;
  source?: string;
  status?: string;
  createdAt: string;
  waitlistName?: string;
  referredBy?: string;
  metadata?: Record<string, unknown>;
}

interface UserDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserDetails | null;
}

const SOURCE_LABELS: Record<string, string> = {
  organic: "Organic",
  referral: "Referral",
  social: "Social",
  email: "Email",
  paid_ads: "Paid Ads"
};

const STATUS_CHIP: Record<string, "warning" | "primary" | "active" | "neutral"> = {
  waiting: "neutral",
  invited: "active",
  converted: "active",
  churned: "warning"
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b py-3">
      <Type variant="sm" className="text-muted-foreground uppercase tracking-wide">
        {label}
      </Type>
      <div className="font-mono text-sm">{children}</div>
    </div>
  );
}

export default function UserDetailsDrawer({
  isOpen,
  onOpenChange,
  user
}: UserDetailsDrawerProps) {
  const status = user?.status ?? "waiting";
  const metadataEntries = user?.metadata ? Object.entries(user.metadata) : [];

  return (
    <GlobalDrawer isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <DrawerHeader className="flex flex-col gap-1">
        <h2 className="text-base font-medium">User details</h2>
        <p className="text-sm text-muted-foreground font-normal">
          {user?.email ?? "No user selected"}
        </p>
      </DrawerHeader>

      <DrawerBody className="overflow-y-auto">
        {user && (
          <div className="flex flex-col">
            <Field label="Name">{user.name || "—"}</Field>
            <Field label="Email">{user.email}</Field>
            <Field label="Position">#{user.position}</Field>
            <Field label="Waitlist">{user.waitlistName || "—"}</Field>
            <Field label="Status">
              <Chip status={STATUS_CHIP[status] ?? "neutral"} className="!rounded-sm">
                {status}
              </Chip>
            </Field>
            <Field label="Source">
              {SOURCE_LABELS[user.source ?? "organic"] ?? user.source ?? "—"}
            </Field>
            <Field label="Referred by">{user.referredBy || "—"}</Field>
            <Field label="Joined">{formatDate(user.createdAt)}</Field>

            {metadataEntries.length > 0 && (
              <div className="flex flex-col gap-2 pt-4">
                <Type variant="sm" className="text-muted-foreground uppercase tracking-wide">
                  Metadata
                </Type>
                <div className="flex flex-col">
                  {metadataEntries.map(([key, value]) => (
                    <Field key={key} label={key}>
                      {value != null ? String(value) : "—"}
                    </Field>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DrawerBody>
    </GlobalDrawer>
  );
}
