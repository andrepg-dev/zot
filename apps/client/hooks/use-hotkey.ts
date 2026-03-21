import { useEffect } from "react";

type ModifierKey = "meta" | "ctrl" | "shift" | "alt";

interface HotkeyOptions {
  key: string;
  modifiers?: ModifierKey[];
  onPress: () => void;
  enabled?: boolean;
  debug?: boolean;
}

const modifierChecks: Record<ModifierKey, (e: KeyboardEvent) => boolean> = {
  meta: (e) => e.metaKey,
  ctrl: (e) => e.ctrlKey,
  shift: (e) => e.shiftKey,
  alt: (e) => e.altKey
};

export function useHotkey({
  key,
  modifiers = [],
  onPress,
  enabled = true,
  debug = false
}: HotkeyOptions) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      const keyMatch = e.key.toLowerCase() === key.toLowerCase();

      if (debug) {
        console.log({ key: e.key.toLowerCase() });
      }

      const modifiersMatch = modifiers.every((mod) => modifierChecks[mod](e));

      if (keyMatch && modifiersMatch) {
        e.stopPropagation();
        e.preventDefault();
        onPress();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);

    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [key, modifiers, onPress, enabled]);
}
