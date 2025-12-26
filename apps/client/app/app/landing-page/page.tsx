import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Link from "next/link";

export default function LandingPage() {
  return (
    <PageComponent>
      <Title description="Build and manage your landing pages">
        Landing Page
      </Title>

      {/* List of cards of templates */}

      <div className="flex justify-between my-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search by name..."
            variant="bordered"
            startContent={
              <MagnifyingGlassIcon className="text-default-300 size-5" />
            }
            size="sm"
            isClearable
            classNames={{
              base: "max-w-sm",
              inputWrapper: "border-1",
            }}
          />

          <Button
            size="sm"
            variant="light"
            className="min-w-max border border-dashed"
          >
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
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
        <div className="border rounded-default aspect-video bg-default-50 hover:bg-default-100"></div>
      </div>
    </PageComponent>
  );
}
