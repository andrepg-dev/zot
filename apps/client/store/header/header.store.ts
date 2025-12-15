import type { ReactNode } from "react";
import { create } from "zustand";

interface HeaderState {
  children?: ReactNode | null;
  setChildren: (children: ReactNode | null) => void;
}

const useHeaderStore = create<HeaderState>((set) => ({
  children: null,
  setChildren: (children) => set({ children }),
}));

export default useHeaderStore;
