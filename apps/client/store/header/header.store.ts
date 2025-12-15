import type { ReactNode } from "react";
import { create } from "zustand";

interface HeaderState {
  children?: ReactNode | null;
  navigationItems?: Array<{ pathname: string; label: string }> | null;
  setChildren: (children: ReactNode | null) => void;
  setNavigationItems: (
    navigationItems: Array<{ pathname: string; label: string }> | null,
  ) => void;
}

const useHeaderStore = create<HeaderState>((set) => ({
  children: null,
  setChildren: (children) => set({ children }),
  setNavigationItems: (items) => set({ navigationItems: items }),
}));

export default useHeaderStore;
