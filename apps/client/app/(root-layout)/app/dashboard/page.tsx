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
import Type from "@/components/type";
import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClockIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
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
  const [animated, setAnimated] = React.useState(false);

  const { data, isPending } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats
  });

  React.useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <PageComponent>
      <Title
        description="Track signups, referrals, and conversion rates."
        rightChildren={
          <Type className="text-muted-foreground font-mono text-xs">Last 30 days information</Type>
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
                <ChartSkeleton />
              </div>
              <div className="lg:col-span-2">
                <ChartSkeleton />
              </div>
            </div>
            <TableSkeleton />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </PageComponent>
  );
}
