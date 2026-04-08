"use client";

import Chip from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { EnvelopeIcon, LinkIcon, RectangleStackIcon } from "@heroicons-animated/react";
import Link from "next/link";
import { useRef } from "react";

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
    href: "/app/waitlist/emails",
    hasAI: true
  },
  {
    id: 2,
    icon: RectangleStackIcon,
    title: "Create landing page",
    description: "Build with templates and AI assistance.",
    href: "/app/landing-page",
    development: true
  }
];

function TaskCard({ task, index }: { task: (typeof dashboardTasks)[number]; index: number }) {
  const iconRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  return (
    <Link key={task.id} href={task.href}>
      <div
        className={cn(
          "flex flex-col gap-4 py-5 px-5 border border-dashed hover:from-background hover:to-zinc-950 hover:bg-radial-[at_50%_25%] relative",
          index === 0
            ? "hover:from-background hover:to-zinc-950 hover:bg-radial-[at_50%_25%] border-r border-b border-t border-l-4 !border-l-primary/70 hover:!border-l-primary rounded-l-none !border-r-zinc-800"
            : "hover:!border-zinc-700"
        )}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        {task.hasAI && (
          <Chip status="purple" className="absolute top-4 right-4 font-mono rounded-sm">
            AI Included
          </Chip>
        )}
        {task.development && (
          <Chip status="warning" className="absolute top-4 right-4 rounded-sm font-mono">
            In Development
          </Chip>
        )}

        <div
          className={cn(
            "size-10 rounded-sm bg-default-100/70 flex items-center justify-center transition-colors",
            index === 0 && "!bg-primary-200",
            "group-hover:bg-primary-200"
          )}
        >
          <task.icon ref={iconRef} size={20} />
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-medium text-base">{task.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function TaskCards() {
  return (
    <>
      {dashboardTasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} />
      ))}
    </>
  );
}
