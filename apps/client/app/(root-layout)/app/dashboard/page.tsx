"use client";

import { getDashboardStats, type DashboardStats } from "@/actions/general-stats/general-stats.actions";
import RecentSignupsTable from "@/components/app/dashboard/recent-signups-table";
import SourceChart from "@/components/app/dashboard/source-chart";
import StatCard from "@/components/app/dashboard/stat-card";
import StatusChart from "@/components/app/dashboard/status-chart";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function formatValue(value: number, type: "number" | "percent" | "days"): string {
  if (type === "number") return value.toLocaleString();
  if (type === "percent") return value + "%";
  if (type === "days") return value + "d";
  return value.toString();
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border px-5 py-4.5 bg-background">
      <Skeleton className="h-4 w-24 rounded-sm" />
      <Skeleton className="h-9 w-28 rounded-sm" />
      <Skeleton className="h-5 w-14 rounded-sm" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 border px-5 py-4.5 bg-background">
      <Skeleton className="h-5 w-32 rounded-sm" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-full rounded-sm" />
        <Skeleton className="h-5 w-4/5 rounded-sm" />
        <Skeleton className="h-5 w-3/5 rounded-sm" />
        <Skeleton className="h-5 w-2/5 rounded-sm" />
        <Skeleton className="h-5 w-1/4 rounded-sm" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-4 border px-5 py-4.5 bg-background">
      <Skeleton className="h-5 w-32 rounded-sm" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-sm" />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isPending } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats
  });

  return (
    <PageComponent>
      <Title
        description="Track signups, referrals, and conversion rates."
        rightChildren={
          <Button
            as={Link}
            href="/app/waitlist/launch"
            className="bg-primary border-transparent border transition-none"
            startContent={<PlusIcon className="size-4" />}
            size="sm"
            radius="sm"
          >
            Create Waitlist
          </Button>
        }
      >
        Waitlist Dashboard
      </Title>

      <div className="flex flex-col gap-6 mt-6">
        {isPending ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
            <TableSkeleton />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Signups"
                value={formatValue(data?.totalSignups.value ?? 0, "number")}
                change={data?.totalSignups.change ?? 0}
              />
              <StatCard
                label="Active Waitlists"
                value={formatValue(data?.activeWaitlists.value ?? 0, "number")}
                change={data?.activeWaitlists.change ?? 0}
                suffix=""
              />
              <StatCard
                label="Conversion Rate"
                value={formatValue(data?.conversionRate.value ?? 0, "percent")}
                change={data?.conversionRate.change ?? 0}
              />
              <StatCard
                label="Avg Wait Time"
                value={formatValue(data?.avgWaitTime.value ?? 0, "days")}
                change={data?.avgWaitTime.change ?? 0}
                suffix="d"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SourceChart data={data?.signupsBySource ?? []} />
              <StatusChart data={data?.waitlistStatus ?? []} />
            </div>

            <RecentSignupsTable data={data?.recentSignups ?? []} />
          </>
        )}
      </div>
    </PageComponent>
  );
}
