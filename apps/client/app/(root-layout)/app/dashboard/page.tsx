"use client";

import {
  getDashboardStats,
  type DashboardStats
} from "@/actions/general-stats/general-stats.actions";
import RecentSignupsTable from "@/components/app/dashboard/recent-signups-table";
import SourceChart from "@/components/app/dashboard/source-chart";
import StatCard from "@/components/app/dashboard/stat-card";
import StatusChart from "@/components/app/dashboard/status-chart";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import { cn } from "@/lib/utils";
import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClockIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { Select, SelectItem, Skeleton } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React from "react";

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border px-5 py-4.5 bg-background">
      <Skeleton className="h-8 w-20 rounded-sm" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-sm" />
        <Skeleton className="h-4 w-10 rounded-sm" />
      </div>
    </div>
  );
}

function SourceChartSkeleton() {
  return (
    <div className="flex flex-col border px-5 py-4.5 bg-background">
      <Skeleton className="h-5 w-32 rounded-sm mb-6" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-20 rounded-sm shrink-0" />
            <Skeleton className="h-5 flex-1 rounded-sm" />
            <Skeleton className="h-4 w-10 rounded-sm shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusChartSkeleton() {
  return (
    <div className="flex flex-col border px-5 py-4.5 bg-background">
      <Skeleton className="h-5 w-32 rounded-sm mb-6" />
      <div className="flex items-center gap-6">
        <Skeleton className="size-40 rounded-full shrink-0" />
        <div className="flex flex-col gap-3 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="size-2.5 rounded-full shrink-0" />
              <Skeleton className="h-4 w-16 rounded-sm" />
              <Skeleton className="h-4 w-8 rounded-sm ml-auto" />
            </div>
          ))}
        </div>
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

const DATE_RANGE_OPTIONS = [
  { key: "7", label: "Last 7 days" },
  { key: "14", label: "Last 14 days" },
  { key: "30", label: "Last 30 days" },
  { key: "60", label: "Last 60 days" },
  { key: "90", label: "Last 90 days" }
];

function toISODate(calendarDate: { year: number; month: number; day: number }): string {
  return `${calendarDate.year}-${String(calendarDate.month).padStart(2, "0")}-${String(calendarDate.day).padStart(2, "0")}`;
}

export default function Dashboard() {
  const [animated, setAnimated] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState("30");
  const tz = getLocalTimeZone();

  const defaultEnd = today(tz);
  const defaultStart = defaultEnd.subtract({ days: Number(selectedRange) });

  const fromStr = toISODate(defaultStart);
  const toStr = toISODate(defaultEnd);

  const { data, isPending, isFetching } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", fromStr, toStr],
    queryFn: () => getDashboardStats(fromStr, toStr),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <PageComponent>
      <Title
        description="Track signups, referrals, and conversion rates."
        rightChildren={
          <Select
            aria-label="Date range"
            size="sm"
            radius="none"
            variant="bordered"
            selectedKeys={[selectedRange]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;

              if (key) setSelectedRange(key);
            }}
            className="w-40"
          >
            {DATE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <SourceChartSkeleton />
              </div>
              <div className="lg:col-span-2">
                <StatusChartSkeleton />
              </div>
            </div>
            <TableSkeleton />
          </>
        ) : (
          <div
            className={cn(
              "flex flex-col gap-6 transition-opacity duration-300",
              isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Signups"
                value={data?.totalSignups.value ?? 0}
                change={data?.totalSignups.change ?? 0}
                changeSuffix=""
                icon={UserPlusIcon}
                iconColor="text-blue-500"
                animated={animated}
              />
              <StatCard
                label="Active Waitlists"
                value={data?.activeWaitlists.value ?? 0}
                change={data?.activeWaitlists.change ?? 0}
                changeSuffix=""
                icon={ChartBarIcon}
                iconColor="text-green-500"
                animated={animated}
              />
              <StatCard
                label="Conversion Rate"
                value={data?.conversionRate.value ?? 0}
                suffix="%"
                change={data?.conversionRate.change ?? 0}
                changeSuffix=""
                icon={ArrowTrendingUpIcon}
                iconColor="text-yellow-500"
                animated={animated}
              />
              <StatCard
                label="Avg Wait Time"
                value={data?.avgWaitTime.value ?? 0}
                suffix="d"
                change={data?.avgWaitTime.change ?? 0}
                changeSuffix=""
                icon={ClockIcon}
                iconColor="text-purple-500"
                animated={animated}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <SourceChart data={data?.signupsBySource ?? []} />
              </div>
              <div className="lg:col-span-2">
                <StatusChart data={data?.waitlistStatus ?? []} />
              </div>
            </div>

            <RecentSignupsTable data={data?.recentSignups ?? []} />
          </div>
        )}
      </div>
    </PageComponent>
  );
}
