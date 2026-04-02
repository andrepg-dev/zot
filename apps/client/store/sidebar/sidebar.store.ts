import { create } from "zustand";
import { defaultNavItems, NavItemOrDivider, NavItemsI } from "./sidebar.constants";

interface SidebarStateI {
  navItems?: NavItemsI | NavItemOrDivider[] | null;
  children?: React.ReactNode | null;
  hidden?: boolean;
  className?: string | null;
  setNavItems: (navItems: NavItemsI | NavItemOrDivider[] | null) => void;
  setChildren: (children: React.ReactNode | null) => void;
  setHidden: (hidden: boolean) => void;
  setClassName: (className: string | null) => void;
}

const useSidebarStore = create<SidebarStateI>((set) => ({
  navItems: defaultNavItems,
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
  }
}));

export default useSidebarStore;
