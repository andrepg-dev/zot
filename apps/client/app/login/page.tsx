"use client";

import { login } from "@/actions/auth/login";
import { signInWithGitHub, signInWithGoogle } from "@/actions/auth/oauth";
import InputComponent from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  BoltIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@repo/packages/shared/schemas/index";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const inputWrapperClass =
  "rounded-none data-[focus=true]:bg-default-100/50 data-[hover=true]:!bg-default-100/50 bg-default-100/50 border backdrop-blur-[25px]";

const oauthButtonClass = cn(
  "w-full h-10 font-medium rounded-none",
  "bg-default-100/50 border border-border backdrop-blur-[25px]",
  "text-foreground justify-center gap-2 px-3"
);

const trustBullets = [
  { icon: BoltIcon, label: "Live in under 2 minutes" },
  { icon: ShieldCheckIcon, label: "Disposable emails blocked" },
  { icon: SparklesIcon, label: "Realtime analytics included" }
];

const LAST_USED_LOGIN_METHOD_KEY = "zot:last-used-login-method";

function LastUsedBadge() {
  return (
    <span
      className={cn(
        "absolute -top-2 left-1/2 -translate-x-1/2 z-20",
        "inline-flex items-center gap-1 px-1.5 py-0.5",
        "bg-foreground text-background border",
        "text-[9px] font-medium uppercase tracking-wide leading-none whitespace-nowrap",
        "rounded-none shadow-sm pointer-events-none"
      )}
    >
      <span className="size-1 rounded-none bg-success" />
      Last used
    </span>
  );
}

