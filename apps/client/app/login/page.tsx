"use client";

import GlobalButton from "@/components/global/button";
import InputComponent from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px] flex flex-col items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center border border-border">
            <Image
              width={300}
              height={300}
              src="/zot-icon.svg"
              alt={siteConfig.name}
              className="w-10 rounded-lg text-foreground"
            />
          </div>
        </Link>

        <div className="text-center w-full">
          <h1 className="text-2xl font-semibold text-foreground">
            Log in to {siteConfig.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground font-medium hover:underline underline-offset-2"
            >
              Sign up.
            </Link>
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 mt-4">
          <div className="w-full flex gap-3">
            <Button
              className={cn(
                "flex-1 min-w-0 h-10 font-medium",
                "bg-default-100/50 border border-border",
                "text-foreground justify-center gap-2 px-3"
              )}
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
              Login with Google
            </Button>
            <Button
              className={cn(
                "flex-1 min-w-0 h-10 font-medium",
                "bg-default-100/50 border border-border",
                "text-foreground justify-center gap-2 px-3"
              )}
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
              Login with GitHub
            </Button>
          </div>
        </div>

        {/* Separador */}
        <div className="w-full flex items-center gap-4 mt-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Formulario email / contraseña */}
        <form className="w-full space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm text-muted-foreground block"
            >
              Email
            </label>
            <InputComponent
              id="email"
              type="email"
              placeholder="alan.turing@example.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm text-muted-foreground block"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-2"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              variant="faded"

              className={cn(
                "flex-1 rounded-lg outline-primary data-[focus=true]:outline-2 hover:!bg-transparent"
              )}
              classNames={{
                inputWrapper:
                  "data-[focus=true]:bg-default-100/50 data-[hover=true]:!bg-default-100/50 bg-default-100/50 border",
              }}

              endContent={
                <GlobalButton
                  type="button"
                  variant="light"
                  isIconOnly
                  onPress={() => setShowPassword((p) => !p)}
                  size="sm"
                  disableRipple
                  aria-label={showPassword ? "Hidde password" : "Show password"}
                  className="text-muted-foreground"
                  radius="sm"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="size-5" />
                  ) : (
                    <EyeIcon className="size-5" />
                  )}
                </GlobalButton>
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full h-10 rounded-xl !text-sm bg-default-50 border text-muted-foreground hover:bg-default-300"
            size="lg"
            radius="lg"
            isDisabled
          >
            Log In
          </Button>
        </form>

        {/* Términos */}
        <p className="text-xs text-muted-foreground text-center">
          By signing in, you agree to our{" "}
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
    </div>
  );
}
