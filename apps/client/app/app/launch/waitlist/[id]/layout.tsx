"use client";

import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import {
  BoltIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  InboxStackIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";

export default function WaitListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <SidebarNavigation
        navItems={[
          {
            href: `/app/launch/waitlist/${id}`,
            icon: HomeIcon,
            label: "Overview",
          },
          {
            href: `/app/launch/waitlist/${id}/widget-builder`,
            icon: WrenchScrewdriverIcon,
            label: "Widget Builder",
          },
          {
            href: `/app/launch/waitlist/${id}/analitycs`,
            icon: ChartBarIcon,
            label: "Analitycs",
          },
          {
            href: `/app/launch/waitlist/${id}/emails`,
            icon: InboxStackIcon,
            label: "Emails",
          },
          {
            href: `/app/launch/waitlist/${id}/automations`,
            icon: BoltIcon,
            label: "Automations",
          },
          {
            href: `/app/launch/waitlist/${id}/settings`,
            icon: Cog6ToothIcon,
            label: "Settings",
          },
        ]}
      />

      <HeaderNavigation
        navigationItems={[
          { label: "Wait-List", pathname: "/app/waitlist" },
          {
            label: `Launch ${String(id)}`,
            pathname: "",
          },
        ]}
      />
      {children}
    </>
  );
}
