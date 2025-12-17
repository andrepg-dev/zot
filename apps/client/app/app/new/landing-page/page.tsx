"use client";

import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { defaultNavItems } from "@/store/sidebar/sidebar.constants";

export default function NewLandingPage() {
  return (
    <PageComponent>
      <HeaderNavigation
        navigationItems={[
          { label: "Landing Page", pathname: "/app/landing-page" },
          { label: "Create", pathname: "" },
        ]}
      />

      <SidebarNavigation hidden navItems={defaultNavItems} />

      <Title description="Create your own landing page">
        Landing page creation
      </Title>
    </PageComponent>
  );
}
