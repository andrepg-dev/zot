"use client";

import { getProfile } from "@/actions/auth/profile";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { addToast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAddUser } from "zot-sdk/react";
import Type from "../type";
import InputComponent from "../ui/input";
import PrimaryActionButton from "./primary-action-button";

const WAITLIST_ID = "69e65aadd2fdba5e8d8d8461";

// Seeded PRNG to avoid hydration mismatch (Math.random differs server vs client)
function seededRandom(seed: number) {
  let s = seed;

  return () => {
    s = (s * 16807 + 0) % 2147483647;

    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

const floatingParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: rand() * 100,
  y: rand() * 100,
  size: rand() * 4 + 3,
  duration: rand() * 5 + 4,
  delay: rand() * 3
}));

export default function ComingSoon({
  title,
  description,
  icon: Icon,
  feature
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  feature: "landing-page" | "domains";
}) {
  const [email, setEmail] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  const { addUser, isPending, isUserRegistered } = useAddUser({
    waitlistId: WAITLIST_ID,
    apiKey: process.env.NEXT_PUBLIC_ZOT_API_KEY!,
    onError: (err: any) => {
      addToast({ title: "Error", description: err?.body?.message, color: "danger" })
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    addUser({ email, metadata: { feature, profile } });
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] max-w-lg mx-auto text-center">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            initial={{ opacity: 0.15 }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.15, 0.4, 0.15]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
              repeatType: "loop"
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <div className="flex items-center justify-center size-14 rounded-sm border bg-default-100 text-muted-foreground">
          <Icon size={22} />
        </div>

        <div className="flex flex-col gap-2">
          <Type variant="h1">{title}</Type>
          <Type className="text-muted-foreground text-pretty leading-relaxed">{description}</Type>
        </div>

        {isUserRegistered ? (
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-5 text-success" />
            <Type className="text-success">
              Thanks! We&apos;ll notify you when this feature is available.
            </Type>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full gap-2 justify-center">
            <InputComponent
              size="sm"
              type="email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
              className="min-w-64 max-w-64"
            />
            <PrimaryActionButton type="submit" isLoading={isPending}>
              Notify me
            </PrimaryActionButton>
          </form>
        )}
      </div>
    </div>
  );
}
