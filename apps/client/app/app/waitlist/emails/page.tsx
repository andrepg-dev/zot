import PageActions from "@/components/global/page-actions";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";

export default function EmailsPage() {
  return (
    <PageComponent>
      <Title description="Manage templates in email section">Email</Title>

      <PageActions
        searchPlaceholder="Search template"
        actionButton={{
          label: "Create template",
          href: "/app/new/template"
        }}
      />

    </PageComponent>
  )
}
