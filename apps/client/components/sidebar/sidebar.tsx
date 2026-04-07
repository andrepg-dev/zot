"use client";

import { cn } from "@/lib/utils";
import { Cog6ToothIcon, GlobeAltIcon, SunIcon } from "@heroicons/react/24/outline";

import { logout } from "@/actions/auth/logout";
import { getProfile } from "@/actions/auth/profile";
import useSidebarStore from "@/store/sidebar/sidebar.store";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure
} from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GlobalButton from "../global/button";
import ItemList from "./items-list";

const DEFAULT_MIN_WIDTH = 220;
const DEFAULT_MAX_WIDTH = 480;
const DEFAULT_WIDTH = 232;
const DEFAULT_STORAGE_KEY = "sidebar-width";

export default function Sidebar() {
  const {
    navItems,
    children,
    hidden,
    className,
    resizable = true,
    maxWidth: storeMaxWidth,
    minWidth: storeMinWidth,
    storageKey: storeStorageKey
  } = useSidebarStore();
  const router = useRouter();
  const maxWidth = storeMaxWidth ?? DEFAULT_MAX_WIDTH;
  const minWidth = storeMinWidth ?? DEFAULT_MIN_WIDTH;
  const storageKey = storeStorageKey ?? DEFAULT_STORAGE_KEY;

  const { data, isPending } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  const [width, setWidth] = useState<number>(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [handleRect, setHandleRect] = useState<{
    left: number;
    top: number;
    height: number;
  } | null>(null);
  const asideRef = useRef<HTMLElement>(null);
  const handleElRef = useRef<HTMLDivElement>(null);
  const lastClickTimeRef = useRef<number>(0);
  const widthRef = useRef<number>(DEFAULT_WIDTH);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(DEFAULT_WIDTH);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const n = stored ? Number(stored) : NaN;
    const next = !Number.isNaN(n) ? Math.min(maxWidth, Math.max(minWidth, n)) : DEFAULT_WIDTH;
    widthRef.current = next;
    setWidth(next);
  }, [storageKey, maxWidth, minWidth]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastClickTimeRef.current < 300) {
        lastClickTimeRef.current = 0;
        const next = Math.min(maxWidth, Math.max(minWidth, DEFAULT_WIDTH));
        widthRef.current = next;
        setWidth(next);
        localStorage.setItem(storageKey, String(next));
        if (asideRef.current) asideRef.current.style.width = `${next}px`;
        if (handleElRef.current) {
          const r = asideRef.current?.getBoundingClientRect();
          if (r) handleElRef.current.style.left = `${r.right - 6}px`;
        }
        return;
      }
      lastClickTimeRef.current = now;
      startXRef.current = e.clientX;
      startWidthRef.current = widthRef.current;
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [maxWidth, minWidth, storageKey]
  );

  useEffect(() => {
    if (!isResizing) return;

    let rafId = 0;
    let pendingX = 0;

    const apply = () => {
      rafId = 0;
      const delta = pendingX - startXRef.current;
      const next = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + delta));
      widthRef.current = next;
      if (asideRef.current) asideRef.current.style.width = `${next}px`;
      if (handleElRef.current) {
        const r = asideRef.current?.getBoundingClientRect();
        if (r) handleElRef.current.style.left = `${r.right - 6}px`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const handleMouseUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      localStorage.setItem(storageKey, String(widthRef.current));
      setWidth(widthRef.current);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, storageKey, maxWidth, minWidth]);

  useEffect(() => {
    if (hidden || !resizable) {
      setHandleRect(null);
      return;
    }
    const update = () => {
      const el = asideRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setHandleRect({ left: r.right - 6, top: r.top, height: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    if (asideRef.current) ro.observe(asideRef.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [hidden, resizable, width]);

  const logoutModal = useDisclosure();

  const { mutate: handleLogout, isPending: isLoadingLogout } = useMutation({
    mutationFn: logout
  });

  return (
    <aside
      ref={asideRef}
      style={{ width: hidden ? 8 : width }}
      className={cn(
        "relative overflow-hidden bg-sidebar backdrop-blur-md flex flex-col shrink-0 min-w-0 scrollbar-hide",
        !isResizing && "transition-[width] duration-250",
        className
      )}
    >
      <div
        style={{ minWidth: hidden ? undefined : minWidth }}
        className="flex flex-col justify-between flex-1"
      >
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
                  content: "py-1 px-1 border bg-default-50"
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
                          {data?.name?.slice(0, 1)}
                          {data?.lastName?.slice(0, 1)}
                        </div>
                        <div className="flex flex-col text-[12px] leading-3.5 font-light">
                          <p>
                            {data?.name} {data?.lastName}
                          </p>
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
                      startContent={<SunIcon className="size-4" />}
                      classNames={{ base: "opacity-50" }}
                    >
                      Theme
                    </DropdownItem>

                    <DropdownItem
                      className="!transition-none"
                      key="language"
                      startContent={<GlobeAltIcon className="size-4" />}
                      classNames={{ base: "opacity-50" }}
                      isReadOnly
                    >
                      Language
                    </DropdownItem>

                    <DropdownItem
                      className="!transition-none"
                      key="settings"
                      startContent={<Cog6ToothIcon className="size-4" />}
                      onPress={() => {
                        router.push("/app/settings");
                      }}
                    >
                      Settings
                    </DropdownItem>
                  </DropdownSection>

                  <DropdownSection>
                    <DropdownItem
                      className="!transition-none"
                      key="logout"
                      onPress={logoutModal.onOpen}
                    >
                      Logout
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={logoutModal.isOpen} onOpenChange={logoutModal.onOpenChange} radius="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Logout</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to log out of your account?
                </p>
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={onClose}>
                  Cancel
                </GlobalButton>
                <GlobalButton
                  color="danger"
                  isLoading={isLoadingLogout}
                  onPress={() =>
                    handleLogout(undefined, {
                      onSettled: () => onClose()
                    })
                  }
                >
                  Logout
                </GlobalButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {!hidden &&
        resizable &&
        handleRect &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={handleElRef}
            onMouseDown={handleMouseDown}
            role="separator"
            aria-orientation="vertical"
            style={{
              position: "fixed",
              left: handleRect.left,
              top: handleRect.top,
              height: handleRect.height,
              width: 6,
              zIndex: 2147483646
            }}
            className="cursor-col-resize relative flex items-center justify-center group"
          >
            <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 bg-default-50 left-2 relative rounded-full border border-black h-16 w-12"></div>
          </div>,
          document.body
        )}
      {isResizing &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 cursor-col-resize"
            style={{ zIndex: 2147483647, background: "transparent" }}
          />,
          document.body
        )}
    </aside>
  );
}
