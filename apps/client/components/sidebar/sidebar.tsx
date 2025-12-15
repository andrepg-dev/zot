"use client";

import { cn } from "@/lib/utils";
import {
  BookOpenIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  GlobeAltIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";

import useSidebarStore from "@/store/sidebar/sidebar.store";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import ItemList from "./items-list";

export default function Sidebar() {
  const { navItems, children } = useSidebarStore();

  return (
    <aside className="min-w-[220px] border-r bg-sidebar backdrop-blur-md flex flex-col">
      <div className="flex flex-col justify-between flex-1">
        {!navItems && children && <>{children}</>}

        {navItems && !children && <ItemList navItems={navItems} />}

        {!navItems && !children && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No navigation items
          </div>
        )}

        <div className="w-full">
          <hr />

          <div className="my-4">
            <Link
              href={"/docs"}
              target="_blank"
              className={clsx(
                "flex items-center gap-2 py-1.5 px-5 h-[45px] text-muted-foreground hover:bg-default/60 text-sm"
              )}
            >
              <BookOpenIcon className={cn("size-5")} /> Docs
            </Link>

            <Dropdown
              showArrow
              classNames={{
                base: "before:bg-default-200", // change arrow background
                content:
                  "py-1 px-1 border border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
              }}
              radius="sm"
            >
              <DropdownTrigger>
                <div className="flex items-center justify-between px-4 h-[45px] hover:bg-default/60">
                  <div className="flex w-full items-center gap-2 cursor-pointer ">
                    <div className="size-6 flex items-center justify-center bg-default rounded-full text-[9px] font-light text-muted-foreground">
                      AP
                    </div>
                    <div className="flex flex-col text-[12px] leading-3.5 font-light">
                      <p>Andre Ponce</p>
                      <p className="text-muted-foreground">Free</p>
                    </div>
                  </div>

                  <Button
                    as={Link}
                    href="/pricing"
                    size="sm"
                    variant="faded"
                    radius="full"
                    className="px-5 text-muted-foreground h-[29px] py-2 text-[12px] scale-95"
                  >
                    Upgrade
                  </Button>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dropdown menu with description">
                <DropdownSection title="User configuration" showDivider>
                  <DropdownItem
                    className="!transition-none"
                    key="theme"
                    isReadOnly
                    shortcut={"T"}
                    startContent={<SunIcon className="size-4" />}
                  >
                    Theme
                  </DropdownItem>

                  <DropdownItem
                    className="!transition-none"
                    key="language"
                    startContent={<GlobeAltIcon className="size-4" />}
                  >
                    Language
                  </DropdownItem>

                  <DropdownItem
                    className="!transition-none"
                    key="billing"
                    startContent={<CreditCardIcon className="size-4" />}
                  >
                    Billing
                  </DropdownItem>

                  <DropdownItem
                    className="!transition-none"
                    key="settings"
                    startContent={<Cog6ToothIcon className="size-4" />}
                  >
                    Settings
                  </DropdownItem>
                </DropdownSection>

                <DropdownSection>
                  <DropdownItem
                    key="help_and_feedback"
                    className="!transition-none"
                  >
                    Help & Feedback
                  </DropdownItem>

                  <DropdownItem className="!transition-none" key="logout">
                    Logout
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </aside>
  );
}
