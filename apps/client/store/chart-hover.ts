import { create } from "zustand";

interface ChartHoverState {
  hoveredChartId: string | null;
  activeLabel: string | null;
  setHover: (chartId: string, label: string | null) => void;
  clearHover: () => void;
}

export const useChartHoverStore = create<ChartHoverState>((set) => ({
  hoveredChartId: null,
  activeLabel: null,
  setHover: (chartId, label) => set({ hoveredChartId: chartId, activeLabel: label }),
  clearHover: () => set({ hoveredChartId: null, activeLabel: null })
}));
