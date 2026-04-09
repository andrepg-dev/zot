"use client";

import { getAiConversations, type AiConversation } from "@/actions/ai/ai-email.actions";
import PageActions from "@/components/global/page-actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function EmailChatsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["ai-conversations"],
    queryFn: getAiConversations
  });

  const conversations = ((data ?? []) as AiConversation[]).filter((c) =>
    (c.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageComponent className="">
      <Title description="Your AI email conversations">Chats</Title>

      {/* <div className="flex items-center gap-2 my-4 mt-5">
        <div className="flex-1">
          <InputComponent
            size="sm"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<MagnifyingGlassIcon className="size-4 text-default-300" />}
            isClearable
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-sm border px-3 h-9 text-xs text-muted-foreground hover:bg-default-50"
        >
          <AdjustmentsHorizontalIcon className="size-4" />
          Filter
        </button>
      </div> */}

      <PageActions
        searchPlaceholder="Search chats..."
        onSearchChange={setSearch}
        actionButton={{
          label: "Create conversation",
          href: "/app/new/email/template"
        }}
        className="w-full"
      />

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner size="sm" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Type>No chats yet</Type>
          <Type variant="sm" className="text-muted-foreground">
            Start a new email conversation to see it here
          </Type>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-[1fr_200px_120px] gap-4 px-4 py-2 text-xs text-muted-foreground">
            <span>Name</span>
            <span>Project</span>
            <span className="text-right">Updated</span>
          </div>
          {conversations.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() =>
                router.push(`/app/new/email/template?conversationId=${c._id}&isEdition=true`)
              }
              className="grid grid-cols-[1fr_200px_120px] gap-4 items-center px-4 py-4 text-left hover:bg-default-50 cursor-pointer"
            >
              <Type className="truncate">{c.title || "Untitled chat"}</Type>
              <Type variant="sm" className="text-muted-foreground">
                Draft
              </Type>
              <Type variant="sm" className="text-muted-foreground text-right">
                {timeAgo(c.updatedAt)}
              </Type>
            </button>
          ))}
        </div>
      )}
    </PageComponent>
  );
}
