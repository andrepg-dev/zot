"use client";

import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import UsersTable from "@/components/wait-list/tables/users-table";
import React from "react";

export default function MetricPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <PageComponent className="flex flex-col gap-6">
      <Title description="Email sending activity over time">Metrics</Title>
      <UsersTable id={id} />
    </PageComponent>
  );
}
