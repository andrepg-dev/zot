"use client";

import { getWaitListStats } from "@/actions/wait-list/stats.actions";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import Chip from "@/components/ui/chip";
import { ArrowUturnLeftIcon, BoltIcon, Cog6ToothIcon, EnvelopeIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function WaitListLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();

  const { data, isPending } = useQuery({
    queryKey: [id],
    queryFn: () => getWaitListStats(id)
  });

  const statusLabel = data?.isAvailable ? "Active" : "Disabled";

  return (
    <>
      <HeaderNavigation
        navigationItems={[
          { label: "Wait-List", pathname: "/app/waitlist/dashboard" },
          {
            label: isPending ? "Loading..." : (data?.name ?? ""),
            pathname: ""
          }
        ]}
      >
        <Chip status={isPending ? "skeleton" : (data?.isAvailable ? "active" : "warning")}>
          {isPending ? "Loading" : statusLabel}
        </Chip>
      </HeaderNavigation>
      <SidebarNavigation
        navItems={[
          {
            href: `/app/waitlist/dashboard`,
            icon: ArrowUturnLeftIcon,
            label: "WaitLists"
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
            label: "Emails",
            subItem: [
              {
                label: "Metrics",
                href: `/app/launch/waitlist/${id}/email/metrics`
              },
              {
                label: "Campaign",
                href: `/app/launch/waitlist/${id}/email/campaign`
              }
            ]
          },

          // {
          //   href: `/app/launch/waitlist/${id}/api-keys`,
          //   icon: KeyIcon,
          //   label: "Api Keys"
          // },
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
      {children}
    </>
  );
}
