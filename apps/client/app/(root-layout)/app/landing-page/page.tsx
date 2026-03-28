"use client"

import ComingSoon from "@/components/global/coming-soon";
import PageComponent from "@/components/layouts/page-component";
import { Square3Stack3DIcon } from "@heroicons-animated/react";

export default function LandingPage() {
  return (
    <PageComponent>
      <ComingSoon
        icon={Square3Stack3DIcon}
        title="Landing Pages are coming soon"
        description="We're building a powerful landing page editor so you can create, customize, and publish pages directly from Zot."
      />
    </PageComponent>
  );
}
