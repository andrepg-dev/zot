"use client";

import LandingPageCard from "@/components/app/landing-page/landing-page-card";
import PageActions from "@/components/global/page-actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";

export default function LandingPage() {
  return (
    <PageComponent>
      <Title description="Build and manage your landing pages">Landing Page</Title>

      <PageActions
        searchPlaceholder="Search by name..."
        actionButton={{
          label: "Landing Page",
          href: "/app/new/landing-page"
        }}
      />

      {/* Cards */}
      <div className="grid grid-cols-4 2xl:grid-cols-5 gap-4">
        <LandingPageCard
          imageSrc="https://landingfoliocom.imgix.net/inspiration/1753871525950Headroomdesktopaea69be627494885b22b2d1d83b19207png?&q=75&auto=format&crop=top,left&fit=crop&auto=format&w=600&h=800"
          title="Breyta"
          views="30,920 views"
          href="/app/edit/headroom-landing-page-01/landing-page"
        />

        <LandingPageCard
          imageSrc="https://landingfoliocom.imgix.net/inspiration/1740191221789Breytadesktop64425157e30f4bdc98ee65bbfbfd1bb0png?&q=75&auto=format&crop=top,left&fit=crop&auto=format&w=600&h=800"
          title="Breyta"
          views="30,920 views"
          href="/app/edit/breyta-landing-page-02/landing-page"
        />
        <LandingPageCard
          imageSrc="https://landingfoliocom.imgix.net/inspiration/1740190763956Riley2020Parenting20with20Superpowers2020Rileydesktopd25340bcbe2842d488dd3afff9b33f2dpng?&q=75&auto=format&crop=top,left&fit=crop&auto=format&w=600&h=800"
          title="Breyta"
          views="30,920 views"
          href="/app/edit/riley-parenting-landing-page-03/landing-page"
        />
        <LandingPageCard
          imageSrc="https://landingfoliocom.imgix.net/inspiration/1730606020689SEO20Course20by20Dannydesktop616d9458c2a94af58e9a28824d44a20dpng?&q=75&auto=format&crop=top,left&fit=crop&auto=format&w=600&h=800"
          title="Breyta"
          views="30,920 views"
          href="/app/edit/seo-course-danny-landing-page-04/landing-page"
        />
      </div>
    </PageComponent>
  );
}
