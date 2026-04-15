"use client";

import type { DashboardStats } from "@/actions/general-stats/general-stats.actions";
import GlobalButton from "@/components/global/button";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import SendCampaignModal from "@/components/wait-list/send-campaign-modal";
import UserDetailsDrawer from "@/components/wait-list/user-details-drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure
} from "@heroui/react";
import { useState } from "react";

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
  return (
    <div className="flex items-center gap-1 border bg-default-100/70 w-min">
      <span className={`text-xs font-mono px-1.5 py-0.5 rounded-sm`}>#{position}</span>
    </div>
  );
}

export default function RecentSignupsTable({ data }: RecentSignupsTableProps) {
  const sendModal = useDisclosure();
  const detailsDrawer = useDisclosure();
  const [activeSignup, setActiveSignup] = useState<RecentSignup | null>(null);

  function handleInvite(signup: RecentSignup) {
    setActiveSignup(signup);
    sendModal.onOpen();
  }

  function handleSeeDetails(signup: RecentSignup) {
    setActiveSignup(signup);
    detailsDrawer.onOpen();
  }

  return (
    <div className="flex flex-col border bg-background">
      <div className="px-5 py-4.5">
        <Type variant="h6">Recent Signups</Type>
      </div>

      <Table
        aria-label="Recent signups"
        radius="none"
        classNames={{
          td: "py-3 font-mono",
          wrapper: "p-0 bg-transparent"
        }}
      >
        <TableHeader>
          <TableColumn>Joined</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Waitlist</TableColumn>
          <TableColumn className="w-min">Position</TableColumn>
          <TableColumn>Source</TableColumn>
          <TableColumn className="gap-2 w-[200px] text-end">Action</TableColumn>
        </TableHeader>
        <TableBody emptyContent={<Type>No signups yet.</Type>}>
          {data.map((signup) => (
            <TableRow key={signup._id}>
              <TableCell>
                <Type variant="sm" className="text-muted-foreground">
                  {new Date(signup.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </Type>
              </TableCell>
              <TableCell>
                <Type variant="sm">{signup.name || "-"}</Type>
              </TableCell>
              <TableCell>
                <Type variant="sm" className="text-muted-foreground">
                  {signup.email}
                </Type>
              </TableCell>
              <TableCell>
                <Type variant="sm">{signup.waitlistName || "-"}</Type>
              </TableCell>
              <TableCell>
                <Type variant="sm" as="span">
                  <PositionCell position={signup.position} />
                </Type>
              </TableCell>
              <TableCell>
                <Type variant="sm" className="text-muted-foreground">
                  {sourceLabels[signup.source] || signup.source || "Organic"}
                </Type>
              </TableCell>
              <TableCell className="flex justify-end items-center max-w-[200px] gap-2">
                {!signup.status || signup.status === "waiting" ? (
                  <GlobalButton
                    variant="bordered"
                    className="text-xs"
                    onPress={() => handleInvite(signup)}
                  >
                    Invite
                  </GlobalButton>
                ) : signup.status === "invited" ? (
                  <Chip status="primary" className="rounded-sm!">
                    Invited
                  </Chip>
                ) : signup.status === "converted" ? (
                  <Chip status="active">Converted</Chip>
                ) : (
                  <Chip status="danger">Churned</Chip>
                )}

                <GlobalButton
                  variant="bordered"
                  className="text-xs"
                  onPress={() => handleSeeDetails(signup)}
                >
                  See details
                </GlobalButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SendCampaignModal
        isOpen={sendModal.isOpen}
        onOpenChange={sendModal.onOpenChange}
        waitlistId={activeSignup?.waitlistId ?? ""}
        users={activeSignup ? [{ _id: activeSignup._id, email: activeSignup.email }] : []}
      />

      <UserDetailsDrawer
        isOpen={detailsDrawer.isOpen}
        onOpenChange={detailsDrawer.onOpenChange}
        user={activeSignup}
      />
    </div>
  );
}
