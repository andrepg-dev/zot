"use client";

import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import Chip from "@/components/ui/chip";
import {
  BoltIcon,
  Cog6ToothIcon,
  HomeIcon,
  PlusCircleIcon,
  QueueListIcon
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";

export default function WaitListLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <SidebarNavigation
        navItems={[
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
            href: `/app/launch/waitlist/${id}/settings`,
            icon: Cog6ToothIcon,
            label: "Settings"
          },
          { type: "divider" },
          {
            href: `/app/launch/waitlist/${id}/widget-builder`,
            icon: PlusCircleIcon,
            label: "Widget Builder"
          },
          {
            href: `/app/launch/waitlist/${id}/widget-list`,
            icon: QueueListIcon,
            label: "Widget List"
          }
        ]}
      />

      <HeaderNavigation
        navigationItems={[
          { label: "Wait-List", pathname: "/app/waitlist" },
          {
            label: `Launch ${String(id)}`,
            pathname: ""
          }
        ]}
        children={<Chip status="active" label="Active"></Chip>}
      />
      {children}
    </>
  );
}
