"use client";

import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CodeTokenLines, ZotDemoProps } from "./ZotDemo.shared";

const BRAND = "#006FEE";
const BRAND_STRONG = "#0A84FF";

function Terminal({
  progress,
  typedCommand,
}: {
  progress: number;
  typedCommand: string;
}) {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
        background: "#0d1117",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 60px -20px rgba(0,111,238,0.35)",
        width: "72%",
        padding: "28px 32px",
        color: "#f0f6fc",
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <div style={{ width: 12, height: 12, background: "#ff5f56" }} />
        <div style={{ width: 12, height: 12, background: "#ffbd2e" }} />
        <div style={{ width: 12, height: 12, background: "#27c93f" }} />
      </div>
      <div style={{ fontSize: 28, lineHeight: 1.5 }}>
        <span style={{ color: BRAND }}>$ </span>
        <span>{typedCommand}</span>
        {progress < 1 && (
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 28,
              background: "#f0f6fc",
              marginLeft: 4,
              verticalAlign: "text-bottom",
              opacity: Math.round(progress * 20) % 2 === 0 ? 1 : 0,
            }}
          />
        )}
      </div>
    </div>
  );
}

function CommandScene() {
  const frame = useCurrentFrame();
  const fullCommand = "npx skills add launch-waitlist-zot/zot-skills";
  const typingDuration = 75;
  const charsToShow = Math.min(
    fullCommand.length,
    Math.floor(
      interpolate(frame, [8, typingDuration], [0, fullCommand.length], {
        extrapolateRight: "clamp",
      })
    )
  );
  const typed = fullCommand.slice(0, charsToShow);
  const progress = charsToShow / fullCommand.length;

  const installStarted = frame > typingDuration + 10;
  const installSteps = [
    "✔ Detected Next.js 16 (app router)",
    "✔ Installed @zot-core/sdk",
    "✔ Wrote app/waitlist.tsx",
    "✔ Added ZOT_API_KEY to .env.local",
    "✔ SKILL.md generated for Claude Code + Cursor",
  ];
  const visibleSteps = installStarted
    ? Math.min(
        installSteps.length,
        Math.floor((frame - typingDuration - 10) / 10)
      )
    : 0;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <Terminal progress={progress} typedCommand={typed} />
      {installStarted && (
        <div
          style={{
            width: "72%",
            fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 22,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {installSteps.slice(0, visibleSteps).map((step) => (
            <div key={step} style={{ color: "#22C55E" }}>
              {step}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
}

function CodeScene({ tokens }: { tokens: CodeTokenLines }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.08)",
          width: "72%",
          padding: "40px 44px",
          color: "#c9d1d9",
          boxShadow: "0 30px 60px -20px rgba(0,111,238,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <div style={{ width: 12, height: 12, background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, background: "#27c93f" }} />
          <div
            style={{
              marginLeft: 16,
              padding: "4px 12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 14,
            }}
          >
            app/waitlist.tsx
          </div>
        </div>
        {tokens.map((line, i) => {
          const delay = i * 4;
          const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const translate = interpolate(
            frame,
            [delay, delay + 8],
            [-12, 0],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );
          const isEmptyLine = line.length === 0 || line.every((tok) => tok.content.trim() === "");
          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${translate}px)`,
                fontSize: 22,
                lineHeight: 1.6,
                minHeight: 32,
                whiteSpace: "pre",
              }}
            >
              {isEmptyLine
                ? "\u00A0"
                : line.map((tok, j) => (
                    <span
                      key={j}
                      style={{
                        color: tok.color ?? "#c9d1d9",
                        fontStyle:
                          tok.fontStyle && tok.fontStyle & 1
                            ? "italic"
                            : undefined,
                        fontWeight:
                          tok.fontStyle && tok.fontStyle & 2
                            ? 600
                            : undefined,
                      }}
                    >
                      {tok.content}
                    </span>
                  ))}
            </div>
          );
        })}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              background: "#22C55E",
              borderRadius: "50%",
              boxShadow: "0 0 8px #22C55E",
              transform: `scale(${spring({
                frame,
                fps,
                config: { damping: 10, mass: 0.3 },
              })})`,
            }}
          />
          Connected to waitlist_production
        </div>
      </div>
    </AbsoluteFill>
  );
}

function SignupScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typingEmail = "founder@acme.dev";
  const emailChars = Math.min(
    typingEmail.length,
    Math.floor(interpolate(frame, [8, 45], [0, typingEmail.length], {
      extrapolateRight: "clamp",
    }))
  );
  const email = typingEmail.slice(0, emailChars);
  const showSuccess = frame > 70;

  const successScale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "56%",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "44px 52px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          boxShadow: "0 40px 80px -20px rgba(0,111,238,0.4)",
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>
          Be the first to try
        </div>
        <div style={{ color: "#fff", fontSize: 36, fontWeight: 600 }}>
          Join the waitlist
        </div>
        {!showSuccess && (
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "14px 18px",
                color: "#fff",
                fontSize: 20,
                fontFamily:
                  "var(--font-geist-mono, ui-monospace, monospace)",
              }}
            >
              {email}
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 20,
                  background: "#fff",
                  marginLeft: 2,
                  verticalAlign: "middle",
                  opacity: Math.floor(frame / 10) % 2 === 0 ? 1 : 0.2,
                }}
              />
            </div>
            <button
              type="button"
              style={{
                background: BRAND,
                color: "#fff",
                border: "1px solid rgba(10,132,255,0.6)",
                padding: "14px 28px",
                fontSize: 18,
                fontWeight: 500,
                boxShadow: "0 0 30px rgba(0,111,238,0.45)",
              }}
            >
              Join
            </button>
          </div>
        )}
        {showSuccess && (
          <div
            style={{
              transform: `scale(${successScale})`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 20px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.4)",
              color: "#fff",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0d0d0d",
                fontWeight: 700,
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 20 }}>You&apos;re on the list</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

function AnalyticsScene() {
  const frame = useCurrentFrame();
  const signups = Math.round(
    interpolate(frame, [0, 60], [0, 18234], { extrapolateRight: "clamp" })
  );
  const conversion = interpolate(frame, [0, 60], [0, 42.8], {
    extrapolateRight: "clamp",
  });
  const referrals = Math.round(
    interpolate(frame, [0, 60], [0, 3120], { extrapolateRight: "clamp" })
  );

  const bars = [3, 5, 4, 7, 6, 9, 8, 11, 10, 13, 15, 14, 17, 19, 22, 24];

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "76%",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "40px 44px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          boxShadow: "0 40px 80px -20px rgba(0,111,238,0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            LIVE ANALYTICS
          </div>
          <div
            style={{
              color: "#22C55E",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22C55E",
                display: "inline-block",
              }}
            />
            Real-time
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { label: "Signups", value: signups.toLocaleString("en-US") },
            { label: "Conversion", value: `${conversion.toFixed(1)}%` },
            { label: "Referrals", value: referrals.toLocaleString("en-US") },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                padding: "18px 22px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 12,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 600,
                  fontFamily:
                    "var(--font-geist-mono, ui-monospace, monospace)",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            height: 140,
          }}
        >
          {bars.map((target, i) => {
            const delay = i * 2;
            const h = interpolate(
              frame,
              [delay, delay + 20],
              [0, target * 5],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: h,
                  background: `linear-gradient(180deg, ${BRAND_STRONG} 0%, ${BRAND} 100%)`,
                  boxShadow: `0 0 12px ${BRAND}55`,
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function ZotDemo({ tokens }: ZotDemoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = Math.sin((frame / fps) * 2) * 0.04 + 1;

  return (
    <AbsoluteFill
      style={{
        background: "#000",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,111,238,0.22) 0%, rgba(0,111,238,0.08) 40%, transparent 80%)",
          transform: `scale(${pulse})`,
        }}
      />
      <Sequence from={0} durationInFrames={130}>
        <CommandScene />
      </Sequence>
      <Sequence from={130} durationInFrames={80}>
        <CodeScene tokens={tokens} />
      </Sequence>
      <Sequence from={210} durationInFrames={70}>
        <SignupScene />
      </Sequence>
      <Sequence from={280} durationInFrames={80}>
        <AnalyticsScene />
      </Sequence>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </AbsoluteFill>
  );
}