function resolveReturnTo(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = resolveReturnTo(searchParams.get("returnTo"));
  const [showPassword, setShowPassword] = useState(false);
  const [lastUsedMethod, setLastUsedMethod] = useState<string | null>(null);

  useEffect(() => {
    const storedMethod = localStorage.getItem(LAST_USED_LOGIN_METHOD_KEY);
    if (storedMethod) setLastUsedMethod(storedMethod);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const result = await login(data);
      return { result, email: data.email };
    },
    onSuccess: ({ email }) => {
      posthog.identify(email, { email });
      posthog.capture("user_logged_in", { email, method: "email" });

      addToast({
        title: "Success",
        description: "You will be redirected."
      });

      router.replace(returnTo ?? "/app/dashboard");
    },
    onError: (err: Error) => {
      addToast({
        title: "Error",
        description: err.message,
        color: "danger"
      });
    }
  });

  const saveLastUsedMethod = (method: "Google" | "GitHub" | "Email") => {
    localStorage.setItem(LAST_USED_LOGIN_METHOD_KEY, method);
    setLastUsedMethod(method);
  };

  const onSubmit = (data: LoginFormValues) => {
    saveLastUsedMethod("Email");
    mutate(data);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_minmax(0,1fr)] relative bg-background">
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90",
          "bg-[url('/zot-background-blue.avif')]"
        )}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-gren-500/5 via-green/100 to-background"
        aria-hidden
      />

      <Button
        as={Link}
        href="https://zot.so"
        className="absolute top-5 left-5 lg:hidden !p-0 !hover:bg-transparent text-muted-foreground z-30"
        variant="light"
        startContent={<ChevronLeftIcon className="size-4" />}
      >
        Home
      </Button>

      <aside className="hidden lg:flex relative z-10 flex-col justify-between p-10 xl:p-14 border-r overflow-hidden">
        <Link
          href="https://zot.so"
          className="flex items-center gap-2.5 w-max text-foreground"
        >
          <div className="w-9 h-9 rounded-none flex items-center justify-center border overflow-hidden bg-black">
            <Image
              width={300}
              height={300}
              src="/favicon_io/android-chrome-512x512.png"
              alt={siteConfig.name}
              className="w-9 h-9 rounded-none object-cover"
              priority
            />
          </div>
          <span className="text-base font-medium">{siteConfig.name}</span>
        </Link>

        <div className="flex flex-col gap-7 max-w-[520px]">
          <span className="inline-flex items-center gap-2 w-max bg-default-100/50 border backdrop-blur-[25px] px-3 py-1 text-xs text-muted-foreground rounded-none">
            <span className="size-1.5 rounded-none bg-success" />
            The indie hacker waitlist platform
          </span>

          <h1 className="text-4xl xl:text-5xl leading-[1.05] tracking-tight text-foreground font-normal">
            Ship your waitlist <br />
            <span className="text-muted-foreground">in one command.</span>
          </h1>

          <p className="text-sm text-muted-foreground max-w-[46ch] leading-relaxed">
            Waitlists, email campaigns, fake user blocking, webhooks, and more. All wired up in minutes.
          </p>

          <div className="bg-default-100/40 border backdrop-blur-[25px] p-3 font-mono text-xs flex items-center gap-2">
            <span className="text-success">$</span>
            <span className="text-foreground/90">npx skills add launch-waitlist-zot/zot-skills</span>
          </div>

          <ul className="flex flex-col gap-3">
            {trustBullets.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex items-center justify-center size-6 border bg-default-100/40 backdrop-blur-[25px]">
                  <Icon className="size-3.5 text-foreground/80" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <figure className="flex flex-col gap-3 border bg-default-100/40 backdrop-blur-[25px] p-4">
            <blockquote className="text-sm text-foreground/90 leading-relaxed">
              &ldquo;Replaced our hand-rolled stack in an afternoon. Realtime
              signups, email campaigns, webhooks and a dashboard we can trust.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-6 rounded-none bg-default-200 flex items-center justify-center text-[10px] text-foreground/80">
                MR
              </span>
              <span>Mateo R., indie founder</span>
            </figcaption>
          </figure>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckBadgeIcon className="size-3.5" />
          Trusted by founders and indie hackers shipping real products.
        </div>
      </aside>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] flex flex-col items-center gap-4">
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

          <div className="text-center w-full">
            <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Pick up where you left off.</p>
            <p className="text-sm text-muted-foreground mt-3">
              New to {siteConfig.name}?{" "}
              <Link
                href="/signup"
                className="text-foreground font-medium hover:underline underline-offset-2"
              >
                Create an account<span className="text-muted-foreground">.</span>
              </Link>
            </p>
          </div>

          <div className="w-full flex flex-col gap-2 mt-2">
            <div className="w-full flex gap-3">
              <form action={signInWithGoogle} className="relative flex-1 min-w-0">
                {lastUsedMethod === "Google" && <LastUsedBadge />}
                <Button
                  type="submit"
                  radius="none"
                  className={oauthButtonClass}
                  disableRipple
                  onPress={() => saveLastUsedMethod("Google")}
                  startContent={
                    <Image
                      src={"/icons/google-icon.svg"}
                      width={30}
                      height={30}
                      alt="Google icon"
                      className="w-5 h-5 shrink-0 brightness-0 invert"
                    />
                  }
                >
                  Google
                </Button>
              </form>
              <form action={signInWithGitHub} className="relative flex-1 min-w-0">
                {lastUsedMethod === "GitHub" && <LastUsedBadge />}
                <Button
                  type="submit"
                  radius="none"
                  className={oauthButtonClass}
                  disableRipple
                  onPress={() => saveLastUsedMethod("GitHub")}
                  startContent={
                    <Image
                      src={"/icons/github-icon.svg"}
                      width={30}
                      height={30}
                      alt="GitHub icon"
                      className="w-5 h-5 shrink-0 brightness-0 invert"
                    />
                  }
                >
                  GitHub
                </Button>
              </form>
            </div>
          </div>

          <div className="w-full flex items-center gap-4 mt-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              or with email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-muted-foreground block">
                Email
              </label>
              <InputComponent
                id="email"
                type="email"
                placeholder="founder@example.com"
                radius="none"
                classNames={{ inputWrapper: inputWrapperClass }}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm text-muted-foreground block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <InputComponent
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                radius="none"
                classNames={{ inputWrapper: inputWrapperClass }}
                endContent={
                  <button
                    type="button"
                    tabIndex={-1}
                    className="focus:outline-none"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="size-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="size-4 text-muted-foreground" />
                    )}
                  </button>
                }
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
            </div>

            <div className="relative">
              {lastUsedMethod === "Email" && <LastUsedBadge />}
              <Button
                type="submit"
                radius="none"
                className="w-full h-10 rounded-none !text-sm bg-default-50 border text-muted-foreground hover:bg-default-300 backdrop-blur-[25px]"
                isLoading={isPending}
                isDisabled={isPending}
              >
                Log In
              </Button>
            </div>
          </form>

          <p className="text-xs text-muted-foreground text-center max-w-[36ch]">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-foreground/80 hover:text-foreground underline underline-offset-2"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-foreground/80 hover:text-foreground underline underline-offset-2"
            >
              Privacy Policy.
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
