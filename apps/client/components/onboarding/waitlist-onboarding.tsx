"use client";

import { getPublicEmailTemplates } from "@/actions/email-templates/email-templates.actions";
import InputComponent from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  EnvelopeIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const inputWrapperClass =
  "rounded-none data-[focus=true]:bg-default-100/50 data-[hover=true]:!bg-default-100/50 bg-default-100/50 border backdrop-blur-[25px]";

export const PENDING_WAITLIST_KEY = "zot:pending-waitlist";
export const ONBOARDING_SEEN_KEY = "zot:onboarding-seen";

export interface PendingWaitlist {
  name: string;
  sendEmailToNewSignup: boolean;
}

export function getPendingWaitlist(): PendingWaitlist | null {
  try {
    const raw = sessionStorage.getItem(PENDING_WAITLIST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingWaitlist;
  } catch {
    return null;
  }
}

interface WaitlistOnboardingProps {
  onContinue: (name: string) => void;
  onSkip: () => void;
}

type TemplateOption = "welcome" | "none";

interface PublicTemplate {
  _id: string;
  alias: string;
  preview: string;
  subject: string;
}

const STEPS = [
  {
    step: 1,
    heading: "Let's make this real.",
    sub: "Name your waitlist and go live before your next coffee break."
  },
  {
    step: 2,
    heading: "Choose a welcome email.",
    sub: "Signups get this automatically. You can edit it anytime."
  },
  {
    step: 3,
    heading: "You're almost live.",
    sub: "Here's what we're setting up for you."
  }
];

export default function WaitlistOnboarding({ onContinue, onSkip }: WaitlistOnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>("welcome");
  const [error, setError] = useState<string | null>(null);
  const [publicTemplate, setPublicTemplate] = useState<PublicTemplate | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  useEffect(() => {
    if (step !== 2) return;

    setLoadingTemplate(true);
    getPublicEmailTemplates()
      .then((templates) => setPublicTemplate(templates[0] ?? null))
      .catch(() => {})
      .finally(() => setLoadingTemplate(false));
  }, [step]);

  const current = STEPS[step - 1];

  const handleStep1Continue = () => {
    if (!name.trim()) {
      setError("Give your waitlist a name to continue.");
      return;
    }
    setStep(2);
  };

  const handleLaunch = () => {
    const config: PendingWaitlist = {
      name: name.trim(),
      sendEmailToNewSignup: selectedTemplate === "welcome"
    };

    sessionStorage.setItem(PENDING_WAITLIST_KEY, JSON.stringify(config));
    sessionStorage.setItem(ONBOARDING_SEEN_KEY, "1");
    onContinue(name.trim());
  };

  const handleSkip = () => {
    sessionStorage.setItem(ONBOARDING_SEEN_KEY, "1");
    onSkip();
  };

  return (
    <div className="w-full max-w-[420px] flex flex-col items-center gap-5">
      <Link href="/" className="lg:hidden flex items-center justify-center">
        <div className="w-10 h-10 rounded-none flex items-center justify-center border overflow-hidden bg-black">
          <Image
            width={300}
            height={300}
            src="/favicon_io/android-chrome-512x512.png"
            alt={siteConfig.name}
            className="w-10 h-10 rounded-none object-cover"
            priority
          />
        </div>
      </Link>

      <div className="w-full flex gap-1">
        {STEPS.map(({ step: s }) => (
          <div
            key={s}
            className={cn(
              "h-0.5 flex-1 transition-colors duration-300",
              step >= s ? "bg-foreground" : "bg-border"
            )}
          />
        ))}
      </div>

      <div className="w-full">
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Step {step} of {STEPS.length}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">{current.heading}</h2>
        <p className="text-sm text-muted-foreground mt-1">{current.sub}</p>
      </div>

      {step === 1 && (
        <div className="w-full flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="waitlist-name" className="text-sm text-muted-foreground block">
              Waitlist name
            </label>
            <InputComponent
              id="waitlist-name"
              type="text"
              placeholder="Early access, Product launch, Beta v2..."
              radius="none"
              maxLength={30}
              classNames={{ inputWrapper: inputWrapperClass }}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStep1Continue();
              }}
              autoFocus
            />
            {error && <p className="text-xs text-danger">{error}</p>}
          </div>

          <Button
            radius="none"
            className="w-full h-10 !text-sm bg-default-50 border text-muted-foreground hover:bg-default-300 backdrop-blur-[25px]"
            onPress={handleStep1Continue}
            disableRipple
            endContent={<ArrowRightIcon className="size-3.5" />}
          >
            Continue
          </Button>

          <div className="w-full flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            variant="light"
            radius="none"
            size="sm"
            className="text-xs text-muted-foreground"
            onPress={handleSkip}
            disableRipple
          >
            Skip, I&apos;ll do this later
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setSelectedTemplate("welcome")}
            className={cn(
              "w-full border p-3 text-left transition-colors",
              selectedTemplate === "welcome"
                ? "border-foreground bg-default-100/40"
                : "border-border bg-default-100/20 hover:bg-default-100/30"
            )}
          >
            <div className="w-full h-44 overflow-hidden bg-zinc-50 border border-zinc-200">
              {loadingTemplate ? (
                <Skeleton className="w-full h-full rounded-none" />
              ) : publicTemplate?.preview ? (
                <img
                  src={publicTemplate.preview}
                  alt={publicTemplate.alias}
                  className="w-full object-top object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <EnvelopeIcon className="size-8 text-zinc-300" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2.5">
              <div>
                <p className="text-sm font-medium text-foreground">Welcome email</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sent to every new signup automatically
                </p>
              </div>
              {selectedTemplate === "welcome" && (
                <CheckCircleIcon className="size-4 text-success shrink-0" />
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTemplate("none")}
            className={cn(
              "w-full border px-3 py-3 text-left transition-colors flex items-center justify-between",
              selectedTemplate === "none"
                ? "border-foreground bg-default-100/40"
                : "border-border bg-default-100/20 hover:bg-default-100/30"
            )}
          >
            <div>
              <p className="text-sm font-medium text-foreground">No email</p>
              <p className="text-xs text-muted-foreground mt-0.5">Set this up later in settings</p>
            </div>
            {selectedTemplate === "none" && (
              <CheckCircleIcon className="size-4 text-success shrink-0" />
            )}
          </button>

          <div className="flex gap-2 mt-1">
            <Button
              variant="bordered"
              radius="none"
              size="sm"
              className="text-xs text-muted-foreground border"
              onPress={() => setStep(1)}
              disableRipple
              startContent={<ChevronLeftIcon className="size-3.5" />}
            >
              Back
            </Button>
            <Button
              radius="none"
              className="flex-1 h-9 !text-sm bg-default-50 border text-muted-foreground hover:bg-default-300 backdrop-blur-[25px]"
              onPress={() => setStep(3)}
              disableRipple
              endContent={<ArrowRightIcon className="size-3.5" />}
            >
              Continue
            </Button>
          </div>

          <Button
            variant="light"
            radius="none"
            size="sm"
            className="text-xs text-muted-foreground"
            onPress={handleSkip}
            disableRipple
          >
            Skip, I&apos;ll do this later
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3 border bg-default-100/20 backdrop-blur-[25px] px-3 py-3">
              <RocketLaunchIcon className="size-3.5 text-success shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-foreground font-medium">
                  &ldquo;{name}&rdquo; waitlist
                </span>
                <span className="text-xs text-muted-foreground">
                  Ready to collect signups immediately
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 border bg-default-100/20 backdrop-blur-[25px] px-3 py-3">
              <EnvelopeIcon className="size-3.5 text-success shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-foreground font-medium">
                  Welcome email{" "}
                  <span
                    className={cn(
                      "font-normal",
                      selectedTemplate === "welcome" ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    {selectedTemplate === "welcome" ? "· on" : "· off"}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedTemplate === "welcome"
                    ? "New signups get a welcome email automatically"
                    : "You can enable this later in settings"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 border bg-default-100/20 backdrop-blur-[25px] px-3 py-3">
              <ShieldCheckIcon className="size-3.5 text-success shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-foreground font-medium">Fake email protection</span>
                <span className="text-xs text-muted-foreground">
                  Disposable and temporary emails are always blocked
                </span>
              </div>
            </div>
          </div>

          <Button
            radius="none"
            className="w-full h-10 !text-sm bg-default-50 border text-muted-foreground hover:bg-default-300 backdrop-blur-[25px]"
            onPress={handleLaunch}
            disableRipple
            endContent={<ArrowRightIcon className="size-3.5" />}
          >
            Sign in to launch
          </Button>

          <Button
            variant="bordered"
            radius="none"
            size="sm"
            className="text-xs text-muted-foreground border"
            onPress={() => setStep(2)}
            disableRipple
            startContent={<ChevronLeftIcon className="size-3.5" />}
          >
            Back
          </Button>

          <Button
            variant="light"
            radius="none"
            size="sm"
            className="text-xs text-muted-foreground"
            onPress={handleSkip}
            disableRipple
          >
            Skip, I&apos;ll do this later
          </Button>
        </div>
      )}
    </div>
  );
}
