"use client";

import { getUserQuote } from "@/actions/user-quote/user-quote.actions";
import BillingDrawing from "@/components/global/billing-drawing";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import { CircularProgress } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

interface QuotaItem {
  label: string;
  used: number;
  limit: number;
}

interface QuotaSection {
  title: string;
  description: string;
  items: QuotaItem[];
  disabled?: boolean;
}

interface UserQuoteResponse {
  usage: {
    userSignUp: number;
    waitlist: number;
    landingPage: number;
    emailsSent: number;
    emailsTemplates: number;
    domains: { email: number; general: number };
  };
  limits: {
    userSignUp: number;
    waitlist: number;
    landingPage: number;
    emailsSent: number;
    emailsTemplates: number;
    domains: { email: number; general: number };
  };
  plan: string;
}

function getPercentage(used: number, limit: number) {
  if (limit === 0) return 0;

  return Math.min(Math.round((used / limit) * 100), 100);
}

function getProgressColor(percentage: number): "primary" | "warning" | "danger" | "success" {
  if (percentage >= 90) return "danger";
  if (percentage >= 70) return "warning";
  if (percentage > 0) return "primary";

  return "success";
}

function buildSections(data: UserQuoteResponse): QuotaSection[] {
  const { usage, limits } = data;

  return [
    {
      title: "Waitlist",
      description: "Create and manage waitlists to collect user sign-ups before launch.",
      items: [
        { label: "Waitlists", used: usage.waitlist, limit: limits.waitlist },
        { label: "User sign-ups", used: usage.userSignUp, limit: limits.userSignUp }
      ]
    },
    {
      title: "Email",
      description: "Send transactional and campaign emails to your audience.",
      items: [
        { label: "Emails sent", used: usage.emailsSent, limit: limits.emailsSent },
        { label: "Email templates", used: usage.emailsTemplates, limit: limits.emailsTemplates }
      ]
    },
    {
      title: "Landing Pages",
      description: "Build and publish landing pages for your products.",
      items: [{ label: "Landing pages", used: usage.landingPage, limit: limits.landingPage }],
      disabled: true
    },
    {
      title: "Domains",
      description: "Connect custom domains for email sending and landing pages.",
      items: [
        { label: "Email domains", used: usage.domains.email, limit: limits.domains.email },
        { label: "General domains", used: usage.domains.general, limit: limits.domains.general }
      ],
      disabled: true
    }
  ];
}

function QuotaRow({ item }: { item: QuotaItem }) {
  const percentage = getPercentage(item.used, item.limit);
  const color = getProgressColor(percentage);

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <CircularProgress
          value={percentage}
          color={color}
          size="sm"
          aria-label={`${item.label} usage`}
          classNames={{
            svg: "w-5 h-5",
            indicator: "stroke-[3px]",
            track: "stroke-[3px]"
          }}
        />
        <Type variant="sm">{item.label}</Type>
      </div>
      <Type variant="sm" className="text-muted-foreground">
        {item.used.toLocaleString()} / {item.limit.toLocaleString()}
      </Type>
    </div>
  );
}

function QuotaSectionBlock({
  section,
  plan,
  isLast
}: {
  section: QuotaSection;
  plan: string;
  isLast: boolean;
}) {
  const isPremium = plan === "PREMIUM";
  const isDisabled = section.disabled === true;

  return (
    <div className={`${!isLast ? "border-b pb-10" : ""} ${isDisabled ? "opacity-50" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Type variant="h4">{section.title}</Type>
            {isDisabled && (
              <span className="inline-flex items-center text-[10px] rounded-full border px-2 py-0.5 text-muted-foreground">
                Coming soon
              </span>
            )}
          </div>
          <Type className="text-muted-foreground max-w-xs">{section.description}</Type>
          {!isPremium && !isDisabled && (
            <div className="mt-2">
              <BillingDrawing>
                <span className="inline-flex cursor-pointer items-center text-xs rounded-sm border bg-foreground px-3 py-1.5 text-white dark:text-black">
                  Upgrade
                </span>
              </BillingDrawing>
            </div>
          )}
        </div>

        <div>
          <Type variant="h6" className="mb-2">
            {isPremium ? "Premium" : "Free"}
          </Type>
          <div className="divide-y divide-border">
            {section.items.map((item) => (
              <QuotaRow key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsagePage() {
  const { data, isPending } = useQuery({
    queryKey: ["user-quote"],
    queryFn: getUserQuote
  });

  const quoteData = data as UserQuoteResponse | undefined;
  const sections = quoteData ? buildSections(quoteData) : [];

  return (
    <PageComponent className="p-8 py-6">
      <Title
        description="Monitor your resource usage and quota limits across all services."
        className="mb-2"
      >
        Usage
      </Title>

      {isPending ? (
        <div className="flex flex-col gap-10 mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <div className="h-5 w-32 bg-default-100 animate-pulse rounded-sm" />
                <div className="h-4 w-48 bg-default-100 animate-pulse rounded-sm" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-4 w-16 bg-default-100 animate-pulse rounded-sm" />
                <div className="h-10 bg-default-100 animate-pulse rounded-sm" />
                <div className="h-10 bg-default-100 animate-pulse rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        sections.map((section, i) => (
          <QuotaSectionBlock
            key={section.title}
            section={section}
            plan={quoteData?.plan ?? "FREE"}
            isLast={i === sections.length - 1}
          />
        ))
      )}
    </PageComponent>
  );
}
