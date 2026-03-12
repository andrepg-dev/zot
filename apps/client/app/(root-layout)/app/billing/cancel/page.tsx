"use client";

import PageComponent from "@/components/layouts/page-component";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { defaultNavItems } from "@/store/sidebar/sidebar.constants";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense } from "react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const bgText = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
};

function CancelContent() {
  return (
    <>
      <SidebarNavigation hidden navItems={defaultNavItems} className="duration-1000" />

      <PageComponent className="mx-auto text-foreground relative min-h-[calc(100vh-8rem)] flex flex-col justify-center overflow-hidden">
        {/* Texto de fondo alineado con success */}
        <motion.span
          aria-hidden
          variants={bgText}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 flex items-center justify-center text-[clamp(80px,20vw,150px)] font-bold leading-none text-foreground/[0.05] select-none pointer-events-none whitespace-nowrap"
        >
          Launch & validate
        </motion.span>

        <motion.div
          className="flex flex-col items-center gap-8 py-16 relative z-10"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center space-y-3">
            <motion.p
              variants={item}
              className="text-xs tracking-[0.25em] uppercase text-amber-300/80"
            >
              Checkout cancelled
            </motion.p>
            <motion.h1
              variants={item}
              className="text-3xl font-semibold"
            >
              No charges were made
            </motion.h1>
            <motion.p
              variants={item}
              className="text-muted-foreground max-w-md mx-auto leading-relaxed"
            >
              You left before completing payment. Your card was not charged. You can
              return to plans anytime when you&apos;re ready to upgrade.
            </motion.p>
          </div>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-3 mt-4"
          >
            <Button
              as={Link}
              href="/app/billing"
              color="primary"
              size="sm"
              className="group"
              startContent={
                <span className="inline-flex transition-transform duration-200 ease-out group-hover:-translate-x-0.5">
                  <ArrowLeftIcon className="w-4 h-4" />
                </span>
              }
            >
              Back to plans
            </Button>

            <Button
              as={Link}
              href="/app/dashboard"
              variant="bordered"
              size="sm"
              className="border-blue-500/50 text-blue-100 hover:border-blue-400 hover:bg-blue-500/10"
            >
              Go to dashboard
            </Button>
          </motion.div>
        </motion.div>
      </PageComponent>
    </>
  );
}

export default function BillingCancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}
