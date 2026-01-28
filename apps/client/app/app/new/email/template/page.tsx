import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";

/**
 * The goal is to have by one side, the code, and the other, the preview
 *
 * @returns
 */
export default function CreateEmailPage() {
  return (
    <>
      {/* Navigation */}
      <SidebarNavigation hidden />

      <HeaderNavigation
        navigationItems={[
          {
            label: "Wait-List",
            pathname: "/app/waitlist/dashboard"
          },
          {
            label: "Emails",
            pathname: "/app/waitlist/emails"
          },
          {
            label: "Create template",
            pathname: ""
          }
        ]}
      />
      {/* Content */}
      <PageComponent></PageComponent>
    </>
  );
}
