"use client";

import ComingSoon from "@/components/global/coming-soon";
import PageComponent from "@/components/layouts/page-component";
import { GlobeAltIcon } from "@heroicons-animated/react";

export default function DomainsPage() {
  return (
    <PageComponent>
      <ComingSoon
        icon={GlobeAltIcon}
        feature="domains"
        title="Custom Domains are coming soon"
        description="Soon you'll be able to connect your own domains to serve waitlists and landing pages under your brand."
      />
    </PageComponent>
  );
}
