import { ReactNode } from "react";
import { create } from "zustand";

interface HeaderState {
  children?: ReactNode | null;
  navigationItems?: Array<{ pathname: string; label: string }> | null;
  postNavigationItems?: ReactNode | null;
  hidden?: boolean;
  setChildren: (children: ReactNode | null) => void;
  setNavigationItems: (
    navigationItems: Array<{ pathname: string; label: string }> | null
  ) => void;
  setPostNavigationItems: (children: ReactNode | null) => void;
  setHidden: (hidden: boolean) => void;
}

const useHeaderStore = create<HeaderState>((set) => ({
  setChildren: (children) => set({ children }),
  setNavigationItems: (items) => set({ navigationItems: items }),
  setPostNavigationItems: (children) => set({ postNavigationItems: children }),
  setHidden: (hidden) => set({ hidden }),
}));

export default useHeaderStore;
