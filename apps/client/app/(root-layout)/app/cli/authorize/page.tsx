"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import {
  approveCliSessionSchema,
  type ApproveCliSessionValues,
} from "@repo/packages/shared/schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  approveCliSession,
  denyCliSession,
  getCliSessionByCode,
  getCliSessionByToken,
} from "@/actions/cli-auth/cli-auth.actions";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";

type Phase = "loading" | "ready" | "approved" | "denied" | "error";

export default function CliAuthorizePage() {
  return (
    <Suspense fallback={<AuthorizeFallback />}>
      <CliAuthorizeInner />
    </Suspense>
  );
}

function AuthorizeFallback() {
  return (
    <PageComponent className="flex justify-center">
      <div className="w-full max-w-lg flex items-center gap-3 py-12">
        <Spinner size="sm" />
        <Type>Loading session...</Type>
      </div>
    </PageComponent>
  );
}

function CliAuthorizeInner() {
  const router = useRouter();
  const search = useSearchParams();
  const sessionToken = search.get("session");
  const userCodeFromUrl = search.get("code");

  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    data: session,
    isPending: isLoadingSession,
    error: sessionError,
  } = useQuery({
    queryKey: ["cli-session", sessionToken, userCodeFromUrl],
    queryFn: async () => {
      if (sessionToken) return await getCliSessionByToken(sessionToken);
      if (userCodeFromUrl) return await getCliSessionByCode(userCodeFromUrl);
      throw new Error("Missing session token or user code in URL.");
    },
    enabled: !!sessionToken || !!userCodeFromUrl,
    retry: false,
  });

  useEffect(() => {
    if (!sessionToken && !userCodeFromUrl) {
      setPhase("error");
      setErrorMessage("Missing session token or user code in URL.");
      return;
    }
    if (sessionError) {
      setPhase("error");
      setErrorMessage(sessionError.message);
      return;
    }
    if (!session) return;
    if (session.status === "approved") setPhase("approved");
    else if (session.status === "denied") setPhase("denied");
    else if (session.status === "expired") {
      setPhase("error");
      setErrorMessage("This CLI session has expired. Run the command in your terminal again.");
    } else if (session.status === "pending") setPhase("ready");
  }, [session, sessionError, sessionToken, userCodeFromUrl]);

  const defaultApiKeyName =
    (session?.clientName && `${session.clientName} (${shortDate()})`) || `CLI (${shortDate()})`;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApproveCliSessionValues>({
    resolver: zodResolver(approveCliSessionSchema),
    values: {
      apiKeyName: defaultApiKeyName,
      sessionToken: sessionToken ?? undefined,
      userCode: userCodeFromUrl ?? undefined,
    },
  });

  const approve = useMutation({
    mutationFn: approveCliSession,
    onSuccess: () => {
      addToast({ description: "CLI authorized", color: "success" });
      setPhase("approved");
    },
    onError: (err: Error) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    },
  });

  const deny = useMutation({
    mutationFn: denyCliSession,
    onSuccess: () => {
      addToast({ description: "CLI request denied" });
      setPhase("denied");
    },
    onError: (err: Error) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    },
  });

  useEffect(() => {
    reset({
      apiKeyName: defaultApiKeyName,
      sessionToken: sessionToken ?? undefined,
      userCode: userCodeFromUrl ?? undefined,
    });
  }, [defaultApiKeyName, reset, sessionToken, userCodeFromUrl]);

  const onApprove = (values: ApproveCliSessionValues) => approve.mutate(values);
  const onDeny = () =>
    deny.mutate({
      sessionToken: sessionToken ?? undefined,
      userCode: userCodeFromUrl ?? undefined,
    });

  return (
    <PageComponent className="flex justify-center">
      <div className="w-full max-w-lg">
        <Title description="Review the request and approve or deny access.">
          Authorize CLI
        </Title>

        <Card radius="none" className="mt-6 border">
          <CardHeader className="flex flex-col items-start gap-1 border-b">
            <Type variant="h5" className="font-medium">
              {session?.clientName ?? "Zot CLI"}
            </Type>
            <Type className="text-muted-foreground">
              This device is requesting permission to generate an API key for your account.
            </Type>
          </CardHeader>

          <CardBody className="gap-4">
            {phase === "loading" || isLoadingSession ? (
              <div className="flex items-center gap-3 py-6">
                <Spinner size="sm" />
                <Type>Loading session...</Type>
              </div>
            ) : null}

            {phase === "error" ? (
              <div className="py-2">
                <Type className="text-danger">{errorMessage}</Type>
                <GlobalButton
                  className="mt-4"
                  variant="light"
                  onPress={() => router.push("/app/dashboard")}
                >
                  Back to dashboard
                </GlobalButton>
              </div>
            ) : null}

            {phase === "approved" ? (
              <div className="py-2">
                <Type className="text-success font-medium">
                  CLI authorized. You can return to your terminal now.
                </Type>
                <GlobalButton
                  className="mt-4"
                  color="primary"
                  onPress={() => router.push("/app/api-keys")}
                >
                  View API keys
                </GlobalButton>
              </div>
            ) : null}

            {phase === "denied" ? (
              <div className="py-2">
                <Type className="text-muted-foreground">
                  Request denied. No API key was generated.
                </Type>
                <GlobalButton
                  className="mt-4"
                  variant="light"
                  onPress={() => router.push("/app/dashboard")}
                >
                  Back to dashboard
                </GlobalButton>
              </div>
            ) : null}

            {phase === "ready" && session ? (
              <form id="cli-authorize" onSubmit={handleSubmit(onApprove)} className="flex flex-col gap-3">
                <Type className="font-medium">Name for the new API key</Type>
                <Type className="text-muted-foreground">
                  You can rename or revoke it later from the API keys page.
                </Type>
                <Controller
                  name="apiKeyName"
                  control={control}
                  render={({ field }) => (
                    <InputComponent
                      placeholder="e.g. My laptop CLI"
                      maxLength={50}
                      isInvalid={!!errors.apiKeyName}
                      errorMessage={errors.apiKeyName?.message}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />

                <div className="mt-2 border p-3 flex flex-col gap-1">
                  <Type className="text-muted-foreground">Verification code</Type>
                  <Type variant="h6">{session.userCode}</Type>
                </div>
              </form>
            ) : null}
          </CardBody>

          {phase === "ready" ? (
            <CardFooter className="justify-end gap-2 border-t">
              <GlobalButton
                variant="light"
                onPress={onDeny}
                isLoading={deny.isPending}
                isDisabled={approve.isPending}
              >
                Deny
              </GlobalButton>
              <GlobalButton
                color="primary"
                type="submit"
                form="cli-authorize"
                isLoading={approve.isPending}
                isDisabled={deny.isPending}
              >
                Authorize
              </GlobalButton>
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </PageComponent>
  );
}

function shortDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
