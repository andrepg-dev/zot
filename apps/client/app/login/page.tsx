"use client";

import { loginAction } from "@/actions/login";
import InputComponent from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@repo/packages/shared/schemas/index";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const inputWrapperClass =
  "data-[focus=true]:bg-default-100/50 data-[hover=true]:!bg-default-100/50 bg-default-100/50 border backdrop-blur-[25px]";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: LoginFormValues) => await loginAction(data),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "You will be redirected."
      });

      router.replace("/app/dashboard");
    },
    onError: (err: Error) => {
      addToast({
        title: "Error",
        description: err.message,
        color: "danger"
      });
    }
  });

  const onSubmit = (data: LoginFormValues) => mutate(data);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-no-repeat ",
          "bg-[url('/zot-background-3.png')]"
        )}
        aria-hidden
      />

      <Button
        as={Link}
        href="/"
        className="absolute top-8 left-8 !p-0 !hover:bg-transparent text-muted-foreground"
        variant="light"
        startContent={<ChevronLeftIcon className="size-4" />}
      >
        Home
      </Button>

      <div className="w-full max-w-[480px] flex flex-col items-center gap-4 relative z-10">
        <Link href="/" className="flex items-center justify-center mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center border">
            <Image
              width={300}
              height={300}
              src="/zot-icon.svg"
              alt={siteConfig.name}
              className="w-10 rounded-lg"
            />
          </div>
        </Link>

        <div className="text-center w-full">
          <h1 className="text-2xl font-semibold text-foreground">Log in to {siteConfig.name}</h1>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground font-medium hover:underline underline-offset-2"
            >
              Sign up<span className="text-muted-foreground">.</span>
            </Link>
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 mt-4">
          <div className="w-full flex gap-3">
            <Button
              className={cn(
                "flex-1 min-w-0 h-10 font-medium",
                "bg-default-100/50 border border-border backdrop-blur-[25px]",
                "text-foreground justify-center gap-2 px-3"
              )}
              onPress={() => {
                router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`)
              }}
              disableRipple
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
                "bg-default-100/50 border border-border backdrop-blur-[25px]",
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
              disableRipple
            >
              Login with GitHub
            </Button>
          </div>
        </div>

        <div className="w-full flex items-center gap-4 mt-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
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
              placeholder="andrew@example.com"
              classNames={{ inputWrapper: inputWrapperClass }}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-muted-foreground block">
              Password
            </label>
            <InputComponent
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

          <Button
            type="submit"
            className="w-full h-10 rounded-xl !text-sm bg-default-50 border text-muted-foreground hover:bg-default-300 backdrop-blur-[25px]"
            isLoading={isPending}
            isDisabled={isPending}
          >
            Log In
          </Button>
        </form>

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
