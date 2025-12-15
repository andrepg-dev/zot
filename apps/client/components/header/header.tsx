"use client";

import useHeaderStore from "@/store/header/header.store";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { children } = useHeaderStore();

  return (
    <header
      id="header"
      className="shrink-0 border-b bg-sidebar p-4 flex items-center justify-between h-14"
    >
      <div className="flex gap-2 items-center">
        <Image
          src={"/icons/waitlean-icon.png"}
          width={25}
          height={25}
          alt={"Waitlean logo"}
        />
        <Link href={"/app/dashboard"}>
          <span className="font-bold">Kue</span>
        </Link>

        {children}
      </div>

      {/* Default header content */}
      <div className="flex items-center gap-4">
        <Button
          variant="light"
          className="text-xs text-muted-foreground"
          size="sm"
        >
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

          <Kbd
            keys={["command"]}
            className="scale-95 bg-transparent text-muted-foreground"
          >
            k
          </Kbd>
        </Button>
      </div>
    </header>
  );
}

function DefaultHeaderContent() {
  return <></>;
}
