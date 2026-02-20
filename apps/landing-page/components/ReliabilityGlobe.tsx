"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function ReliabilityGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 2.22;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1200,
      height: 800,
      phi: 2.22,
      theta: -0.3,
      dark: 1.00,
      diffuse: 0.00,
      mapSamples: 20000,
      mapBrightness: 9.7,
      baseColor: [0.114, 0.110, 0.110], // #1d1c1c
      markerColor: [0, 0, 0], // #000000
      glowColor: [0.25, 0.25, 0.25], // Más brillante que #2e2e2e
      markers: [],
      scale: 1.7,
      onRender: (state) => {
        state.phi = phi;
        phi += 0.001;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          opacity: 1,
          transform: "translateY(26%) translateX(0%)",
        }}
      />
    </div>
  );
}
