"use client";

import { getEmailSendRecords } from "@/actions/emails/emails.actions";
import PrimaryActionButton from "@/components/global/primary-action-button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import EmailsSentChart from "@/components/wait-list/charts/emails-sent-chart";
import UsersTable from "@/components/wait-list/tables/users-table";
import { useHotkey } from "@/hooks/use-hotkey";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { Kbd } from "@heroui/kbd";
import { Tab, Tabs } from "@heroui/tabs";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

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
  const [selectedTab, setSelectedTab] = useState("analytics");

  useHotkey({ key: "1", onPress: () => setSelectedTab("analytics"), modifiers: ["meta"] });
  useHotkey({ key: "2", onPress: () => setSelectedTab("table"), modifiers: ["meta"] });

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

      <div className="flex items-center justify-between">
        <Tabs
          aria-label="Tabs sizes"
          size={"sm"}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(String(key))}
        >
          <Tab
            key="analytics"
            title={
              <>
                <Kbd className="text-xs bg-background mr-2" keys={["command"]}>1</Kbd>
                Analytics
              </>
            }
          />
          <Tab
            key="table"
            title={
              <>
                <Kbd className="text-xs bg-background mr-2" keys={["command"]}>2</Kbd>
                History
              </>
            }
          />
        </Tabs>

        <PrimaryActionButton startContent={<RocketLaunchIcon className="size-4" />}>
          Send email campaign
          <Kbd keys={["command"]} className="text-xs">K</Kbd>
        </PrimaryActionButton>
      </div>

      {selectedTab === "analytics" && <EmailsSentChart data={emailsSentData} />}
      {selectedTab === "table" && <UsersTable id={id} />}

    </PageComponent>
  );
}
