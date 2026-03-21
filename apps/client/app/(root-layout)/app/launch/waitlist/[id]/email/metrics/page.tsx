"use client";

import { getEmailSendRecords } from "@/actions/emails/emails.actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import EmailsSentChart from "@/components/wait-list/charts/emails-sent-chart";
import UsersTable from "@/components/wait-list/tables/users-table";
import { Kbd } from "@heroui/kbd";
import { Tab, Tabs } from "@heroui/tabs";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function generateLast20Days() {
  const days: string[] = [];
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (let i = 19; i >= 0; i--) {
    const date = new Date(today - i * 86400000);
    days.push(formatDate(date.toISOString()));
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

export default function MetricPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const { data } = useQuery({
    queryKey: [id, "email-records"],
    queryFn: async () => await getEmailSendRecords(id)
  });

  const last20Days = React.useMemo(() => generateLast20Days(), []);

  const rawEmailsSent = data?.map((d) => ({
    date: formatDate(d.createdAt),
    sent: d.sent,
    failed: d.failed
  }));

  const emailsSentData = fillDailyData(rawEmailsSent, last20Days, { sent: 0, failed: 0 });

  return (
    <PageComponent className="flex flex-col gap-6">
      <Title description="Email sending activity over time">Metrics</Title>

      <Tabs aria-label="Tabs sizes" size={"sm"} >
        <Tab
          key="table"
          title={
            <>
              <Kbd className="text-xs bg-background mr-2">A</Kbd>
              Analytics
            </>
          }
        >
          <EmailsSentChart data={emailsSentData} />
        </Tab>

        <Tab key="music" title={
          <>
            <Kbd className="text-xs bg-background mr-2">T</Kbd>
            Table
          </>
        }
        >
          <UsersTable id={id} />
        </Tab>
      </Tabs>

      {/* <PrimaryActionButton startContent={<RocketLaunchIcon className="size-4" />}>
          Send email campaign
          <Kbd keys={["command"]} className="text-xs">K</Kbd>
        </PrimaryActionButton> */}

    </PageComponent>
  );
}
