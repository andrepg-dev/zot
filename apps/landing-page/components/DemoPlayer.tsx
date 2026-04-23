"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { VIDEO_CONFIG, ZotDemo } from "@/remotion/ZotDemo";

export default function DemoPlayer() {
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

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden border border-white/10 bg-black shadow-[0_40px_80px_-30px_rgba(0,111,238,0.45)]"
    >
      <Player
        ref={ref}
        component={ZotDemo}
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
