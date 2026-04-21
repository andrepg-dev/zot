"use client";

import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import { useHotkey } from "@/hooks/use-hotkey";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Kbd } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/app/emails/templates", label: "Templates" },
  { href: "/app/emails/chats", label: "Chats" }
];

export default function EmailsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useHotkey({
    key: "k",
    modifiers: ["meta"],
    onPress: () => router.push("/app/new/email/template")
  });

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6">
        <Title
          description="Manage your email templates and AI conversations"
          rightChildren={
            <GlobalButton
              as={Link}
              href="/app/new/email/template"
              className="bg-primary border-transparent border transition-none"
              startContent={<PlusIcon className="size-5" />}
              endContent={
                <Kbd className="text-xs" keys={["command"]}>
                  K
                </Kbd>
              }
              size="sm"
              variant="shadow"
            >
              Create template
            </GlobalButton>
          }
        >
          Emails
        </Title>
        <div className="flex gap-6 border-b mt-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-1 py-2 text-sm border-b-2 -mb-px transition-colors",
                  isActive
                    ? "border-primary-400 text-white"
                    : "border-transparent text-muted-foreground hover:text-white"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
