import { create } from "zustand";

interface ReactCodeEditor {
  lastCodeMessageHtmlCode: { html: string } | undefined | null;
  setLastCodeMessageHtmlCode: (lastCodeMessageHtmlCode: { html: string }) => void;
}

const useReactCodeEditorStore = create<ReactCodeEditor>((set) => ({
  lastCodeMessageHtmlCode: undefined,
  setLastCodeMessageHtmlCode: (data) => {
    set({ lastCodeMessageHtmlCode: data });
  }
}));

export default useReactCodeEditorStore;
