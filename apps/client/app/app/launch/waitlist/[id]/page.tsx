"use client";

import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import Type from "@/components/type";
import { cn } from "@/lib/utils";
import {
  EnvelopeIcon,
  HandRaisedIcon,
  ShareIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

export default function LaunchedWaitList() {
  const stats = [
    {
      id: 1,
      title: "Total Sign Ups",
      value: "39,294",
      change: "+12.5%",
      trend: "up",
      icon: UserPlusIcon,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      id: 2,
      title: "Total Referrals",
      value: "8,432",
      change: "+8.2%",
      trend: "up",
      icon: ShareIcon,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
    },
    {
      id: 3,
      title: "Sign Ups Today",
      value: "234",
      change: "+5.1%",
      trend: "up",
      icon: UserGroupIcon,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
    },
    {
      id: 4,
      title: "Emails sent",
      value: "3,439",
      change: null,
      trend: null,
      icon: EnvelopeIcon,
      iconColor: "text-muted-foreground",
      iconBg: "bg-default-500/10",
    },
    {
      id: 5,
      title: "Fake users blocked",
      value: "3,439",
      change: null,
      trend: null,
      icon: HandRaisedIcon,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },
  ];

  return (
    <PageComponent>
      <HeaderNavigation></HeaderNavigation>

      <Title description="Wait-List launched">Overview</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 bg-default-50 border rounded-default">
        {stats.map((stat) => (
          <div key={stat.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "size-10 rounded-md flex items-center justify-center",
                    stat.iconBg,
                  )}
                >
                  <stat.icon className={cn("size-5", stat.iconColor)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageComponent>
  );
}
