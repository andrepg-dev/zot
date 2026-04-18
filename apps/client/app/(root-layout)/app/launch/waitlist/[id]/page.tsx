"use client";

import { getEmailSendRecords } from "@/actions/emails/emails.actions";
import { getWaitListStats } from "@/actions/wait-list/stats.actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import ConversionRateChart from "@/components/wait-list/charts/conversion-rate-chart";
import DailyRegistrationsChart from "@/components/wait-list/charts/daily-registrations-chart";
import EmailsSentChart from "@/components/wait-list/charts/emails-sent-chart";
import FakeUsersBlockedChart from "@/components/wait-list/charts/fake-users-blocked-chart";
import TopReferrersChart from "@/components/wait-list/charts/top-referrers-chart";
import { cn } from "@/lib/utils";
import {
  ArrowTopRightOnSquareIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  HandRaisedIcon,
  ShareIcon,
  UserGroupIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { Alert } from "@heroui/alert";
import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

import { formatShortDate } from "@/lib/format-date";

function generateLast20Days() {
  const days: string[] = [];
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (let i = 19; i >= 0; i--) {
    const date = new Date(today - i * 86400000);
    days.push(formatShortDate(date.toISOString()));
  }
  return days;
}

function fillDailyData<T extends { date: string }>(
  apiData: T[] | undefined,
  days: string[],
  defaults: Omit<T, "date">
): T[] | undefined {
  if (!apiData) return undefined;
  const map = new Map(apiData.map((d) => [d.date, d]));
  return days.map((date) => (map.get(date) ?? { date, ...defaults }) as T);
}

export default function LaunchedWaitList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [animated, setAnimated] = React.useState(false);

  const { data, isPending } = useQuery({
    queryKey: [id],
    queryFn: async () => getWaitListStats(id)
  });

  const { data: emailRecords } = useQuery({
    queryKey: [id, "email-records"],
    queryFn: async () => await getEmailSendRecords(id)
  });

  React.useEffect(() => {
    setAnimated(true);
  }, []);

  const last20Days = React.useMemo(() => generateLast20Days(), []);

  const stats = [
    {
      id: 1,
      title: "Total Signups",
      value: data?.users?.total ?? 0,
      icon: UserPlusIcon,
      iconColor: "text-blue-500"
    },
    {
      id: 2,
      title: "Total Referrals",
      value: data?.users?.referred ?? 0,
      icon: ShareIcon,
      iconColor: "text-green-500"
    },
    {
      id: 3,
      title: "Signups Today",
      value: data?.users?.signUpsToday ?? 0,
      icon: UserGroupIcon,
      iconColor: "text-yellow-500"
    },
    {
      id: 4,
      title: "Emails sent",
      value: data?.emailsSent ?? 0,
      icon: EnvelopeIcon,
      iconColor: "text-muted-foreground",
      href: `/app/launch/waitlist/${id}/email/metrics`
    },
    {
      id: 5,
      title: "Fake users blocked",
      value: data?.usersBlocked ?? 0,
      icon: HandRaisedIcon,
      iconColor: "text-purple-500"
    }
  ];

  const rawRegistrations = data?.dailyRegistration?.map((d) => ({
    date: formatShortDate(d.createdAt),
    registrations: d.registrations,
    referrals: 0
  }));

  const dailyRegistrationsData = fillDailyData(rawRegistrations, last20Days, {
    registrations: 0,
    referrals: 0
  });

  const rawBlocked = data?.dailyUsersBlocked?.map((d) => ({
    date: formatShortDate(d.createdAt),
    blocked: d.blocked
  }));
  const fakeUsersBlockedData = fillDailyData(rawBlocked, last20Days, { blocked: 0 });

  const TOP_REFERRERS_SLOTS = 10;
  const topReferrersData = data
    ? (() => {
        const real = data.topReferrers.map((d) => ({
          name: d.email,
          referrals: d.referrals
        }));
        const empty = Array.from({ length: TOP_REFERRERS_SLOTS - real.length }, (_, i) => ({
          name: `Empty ${i + real.length + 1}`,
          referrals: 0
        }));
        return [...real, ...empty];
      })()
    : undefined;

  const rawConversion = data?.conversionRateOverTime?.map((d) => ({
    date: formatShortDate(d.createdAt),
    rate: Math.round(d.conversionRate * 100) / 100
  }));

  const conversionRateData = fillDailyData(rawConversion, last20Days, { rate: 0 });

  const rawEmailsSent = emailRecords?.map((d) => ({
    date: formatShortDate(d.createdAt),
    sent: d.sent,
    failed: d.failed
  }));

  const emailsSentData = fillDailyData(rawEmailsSent, last20Days, { sent: 0, failed: 0 });

  return (
    <PageComponent>
      {data?.sendEmailToNewSignup && !data?.emailTemplateToNewSignUps && (
        <Alert color="danger" variant="faded" radius="sm" classNames={{ base: "mb-4" }}>
          <div className="flex items-center gap-2">
            <Type>
              You have enabled &quot;Send email to new signups&quot; but no email template is
              configured.{" "}
              <Link href={`/app/launch/waitlist/${id}/settings`} className="underline font-medium">
                Go to Settings
              </Link>{" "}
              to select a template.
            </Type>
          </div>
        </Alert>
      )}

      <div className="flex items-start gap-2">
        <Title description={`ID: ${id}`} classNames={{ description: "mt-1" }}>
          <span>{isPending ? "Loading..." : data?.name}</span>
          {/* <Chip status="primary" className="ml-2 relative">Bernay Landing page</Chip> */}
        </Title>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 rounded-default">
        {stats.map((stat) => (
          <div key={stat.id} className="relative border  bg-background">
            {"href" in stat && stat.href && (
              <Link
                href={stat.href}
                className="absolute top-4 right-5 flex items-center gap-1 text-xs font-mono text-muted-foreground hover:underline decoration-2"
              >
                Activity
                <ArrowTopRightOnSquareIcon className="size-3" />
              </Link>
            )}
            <div className="px-5 py-4.5">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <NumberFlow
                    value={isPending ? 0 : animated ? stat.value : 0}
                    className="text-2xl font-semibold"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <stat.icon className={cn("size-4", stat.iconColor)} />
                  <p className="text-xs text-muted-foreground font-mono">{stat.title}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <Title description="Detailed analytics and insights">
          <span className="text-lg">Analytics</span>
        </Title>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 lg:columns-2 gap-6 mt-6 space-y-6">
        <div className="break-inside-avoid">
          <DailyRegistrationsChart data={dailyRegistrationsData} />
        </div>
        <div className="break-inside-avoid">
          <FakeUsersBlockedChart data={fakeUsersBlockedData} />
        </div>
        <div className="break-inside-avoid">
          <TopReferrersChart data={topReferrersData} />
        </div>
        <div className="break-inside-avoid">
          <ConversionRateChart data={conversionRateData} />
        </div>
        <div className="break-inside-avoid">
          <EmailsSentChart data={emailsSentData} />
        </div>
      </div>
    </PageComponent>
  );
}
