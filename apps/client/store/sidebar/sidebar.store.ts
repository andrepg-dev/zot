import { create } from "zustand";
import { defaultNavItems, NavItemsI } from "./sidebar.constants";

interface SidebarStateI {
  navItems?: NavItemsI | null;
  children?: React.ReactNode | null;
  hidden?: boolean;
  className?: string | null;
  setNavItems: (navItems: NavItemsI | null) => void;
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
