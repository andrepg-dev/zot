import { create } from "zustand";
import { defaultNavItems, NavItemOrDivider, NavItemsI } from "./sidebar.constants";

interface SidebarStateI {
  navItems?: NavItemsI | NavItemOrDivider[] | null;
  children?: React.ReactNode | null;
  hidden?: boolean;
  className?: string | null;
  resizable?: boolean;
  maxWidth?: number | null;
  minWidth?: number | null;
  storageKey?: string | null;
  setNavItems: (navItems: NavItemsI | NavItemOrDivider[] | null) => void;
  setChildren: (children: React.ReactNode | null) => void;
  setHidden: (hidden: boolean) => void;
  setClassName: (className: string | null) => void;
  setResizable: (resizable: boolean) => void;
  setMaxWidth: (maxWidth: number | null) => void;
  setMinWidth: (minWidth: number | null) => void;
  setStorageKey: (storageKey: string | null) => void;
}

const useSidebarStore = create<SidebarStateI>((set) => ({
  navItems: defaultNavItems,
  resizable: true,
  maxWidth: null,
  minWidth: null,
  storageKey: null,
  setNavItems: (navItems) => {
    set({ navItems });
  },
  setChildren: (children) => {
    set({ children });
  },
  setHidden: (hidden) => {
    set({ hidden });
  },
  setClassName(className) {
    set({ className });
  },
  setResizable: (resizable) => {
    set({ resizable });
  },
  setMaxWidth: (maxWidth) => {
    set({ maxWidth });
  },
  setMinWidth: (minWidth) => {
    set({ minWidth });
  },
  setStorageKey: (storageKey) => {
    set({ storageKey });
  }
}));

export default useSidebarStore;
