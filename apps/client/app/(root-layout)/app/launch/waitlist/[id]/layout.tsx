"use client";

import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import Chip from "@/components/ui/chip";
import { ArrowUturnLeftIcon, BoltIcon, Cog6ToothIcon, EnvelopeIcon, HomeIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";

export default function WaitListLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <SidebarNavigation
        navItems={[
          {
            href: `/app/waitlist/dashboard`,
            icon: ArrowUturnLeftIcon,
            label: "Back to waitlist"
          },
          { type: "divider" },
          {
            href: `/app/launch/waitlist/${id}`,
            icon: HomeIcon,
            label: "Overview"
          },
          {
            href: `/app/launch/waitlist/${id}/webhooks`,
            icon: BoltIcon,
            label: "Webhooks"
          },
          {
            href: `/app/launch/waitlist/${id}/email`,
            icon: EnvelopeIcon,
            label: "Email",
          },
          {
            href: `/app/launch/waitlist/${id}/api-keys`,
            icon: KeyIcon,
            label: "Api Keys"
          },
          { type: "divider" },
          {
            href: `/app/launch/waitlist/${id}/settings`,
            icon: Cog6ToothIcon,
            label: "Settings"
          },
          // {
          //   href: `/app/launch/waitlist/${id}/widget-builder`,
          //   icon: PlusCircleIcon,
          //   label: "Widget Builder"
          // },
          // {
          //   href: `/app/launch/waitlist/${id}/widget-list`,
          //   icon: QueueListIcon,
          //   label: "Widget List"
          // }
        ]}
      />

      <HeaderNavigation
        navigationItems={[
          { label: "Wait-List", pathname: "/app/waitlist/dashboard" },
          {
            label: `Launch ${String(id)}`,
            pathname: ""
          }
        ]}
        children={<Chip status="active">Active</Chip>}
      />
      {children}
    </>
  );
}
