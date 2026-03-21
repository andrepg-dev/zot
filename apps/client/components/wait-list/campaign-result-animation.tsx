"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

function CheckCircleIcon() {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth={1.5}>
      <path
        d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CampaignResultAnimation({
  status,
  message
}: {
  status: "success" | "error" | "pending";
  message: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = interpolate(
    spring({ frame, fps, config: { damping: 12, stiffness: 100 } }),
    [0, 1],
    [0, 1]
  );

  const textOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const textY = interpolate(
    spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 12 } }),
    [0, 1],
    [15, 0]
  );

  // Pending spinner rotation
  const rotation = frame * 12;

  const color =
    status === "success" ? "#22c55e" : status === "error" ? "#ef4444" : "#71717a";

  const title =
    status === "success"
      ? "Campaign sent"
      : status === "error"
        ? "Campaign failed"
        : "Sending...";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        fontFamily: "ui-monospace, monospace",
        justifyContent: "center",
        alignItems: "center",
        gap: 12
      }}
    >
      <div
        style={{
          transform:
            status === "pending"
              ? `scale(${iconScale}) rotate(${rotation}deg)`
              : `scale(${iconScale})`
        }}
      >
        {status === "success" ? (
          <CheckCircleIcon />
        ) : status === "error" ? (
          <XCircleIcon />
        ) : (
          <SpinnerIcon />
        )}
      </div>

      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: 14,
          fontWeight: 500,
          color
        }}
      >
        {title}
      </div>

      {status !== "pending" && message && (
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            fontSize: 12,
            color: "#71717a",
            maxWidth: 300,
            textAlign: "center"
          }}
        >
          {message}
        </div>
      )}
    </AbsoluteFill>
  );
}
