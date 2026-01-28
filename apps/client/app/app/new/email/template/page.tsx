"use client";

import MonacoEditorTemplate from "@/components/editor/monaco/monaco-editor/monaco-edito-header-template";
import MonacoEditor from "@/components/editor/monaco/monaco-editor/monaco-editor";
import HeaderTabulation from "@/components/editor/monaco/tabulation/header-tab";
import PrimaryActionButton from "@/components/global/primary-action-button";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import Type from "@/components/type";
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  EnvelopeIcon,
  FolderPlusIcon
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import Link from "next/link";

export default function CreateEmailPage() {
  return (
    <PageComponent className="flex flex-1 h-full p-0">
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
        postNavigationItems={
          <div className="flex items-center gap-8 text-sm">
            <PrimaryActionButton
              startContent={<FolderPlusIcon className="size-4" strokeWidth={2} />}
            >
              Save template
            </PrimaryActionButton>
          </div>
        }
      />

      {/* Editor Section */}
      <div className="flex flex-col flex-1 w-full border-r">
        <MonacoEditorTemplate>
          <div className="flex items-center gap-2">
            <Type variant="sm">React Email</Type>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://react.email/docs/introduction"
              title="React email documentation"
              target="_blank"
              className="hover:underline"
            >
              <Type variant="link">See documentation</Type>
            </Link>

            <Dropdown className="border p-0" disableAnimation>
              <DropdownTrigger>
                <Button size="sm" variant="faded" isIconOnly disableAnimation>
                  <Bars3Icon className="size-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Menu de acciones"
                variant="flat"
                onAction={(key) => {
                  if (key === "download_zip") {
                    // Aquí puedes agregar la lógica para descargar el ZIP
                    console.log("Download Zip");
                  }
                }}
              >
                <DropdownItem
                  key="download_source_code"
                  startContent={<ArrowDownTrayIcon className="size-4" />}
                >
                  Download file
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </MonacoEditorTemplate>

        <div className="flex flex-1 min-h-0">
          <div className="flex flex-col flex-1 min-w-0">
            <HeaderTabulation tabs={[{ title: "EmailComponent.tsx", isActive: true }]} />
            <div className="flex-1 min-h-0">
              <MonacoEditor height="100%" />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="h-full flex-1 w-full relative bg-default-50 border-l/50">
        <MonacoEditorTemplate>
          <Type variant="sm" className="text-center mx-auto">
            Email preview
          </Type>
        </MonacoEditorTemplate>

        <div className="flex flex-col text-muted-foreground absolute w-full h-full justify-center items-center gap-2 bottom-0 -z-0 bg-default-50">
          <EnvelopeIcon className="size-5" />
          <span className="text-xs">Email preview will appear here</span>

          <footer className="absolute bottom-4 mx-auto flex gap-4 text-muted-foreground/40 text-xs">
            Start editing to see the preview
          </footer>
        </div>
      </div>
    </PageComponent>
  );
}
