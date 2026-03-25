"use client";

import { cn } from "@/lib/utils";
import {
  GlobeAltIcon,
  SunIcon
} from "@heroicons/react/24/outline";

import { getProfile } from "@/actions/auth/profile";
import useSidebarStore from "@/store/sidebar/sidebar.store";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Skeleton
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import ItemList from "./items-list";

export default function Sidebar() {
  const { navItems, children, hidden, className } = useSidebarStore();

  const { data, isPending } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  })

  return (
    <aside
      className={cn(
        "overflow-hidden bg-sidebar backdrop-blur-md flex flex-col transition-all duration-250",
        hidden ? "w-[8px]" : "w-[280px]",
        className
      )}
    >
      <div className="flex flex-col justify-between flex-1 min-w-[230px]">
        {!navItems && children && <>{children}</>}

        {navItems && !children && <ItemList navItems={navItems} />}

        {!navItems && !children && (
          <div className="p-4 text-center text-sm text-muted-foreground">No navigation items</div>
        )}

        {!children && (
          <div className="w-full">
            <hr />

            <div className="my-4">
              {/* <Link
                href={"/docs"}
                target="_blank"
                className={clsx(
                  "flex items-center gap-2 py-1.5 px-5 h-[45px] text-muted-foreground hover:bg-default/60 text-sm"
                )}
              >
                <BookOpenIcon className={cn("size-5")} /> Documentation
              </Link> */}

              <Dropdown
                showArrow
                classNames={{
                  base: "before:bg-default-200", // change arrow background
                  content:
                    "py-1 px-1 border bg-default-50"
                }}
                radius="sm"
                disableAnimation
              >
                <DropdownTrigger>
                  <div className="flex items-center justify-between px-4 h-[45px] hover:bg-default/60">
                    {isPending ? (
                      <div className="flex w-full items-center gap-2">
                        <Skeleton className="size-6 rounded-full" />
                        <div className="flex flex-col gap-1">
                          <Skeleton className="h-3 w-24 rounded-md" />
                          <Skeleton className="h-2.5 w-14 rounded-md" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex w-full items-center gap-2 cursor-pointer">
                        <div className="border size-6 flex items-center justify-center bg-default-100 rounded-full text-[9px] font-light text-muted-foreground">
                          {data?.name?.slice(0, 1)}{data?.lastName?.slice(0, 1)}
                        </div>
                        <div className="flex flex-col text-[12px] leading-3.5 font-light">
                          <p>{data?.name} {data?.lastName}</p>
                          <p className="text-muted-foreground">{data?.suscriptionPlan}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dropdown menu with description">
                  <DropdownSection title={data?.email} showDivider>
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
                  </DropdownSection>

                  <DropdownSection>
                    <DropdownItem className="!transition-none" key="logout">
                      Logout
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
