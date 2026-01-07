"use client";

import LandingPageCard from "@/components/app/landing-page/landing-page-card";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Link from "next/link";

export default function LandingPage() {
  return (
    <PageComponent>
      <Title description="Build and manage your landing pages">Landing Page</Title>

      <div className="flex justify-between my-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search by name..."
            variant="bordered"
            startContent={<MagnifyingGlassIcon className="text-default-300 size-5" />}
            size="sm"
            isClearable
            classNames={{
              base: "max-w-sm",
              inputWrapper: "border-1"
            }}
          />

          <Button size="sm" variant="light" className="min-w-max border border-dashed">
            <FunnelIcon className="size-4" />
          </Button>
        </div>

        <Button
          as={Link}
          href="/app/new/landing-page"
          className="bg-primary border-transparent border transition-none"
          startContent={<PlusIcon className="size-5" />}
          size="sm"
          variant="shadow"
          type="button"
        >
          Landing Page
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4">
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
