"use client";

import { ZotDemo } from "@/remotion/ZotDemo";
import {
  VIDEO_CONFIG,
  type CodeTokenLines,
} from "@/remotion/ZotDemo.shared";
import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useMemo, useRef, useState } from "react";

interface DemoPlayerProps {
  tokens: CodeTokenLines;
}

export default function DemoPlayer({ tokens }: DemoPlayerProps) {
  const ref = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAutoplayed, setHasAutoplayed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAutoplayed) {
            ref.current?.play();
            setHasAutoplayed(true);
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAutoplayed]);

  const inputProps = useMemo(() => ({ tokens }), [tokens]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden border border-white/10 bg-black shadow-[0_0px_120px_-50px_rgba(0,111,238,0.45)]"
    >
      <Player
        ref={ref}
        component={ZotDemo}
        inputProps={inputProps}
        compositionWidth={VIDEO_CONFIG.width}
        compositionHeight={VIDEO_CONFIG.height}
        fps={VIDEO_CONFIG.fps}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        loop
        clickToPlay={false}
        doubleClickToFullscreen={false}
        allowFullscreen={false}
        spaceKeyToPlayOrPause={false}
        acknowledgeRemotionLicense
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: `${VIDEO_CONFIG.width} / ${VIDEO_CONFIG.height}`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
