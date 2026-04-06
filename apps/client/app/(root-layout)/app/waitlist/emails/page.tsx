"use client";

import { getAiConversations, type AiConversation } from "@/actions/ai/ai-email.actions";
import PageActions from "@/components/global/page-actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import { formatDateTime } from "@/lib/format-date";
import { ChatBubbleLeftRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function EmailsPage() {
  const [search, setSearch] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["ai-conversations"],
    queryFn: getAiConversations
  });

  const conversations = (data ?? []).filter((c: AiConversation) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageComponent>
      <Title description="Manage templates and AI conversations">Email</Title>

      <PageActions
        searchPlaceholder="Search conversation..."
        onSearchChange={setSearch}
        actionButton={{
          label: "Create template",
          href: "/app/new/email/template"
        }}
      />

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner size="sm" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <SparklesIcon className="size-5" />
          <Type>No conversations yet</Type>
          <Type variant="sm" className="text-muted-foreground">
            Start creating email templates with AI
          </Type>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {conversations.map((conversation: AiConversation) => (
            <Card
              key={conversation._id}
              as={Link}
              href={`/app/new/email/template?conversationId=${conversation._id}&isEdition=true`}
              isPressable
              className="border"
              radius="sm"
            >
              <CardBody className="p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <ChatBubbleLeftRightIcon className="size-4 min-w-4 text-muted-foreground" />
                      <Type variant="h6" className="truncate">
                        {conversation.title}
                      </Type>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Type variant="sm" className="text-muted-foreground">
                        Messages
                      </Type>
                      <Type variant="sm">{conversation.messages.length}</Type>
                    </div>
                    <div className="flex justify-between items-center">
                      <Type variant="sm" className="text-muted-foreground">
                        Created
                      </Type>
                      <Type variant="sm">{formatDateTime(conversation.createdAt)}</Type>
                    </div>
                    <div className="flex justify-between items-center">
                      <Type variant="sm" className="text-muted-foreground">
                        Last updated
                      </Type>
                      <Type variant="sm">{formatDateTime(conversation.updatedAt)}</Type>
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
