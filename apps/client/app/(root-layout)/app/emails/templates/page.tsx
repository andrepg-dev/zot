"use client";

import { getEmailTemplates } from "@/actions/email-templates/email-templates.actions";
import PageActions from "@/components/global/page-actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import { useHotkey } from "@/hooks/use-hotkey";
import { formatDateTime } from "@/lib/format-date";
import { EnvelopeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@heroui/card";
import { Kbd } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import type { EmailTemplate } from "@repo/packages/shared/schemas";
import { useQuery } from "@tanstack/react-query";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card key={template._id} className="border bg-default-100/50" radius="sm">
              <CardBody className="p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <EnvelopeIcon className="size-4 min-w-4 text-muted-foreground" />
                      <Type variant="h6" className="truncate">
                        {template.alias}
                      </Type>
                    </div>
                    <Chip status={template.status === "published" ? "active" : "neutral"}>
                      {template.status}
                    </Chip>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2">
                      <Type variant="sm" className="text-muted-foreground">
                        Subject
                      </Type>
                      <Type variant="sm" className="truncate">
                        {template.subject || "—"}
                      </Type>
                    </div>
                    <div className="flex justify-between items-center">
                      <Type variant="sm" className="text-muted-foreground">
                        Created
                      </Type>
                      <Type variant="sm">{formatDateTime(template.createdAt)}</Type>
                    </div>
                    <div className="flex justify-between items-center">
                      <Type variant="sm" className="text-muted-foreground">
                        Last updated
                      </Type>
                      <Type variant="sm">{formatDateTime(template.updatedAt)}</Type>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </PageComponent>
  );
}
