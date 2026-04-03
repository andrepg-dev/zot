"use client";

import { cn } from "@/lib/utils";
import { addToast } from "@heroui/react";
import Link from "next/link";
import React, { useEffect } from "react";
import GlobalButton from "./global/button";

export default function Form({
  children,
  error,
  ...props
}: {
  children: React.ReactNode;
  error?: Error | null;
} & React.FormHTMLAttributes<HTMLFormElement>) {
  useEffect(() => {
    if (error != null) {
      addToast({
        title: error?.message ?? <>Unexpeced error.</>,
        // description: <>{error?.message}</>,
        color: "foreground",
        endContent: (
          <div className="flex gap-2">
            <GlobalButton
              as={Link}
              href="/app/usage"
              size="sm"
              variant="bordered"
              className="text-black !border !border-black"
            >
              See usage
            </GlobalButton>

            <GlobalButton
              as={Link}
              href="/app/billing"
              size="sm"
              variant="solid"
              className="bg-black"
            >
              Upgrade
            </GlobalButton>
          </div>
        ),
        classNames: {
          base: cn(["flex flex-col items-start gap-2"])
        },
        hideIcon: true
      });
    }
  }, [error]);

  return <form {...props}>{children}</form>;
}
