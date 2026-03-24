"use client";

import Chip from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { EnvelopeIcon, LinkIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const dashboardTasks = [
  {
    id: 1,
    icon: LinkIcon,
    title: "Create wait-list",
    description: "Collect and manage signups.",
    href: "/app/waitlist/launch"
  },
  {
    id: 3,
    icon: EnvelopeIcon,
    title: "Email campaigns",
    description: "Write your first email template",
    href: "/app/emails",
    hasAI: true
  },
  {
    id: 2,
    icon: RectangleStackIcon,
    title: "Create landing page",
    description: "Build with templates and AI assistance.",
    href: "/app/landing-page",
    development: true
  },
];

export default function TaskCards() {
  return (
    <>
      {dashboardTasks.map((task, index) => (
        <Link key={task.id} href={task.href}>
          <div
            className={cn(
              "flex flex-col gap-4 py-5 px-5 rounded border border-dashed hover:from-background hover:to-zinc-950 hover:bg-radial-[at_50%_25%] relative",
              index === 0
                ? "hover:from-background hover:to-zinc-950 hover:bg-radial-[at_50%_25%] border-r border-b border-t border-l-4 !border-l-primary/70 hover:!border-l-primary rounded-l-none !border-r-zinc-800"
                : "hover:!border-zinc-700"
            )}
          >
            {task.hasAI && <Chip status="purple" className="absolute top-4 right-4">Template with AI</Chip>}
            {task.development && <Chip status="warning" className="absolute top-4 right-4">In Development</Chip>}
            <div
              className={cn(
                "size-10 rounded-md bg-default-100 flex items-center justify-center transition-colors",
                index === 0 && "!bg-primary-200",
                "group-hover:bg-primary-200"
              )}
            >
              <task.icon className="size-5" />
            </div>
            <div className="flex flex-col flex-1">
              <p className="font-medium text-base">{task.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
