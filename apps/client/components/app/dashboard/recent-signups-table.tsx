"use client";

import GlobalButton from "@/components/global/button";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import type { DashboardStats } from "@/actions/general-stats/general-stats.actions";

type RecentSignup = DashboardStats["recentSignups"][number];

interface RecentSignupsTableProps {
  data: RecentSignup[];
}

const sourceLabels: Record<string, string> = {
  organic: "Organic",
  referral: "Referral",
  social: "Social",
  email: "Email",
  paid_ads: "Paid Ads"
};

function PositionCell({ position }: { position: number }) {
  const isLow = position <= 50;

  return (
    <div className="flex items-center gap-1">
      {isLow ? (
        <ArrowUpIcon className="size-3 text-success" />
      ) : (
        <ArrowDownIcon className="size-3 text-danger" />
      )}
      <span
        className={`text-xs font-mono px-1.5 py-0.5 rounded-sm ${isLow ? "text-success" : "text-warning"}`}
      >
        #{position}
      </span>
    </div>
  );
}

export default function RecentSignupsTable({ data }: RecentSignupsTableProps) {
  return (
    <div className="flex flex-col border bg-background">
      <div className="px-5 py-4.5">
        <Type variant="h6">Recent Signups</Type>
      </div>

      <Table
        aria-label="Recent signups"
        radius="none"
        removeWrapper
        classNames={{
          th: "!rounded-b-none bg-default-50",
          td: "first:before:rounded-none last:before:rounded-e-none py-3"
        }}
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Waitlist</TableColumn>
          <TableColumn>Position</TableColumn>
          <TableColumn>Source</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody emptyContent={<Type>No signups yet.</Type>}>
          {data.map((signup) => (
            <TableRow key={signup._id}>
              <TableCell>
                <Type>{signup.name || "-"}</Type>
              </TableCell>
              <TableCell>
                <Type className="text-muted-foreground">{signup.email}</Type>
              </TableCell>
              <TableCell>
                <Type>{signup.waitlistName || "-"}</Type>
              </TableCell>
              <TableCell>
                <PositionCell position={signup.position} />
              </TableCell>
              <TableCell>
                <Type className="text-muted-foreground">
                  {sourceLabels[signup.source] || signup.source || "Organic"}
                </Type>
              </TableCell>
              <TableCell>
                {signup.status === "waiting" ? (
                  <GlobalButton variant="bordered" className="text-xs">
                    Invite
                  </GlobalButton>
                ) : (
                  <Chip
                    status={
                      signup.status === "invited"
                        ? "primary"
                        : signup.status === "converted"
                          ? "active"
                          : "warning"
                    }
                  >
                    {signup.status === "invited"
                      ? "Pending"
                      : signup.status === "converted"
                        ? "Converted"
                        : signup.status}
                  </Chip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
