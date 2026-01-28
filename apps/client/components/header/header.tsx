"use client";

import { cn } from "@/lib/utils";
import useHeaderStore from "@/store/header/header.store";
import { MagnifyingGlassIcon, SlashIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import Link from "next/link";

export default function Header() {
  const { children, navigationItems, postNavigationItems, hidden } = useHeaderStore();

  return (
    <header
      className={cn("overflow-hidden transition-all duration-700", hidden ? "h-2" : "h-14")}
      id="header"
    >
      <div className="shrink-0 bg-sidebar p-4 flex items-center justify-between overflow-hidden h-14">
        <div className="flex gap-2 items-center">
          {/* <Image src={"/only-icon.svg"} width={30} height={30} alt={"zot logo"} className=" top- opacity-30" /> */}
          <Link href={"/app/dashboard"}>
            <span className="font-bold text-2xl">zot</span>
          </Link>

          {navigationItems &&
            navigationItems?.map((value, idx) => (
              <div
                key={idx}
                className="flex items-center text-sm font-semibold gap-2 mt-1 text-muted-foreground hover:text-foreground"
              >
                <span className="text-muted-foreground">
                  <SlashIcon className="size-4 text-default-100" />
                </span>

                <Link
                  href={value.pathname}
                  className="hover:underline-2 hover:underline decoration-2 rounded-md !text-[13px]"
                >
                  {value.label}
                </Link>
              </div>
            ))}

          <div>{children}</div>
        </div>

        {/* Default header content */}

        {postNavigationItems ? (
          postNavigationItems
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="light" className="text-xs text-muted-foreground" size="sm">
              Feedback
            </Button>

            <Button
              startContent={<MagnifyingGlassIcon className={"size-4"} />}
              radius="full"
              variant="bordered"
              className="text-muted-foreground text-xs flex hover:border-muted"
              size="sm"
            >
              <span>Search...</span>

              <Kbd keys={["command"]} className="scale-95 bg-transparent text-muted-foreground">
                k
              </Kbd>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
