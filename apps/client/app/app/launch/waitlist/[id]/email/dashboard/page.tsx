/**
 * In this page, we gonna have a few things.
 *
 * We can create, delete, update and delete emails.
 *
 * We will can send email campaign based on users widgets.
 *
 * We will choose the email template to send to the user.
 *
 * @returns
 */

import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";

export default function DashboardEmailPage() {
  return (
    <PageComponent>
      <Title description="Manage your email here">Dashboard</Title>
    </PageComponent>
  );
}
