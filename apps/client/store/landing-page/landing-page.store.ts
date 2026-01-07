import { create } from "zustand";

type EditionType = null | "ai" | "manually";
type VisualizationType = null | "web" | "code";

interface LandingPageStateI {
  editionType: EditionType;
  setEditionType: (editionType: EditionType) => void;
  visualizationType: VisualizationType;
  setVisualizationType: (visualizationType: VisualizationType) => void;
}

export const useLandingPageState = create<LandingPageStateI>()((set) => ({
  editionType: "ai",
  visualizationType: "code",
  setEditionType: (editionType) => {
    set({ editionType });
  },
  setVisualizationType: (visualizationType) => {
    set({ visualizationType });
  }
}));
