"use client";

import AreaChartComponent from "@/components/app/dashboard/area-chart";
import BarChartComponent from "@/components/app/dashboard/bar-chart";
import TaskCards from "@/components/app/dashboard/task-cards";
import PageComponent from "@/components/layouts/page-component";
import { Alert, Button } from "@heroui/react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <PageComponent className="!py-0 text-sm">
        <div className="flex flex-col gap-4">
          <Alert
            color="primary"
            title={"Trial expired"}
            description={
              "Your trial has expired. Upgrade to continue accessing dashboard features. Waiter signups will continue to work normally."
            }
            variant="faded"
            isClosable
            endContent={
              <Button
                as={Link}
                href="/pricing"
                size="sm"
                className="mx-4"
                variant="faded"
              >
                Upgrade now
              </Button>
            }
            className="mt-6"
          ></Alert>
        </div>

        <div className="flex flex-col my-4">
          <h2 className="text-base">No active waitlist</h2>
          <h4 className="text-muted-foreground">
            Below are some tasks to get you started.
          </h4>
        </div>
      </PageComponent>
      <hr />

      <PageComponent className="grid grid-cols-3 gap-4">
        <TaskCards />
      </PageComponent>

      <hr />

      <PageComponent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-base font-medium">Analytics Overview</h2>
            <h4 className="text-sm text-muted-foreground">
              Track your performance over time
            </h4>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            <AreaChartComponent />
            <BarChartComponent />
          </div>
        </div>
      </PageComponent>
    </>
  );
}
