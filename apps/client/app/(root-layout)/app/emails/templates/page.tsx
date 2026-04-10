"use client";

import { getEmailTemplates } from "@/actions/email-templates/email-templates.actions";
import PageActions from "@/components/global/page-actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import { useHotkey } from "@/hooks/use-hotkey";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Kbd } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import type { EmailTemplate } from "@repo/packages/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmailTemplatesPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useHotkey({
    key: "k",
    modifiers: ["meta"],
    onPress: () => {
      router.push("/app/new/email/template");
    }
  });

  const { data, isPending } = useQuery({
    queryKey: ["email-templates"],
    queryFn: getEmailTemplates
  });

  const templates = ((data ?? []) as EmailTemplate[]).filter((t) =>
    t.alias.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageComponent>
      <Title description="Manage your saved email templates">Templates</Title>

      <PageActions
        searchPlaceholder="Search template..."
        onSearchChange={setSearch}
        actionButton={{
          label: "Create template",
          href: "/app/new/email/template",
          endContent: (
            <Kbd className="text-xs" keys={["command"]}>
              K
            </Kbd>
          )
        }}
      />

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner size="sm" />
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <SparklesIcon className="size-5" />
          <Type>No templates yet</Type>
          <Type variant="sm" className="text-muted-foreground">
            Start creating email templates with AI
          </Type>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {templates.map((template) => (
            <div className="flex flex-col gap-2" key={template._id}>
              <div className="bg-white rounded-sm w-full aspect-video flex justify-center relative">
                <div className="w-3/4 h-3/4 bottom-0 absolute rounded-sm overflow-hidden">
                  <Image
                    src={template.preview}
                    alt={`Preview of ${template.alias} template`}
                    width={700}
                    height={700}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex flex-col">
                  <Type variant="h6" className="text-medium">
                    {template.alias}
                  </Type>
                  <Type className="text-muted-foreground">{template._id}</Type>
                </div>

                {template.status == "published" && (
                  <Chip status="neutral" className="capitalize">
                    {template.status}
                  </Chip>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageComponent>
  );
}
