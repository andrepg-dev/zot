import { Button, pixelBasedPreset, Tailwind } from "@react-email/components";
import * as React from "react";

export default function Email() {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      <Button className="bg-blue-500 text-white text-sm cursor-pointer px-3 py-2 font-sans rounded-sm">
        Click me
      </Button>
    </Tailwind>
  );
}