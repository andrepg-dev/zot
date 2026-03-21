"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

function CheckIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const ROW_HEIGHT = 30;
const VISIBLE_ROWS = 8;
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 40;
const PX = 16;

const MAX_DISPLAY_EMAILS = 50;

export function getFramesPerRow(emailCount: number) {
  if (emailCount <= 10) return 3;
  if (emailCount <= 20) return 2;
  return 1;
}

export function getAnimationHeight(emailCount: number) {
  const rows = Math.min(emailCount, VISIBLE_ROWS);
  return HEADER_HEIGHT + rows * ROW_HEIGHT + FOOTER_HEIGHT;
}

export default function CampaignSentAnimation({
  emails: allEmails
}: {
  emails: string[];
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const emails = allEmails.slice(0, MAX_DISPLAY_EMAILS);
  const total = allEmails.length;
  const displayTotal = emails.length;
  const framesPerRow = getFramesPerRow(displayTotal);

  const sentCount = Math.min(
    displayTotal,
    Math.floor(
      interpolate(frame, [10, 10 + displayTotal * framesPerRow], [0, displayTotal], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
      })
    )
  );

  // Map sentCount to actual total for the counter
  const counterValue = displayTotal < total
    ? Math.min(total, Math.round((sentCount / displayTotal) * total))
    : sentCount;

  const scrollOffset = Math.max(0, sentCount - VISIBLE_ROWS + 1) * ROW_HEIGHT;

  const headerOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const allDone = sentCount >= displayTotal;
  const doneDelay = 10 + displayTotal * framesPerRow + 10;
  const doneOpacity = interpolate(frame, [doneDelay, doneDelay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const doneScale = interpolate(
    spring({ frame: Math.max(0, frame - doneDelay), fps, config: { damping: 12, stiffness: 100 } }),
    [0, 1],
    [0.8, 1]
  );

  const listHeight = Math.min(displayTotal, VISIBLE_ROWS) * ROW_HEIGHT;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        fontFamily: "ui-monospace, monospace",
        overflow: "hidden",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `0 ${PX}px`,
          borderBottom: "1px solid #262626",
          height: HEADER_HEIGHT,
          flexShrink: 0
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
          Sending campaign
        </span>
        <span style={{ fontSize: 12, color: "#71717a" }}>
          {counterValue}/{total}
        </span>
      </div>

      {/* Scrolling list */}
      <div
        style={{
          position: "relative",
          height: listHeight,
          overflow: "hidden",
          flexShrink: 0
        }}
      >
        <div
          style={{
            transform: `translateY(-${scrollOffset}px)`,
            transition: "transform 0.15s ease-out"
          }}
        >
          {emails.map((email, i) => {
            const rowFrame = 10 + i * framesPerRow;
            const isChecked = frame >= rowFrame;

            const rowOpacity = interpolate(
              frame,
              [Math.max(0, rowFrame - framesPerRow), rowFrame],
              [0.3, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const checkScale = isChecked
              ? interpolate(
                  spring({
                    frame: Math.max(0, frame - rowFrame),
                    fps,
                    config: { damping: 15, stiffness: 200 }
                  }),
                  [0, 1],
                  [0, 1]
                )
              : 0;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  height: ROW_HEIGHT,
                  padding: `0 ${PX}px`,
                  opacity: rowOpacity
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${checkScale})`
                  }}
                >
                  {isChecked ? (
                    <CheckIcon size={16} />
                  ) : (
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "1px solid #333"
                      }}
                    />
                  )}
                </div>

                <span
                  style={{
                    fontSize: 12,
                    color: isChecked ? "#e5e5e5" : "#525252",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {email}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          height: FOOTER_HEIGHT,
          flexShrink: 0,
          borderTop: "1px solid #262626",
          opacity: allDone ? doneOpacity : 0,
          transform: allDone ? `scale(${doneScale})` : "scale(0.8)"
        }}
      >
        <CheckIcon size={14} />
        <span style={{ fontSize: 12, fontWeight: 500, color: "#22c55e" }}>
          All {total} emails dispatched
        </span>
      </div>
    </AbsoluteFill>
  );
}
