"use client";

import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Chip from "@/components/ui/chip";
import ConversionRateChart from "@/components/wait-list/charts/conversion-rate-chart";
import DailyRegistrationsChart from "@/components/wait-list/charts/daily-registrations-chart";
import FakeUsersBlockedChart from "@/components/wait-list/charts/fake-users-blocked-chart";
import TopReferrersChart from "@/components/wait-list/charts/top-referrers-chart";
import TrafficSourcesChart from "@/components/wait-list/charts/traffic-sources-chart";
import { cn } from "@/lib/utils";
import {
  EnvelopeIcon,
  HandRaisedIcon,
  ShareIcon,
  UserGroupIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import NumberFlow from "@number-flow/react";
import React from "react";

export default function LaunchedWaitList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const stats = [
    {
      id: 1,
      title: "Total Sign Ups",
      value: "39294",
      change: "+12.5%",
      trend: "up",
      icon: UserPlusIcon,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10"
    },
    {
      id: 2,
      title: "Total Referrals",
      value: "8432",
      change: "+8.2%",
      trend: "up",
      icon: ShareIcon,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10"
    },
    {
      id: 3,
      title: "Sign Ups Today",
      value: "234",
      change: "+5.1%",
      trend: "up",
      icon: UserGroupIcon,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/10"
    },
    {
      id: 4,
      title: "Emails sent",
      value: "3439",
      change: null,
      trend: null,
      icon: EnvelopeIcon,
      iconColor: "text-muted-foreground",
      iconBg: "bg-default-500/10"
    },
    {
      id: 5,
      title: "Fake users blocked",
      value: "3439",
      change: null,
      trend: null,
      icon: HandRaisedIcon,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10"
    }
  ];

  return (
    <PageComponent>
      <div className="flex items-start gap-2">
        <Title description="Wait-List launched" className="flex">
          <span>Launch {id}</span>
        </Title>

        {/* <button className="text-primary flex items-center gap-1 text-sm font-medium hover:underline cursor-pointer  decoration-2"></button> */}
        <Chip status="primary">Bernay Landing page</Chip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 rounded-default">
        {stats.map((stat) => (
          <div key={stat.id} className="border border-dashed rounded bg-background">
            <div className="p-6 py-5">
              <div className="flex flex-col gap-2">
                <NumberFlow value={parseInt(stat.value ?? 0)} className="text-2xl font-semibold" />

                <div className="flex gap-2 items-center">
                  <stat.icon className={cn("size-4", stat.iconColor)} />
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <Title description="Detailed analytics and insights">
          <span className="text-lg">Analytics</span>
        </Title>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 lg:columns-2 gap-6 mt-6 space-y-6">
        <div className="break-inside-avoid">
          <DailyRegistrationsChart />
        </div>
        <div className="break-inside-avoid">
          <FakeUsersBlockedChart />
        </div>
        <div className="break-inside-avoid">
          <TopReferrersChart />
        </div>
        <div className="break-inside-avoid">
          <TrafficSourcesChart />
        </div>
        <div className="break-inside-avoid">
          <ConversionRateChart />
        </div>
      </div>
    </PageComponent>
  );
}
