"use client";

import { cn } from "@/lib/utils";
import {
  EnvelopeIcon,
  LinkIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const dashboardTasks = [
  {
    id: 1,
    icon: RectangleStackIcon,
    title: "Start creating landing page",
    description: "Create a landing page using templates + AI.",
    href: "/app/launch/waitlist",
  },
  {
    id: 2,
    icon: LinkIcon,
    title: "Integrate waitlist",
    description: "Select a plan to start collecting signups.",
    href: "/app/launch/waitlist",
  },
  {
    id: 3,
    icon: EnvelopeIcon,
    title: "Send email campaigns",
    description:
      "Time to launch seriously and tell to your clients about your creation.",
    href: "/app/launch/waitlist",
  },
];

export default function TaskCards() {
  return (
    <>
      {dashboardTasks.map((task, index) => (
        <Link key={task.id} href={task.href}>
          <div
            className={cn(
              "flex flex-col gap-4 p-6 rounded-lg border bg-background transition-all duration-200",
              "hover:bg-primary/20",
              "hover:shadow-md h-full",
              index === 0 &&
                "from-primary/5 to-background bg-linear-to-r border-r border-b border-t border-l-4 !border-l-primary/70 rounded-l-none !border-r-zinc-800",
            )}
          >
            <div
              className={cn(
                "size-12 rounded-md bg-default-100 flex items-center justify-center transition-colors",
                index === 0 && "!bg-primary-200",
                "group-hover:bg-primary-200",
              )}
            >
              <task.icon className="size-6" />
            </div>
            <div className="flex flex-col flex-1">
              <p className="font-medium text-base">{task.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
