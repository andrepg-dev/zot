"use client";

import { createApiKey, getApiKeys } from "@/actions/api-key/api-key.actions";
import { getProfile } from "@/actions/auth/profile";
import { getEmailTemplates } from "@/actions/email-templates/email-templates.actions";
import { registerWaitListUser } from "@/actions/wait-list/wait-list-user.actions";
import { createWaitList, updateWaitList } from "@/actions/wait-list/wait-list.actions";
import Form from "@/components/form";
import FormField from "@/components/form-field";
import Stepper from "@/components/global/stepper";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import CodeBlock from "@/components/ui/code-block";
import InputComponent from "@/components/ui/input";
import { useHotkey } from "@/hooks/use-hotkey";
import { cn } from "@/lib/utils";
import {
  BoltIcon,
  CheckCircleIcon,
  LockClosedIcon,
  PlusIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Kbd,
  Select,
  SelectItem,
  Tab,
  Tabs
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmailTemplate } from "@repo/packages/shared/schemas";
import { submitWaitlistSchema, SubmitWaitListValues } from "@repo/packages/shared/schemas/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function LaunchWaitList() {
  const [step, setStep] = useState(1);
  const [connectionTab, setConnectionTab] = useState<string>("sdk");
  const [createdWaitlistId, setCreatedWaitlistId] = useState<string>("");

  const { data: userData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  const { data: apiKeys } = useQuery({
    queryKey: ["api-keys"],
    queryFn: getApiKeys
  });

  const { data: templatesData, isPending: isTemplatesPending } = useQuery({
    queryKey: ["email-templates"],
    queryFn: getEmailTemplates
  });

  const templates = ((templatesData ?? []) as EmailTemplate[]).filter(
    (t) => t.status === "published"
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SubmitWaitListValues>({
    resolver: zodResolver(submitWaitlistSchema),
    defaultValues: {
      sendEmail: true
    }
  });

  useEffect(() => {
    if (userData?.suscriptionPlan === "PREMIUM") {
      setValue("addSecurity", true);
    }
  }, [userData?.suscriptionPlan, setValue]);

  const [selectedApiKey, setSelectedApiKey] = useState<string>("");
  const selectedApiKeyValue = apiKeys?.find((k) => k._id === selectedApiKey)?.apiKey;

  const { mutate: generateApiKey } = useMutation({
    mutationFn: () => createApiKey({ name: `Waitlist Key - ${Date.now()}` }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      setSelectedApiKey(data._id);
      addToast({ description: "API key generated", color: "success" });
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  useHotkey({
    key: "escape",
    onPress: () => {
      router.push("/app/waitlist/dashboard");
    }
  });

  useHotkey({
    key: "s",
    modifiers: ["meta"],
    onPress: () => setConnectionTab("sdk"),
    enabled: step === 2
  });

  useHotkey({
    key: "a",
    modifiers: ["meta"],
    onPress: () => setConnectionTab("api"),
    enabled: step === 2
  });

  const { isPending: isCreatingWaitlist, mutate: createWaitlistMutation } = useMutation({
    mutationFn: (data: SubmitWaitListValues) =>
      createWaitList({
        name: data.name,
        sendEmailToNewSignup: data.sendEmail,
        isSecurityActive: data.addSecurity
      }),
    onSuccess: (response) => {
      setCreatedWaitlistId(response._id);
      setStep(2);
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  const { isPending: isTestingConnection, mutate: testConnection } = useMutation({
    mutationFn: () =>
      registerWaitListUser(createdWaitlistId, {
        email: `test+${Date.now()}@zot.dev`,
        name: "Test User"
      }),
    onSuccess: () => {
      addToast({
        title: "Connection successful",
        description: "A test user was added to your waitlist.",
        color: "success"
      });
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  useHotkey({
    key: "Enter",
    modifiers: ["meta"],
    onPress: () => {
      if (createdWaitlistId) testConnection();
    },
    enabled: step === 2
  });

  const { isPending, error, mutate } = useMutation({
    mutationFn: (data: SubmitWaitListValues) =>
      updateWaitList(createdWaitlistId, {
        name: data.name,
        sendEmailToNewSignup: data.sendEmail,
        isSecurityActive: data.addSecurity,
        emailTemplateToNewSignUps: data.emailTemplateToNewSignUps
      }),
    onSuccess: (_data, variables) => {
      posthog.capture("waitlist_created", {
        name: variables.name,
        send_email_to_new_signup: variables.sendEmail,
        security_active: variables.addSecurity
      });
      addToast({
        title: "Waitlist created",
        description: (
          <div className="flex flex-col gap-1 mt-1 w-full">
            <div className="flex justify-between w-full">
              <span className="text-muted-foreground">Name</span>
              <span>{variables.name}</span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-muted-foreground">Email sending</span>
              <Type>{variables.sendEmail ? "Enabled" : "Disabled"}</Type>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-muted-foreground">Security</span>

              <Chip status={variables.addSecurity ? "purple" : "warning"}>
                {variables.addSecurity ? (
                  <>
                    <LockClosedIcon className="size-2.5 mr-1" /> Security enabled
                  </>
                ) : (
                  "Security disabled"
                )}
              </Chip>
            </div>
          </div>
        ),
        color: "default",
        hideIcon: true,
        classNames: {
          description: "text-sm w-full",
          base: "rounded-none! border-l-8 border-l-primary",
          wrapper: "w-full"
        }
      });
      router.push("/app/waitlist/dashboard");
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  const onSubmit = (data: SubmitWaitListValues) => {
    mutate(data);
  };

  return (
    <PageComponent>
      <HeaderNavigation
        navigationItems={[
          {
            label: "New Launch",
            pathname: ""
          }
        ]}
      />

      <SidebarNavigation
        children={
          <Stepper
            activeStep={step}
            onStepChange={setStep}
            steps={[
              {
                number: 1,
                title: "General configurations"
              },
              {
                number: 2,
                title: "Connection"
              },
              {
                number: 3,
                title: "Configure email sending",
                optional: true
              },
              {
                number: 4,
                title: "Review"
              }
            ]}
          />
        }
      />

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <Title description="Getting started by adding basic details of your waitlist">
            General configurations
          </Title>

          <Card
            radius="sm"
            as="form"
            onSubmit={handleSubmit((data) => {
              if (createdWaitlistId) {
                setStep(2);
                return;
              }
              createWaitlistMutation(data);
            })}
            className="flex flex-col border"
          >
            <CardBody className="p-0 flex flex-col">
              <FormField
                title="Wait-List Name"
                description="This shows up to Signups in the no-code widget, when they sign up, and in any emails."
                error={errors.name}
                isRequired
                className="p-4 rounded"
              >
                <InputComponent
                  placeholder="App Launch"
                  maxLength={30}
                  {...register("name")}
                  autoFocus
                />
              </FormField>

              <hr />

              <FormField
                title="Send email to new signups"
                description="New Signups on your Waitlist will receive an email containing their referral link and Waitlist status."
                error={errors.sendEmail}
                className="p-4"
              >
                <Controller
                  control={control}
                  name="sendEmail"
                  render={({ field }) => (
                    <Checkbox size="sm" isSelected={field.value} onValueChange={field.onChange}>
                      Activate email sending
                    </Checkbox>
                  )}
                />
              </FormField>

              <hr />

              <FormField
                title="Add security to your WaitList"
                description={
                  <>
                    Prevent fake emails from being sent to your WaitList with{" "}
                    <Link href={"https://dymo.tpeoficial.com/"} target="_blank">
                      <Type variant="link">Dymo Security Services.</Type>
                    </Link>
                  </>
                }
                isPremiumFeature
                error={errors.addSecurity}
                className="p-4"
              >
                <Controller
                  control={control}
                  name="addSecurity"
                  render={({ field }) => (
                    <Checkbox
                      size="sm"
                      isDisabled={userData?.suscriptionPlan == "FREE"}
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    >
                      Add extra security
                    </Checkbox>
                  )}
                />
              </FormField>

              <hr />

              <FormField
                title="Webhook URL"
                description={
                  <>
                    Get notified when someone joins your waitlist. We'll send a{" "}
                    <Type variant="code">POST</Type> request to this URL.
                  </>
                }
                error={errors.webhookUrl}
                className="p-4"
              >
                <InputComponent
                  placeholder="https://your-app.com/api/webhook"
                  {...register("webhookUrl")}
                />
                <CodeBlock
                  className="mt-2"
                  lang="json"
                  code={`{
  "email": "user_email@example.com",
  "event": "waitlist_user_registered",
  "waitlist": {
    "id": "wl_abc123",
    "name": "Your Waitlist Name"
  }
}`}
                />
              </FormField>
            </CardBody>

            <CardFooter className="border-t flex justify-end py-4">
              <div className="flex gap-2 justify-end">
                <Button
                  as={Link}
                  href="/app/waitlist/dashboard"
                  className="w-fit"
                  variant="bordered"
                  size="sm"
                >
                  <Type variant="sm">Cancel</Type>
                </Button>
                <Button
                  color="primary"
                  className="w-fit border"
                  size="sm"
                  type="submit"
                  isLoading={isCreatingWaitlist}
                >
                  <Type variant="sm">Next</Type>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-2">
          <Title description="Choose how to connect your waitlist to your application">
            Connection
          </Title>

          <Tabs
            radius="sm"
            size="sm"
            variant="bordered"
            selectedKey={connectionTab}
            onSelectionChange={(key) => setConnectionTab(key as string)}
          >
            <Tab
              key="api"
              title={
                <div className="flex items-center gap-2">
                  API Connection
                  <Kbd className="text-xs" keys={["command"]}>
                    A
                  </Kbd>
                </div>
              }
            >
              <div className="flex flex-col gap-3 bg-default-50 border rounded-sm p-4">
                <Select
                  radius="sm"
                  size="sm"
                  className="border rounded-lg overflow-hidden"
                  label="API Key"
                  placeholder="Select or generate an API key"
                  selectedKeys={selectedApiKey ? [selectedApiKey] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;

                    if (key === "generate") {
                      generateApiKey();
                      return;
                    }

                    setSelectedApiKey(key || "");
                  }}
                  items={[
                    ...(apiKeys || []).map((k) => ({
                      key: k._id,
                      label: k.name
                    })),
                    { key: "generate", label: "Generate new API key" }
                  ]}
                >
                  {(item) => (
                    <SelectItem
                      key={item.key}
                      startContent={
                        item.key === "generate" ? <PlusIcon className="size-4" /> : undefined
                      }
                      className={item.key === "generate" ? "!text-primary" : ""}
                    >
                      {item.label}
                    </SelectItem>
                  )}
                </Select>
                <CodeBlock
                  lang="bash"
                  code={`curl -X POST http://localhost:3010/v1/wait-list/${createdWaitlistId || "wl_abc123"}/user \\
  -H "Authorization: Bearer ${selectedApiKeyValue || "your-api-key"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "asponceg@gmail.com",
    "name": "Andre Ponce",
    "referredBy": "user@gmail.com",
    "source": "social",
    "metadata": {}
  }'`}
                  displayCode={
                    selectedApiKeyValue
                      ? `curl -X POST http://localhost:3010/v1/wait-list/${createdWaitlistId || "wl_abc123"}/user \\
  -H "Authorization: Bearer ${selectedApiKeyValue.slice(0, 8)}${"•".repeat(20)}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "asponceg@gmail.com",
    "name": "Andre Ponce",
    "referredBy": "user@gmail.com",
    "source": "social",
    "metadata": {}
  }'`
                      : undefined
                  }
                />
              </div>
            </Tab>
            <Tab
              key="sdk"
              title={
                <div className="flex items-center gap-2">
                  SDK Connection
                  <Kbd className="text-xs" keys={["command"]}>
                    S
                  </Kbd>
                </div>
              }
            >
              <div className="flex flex-col gap-3 bg-default-50 border rounded-sm p-4">
                <Select
                  radius="sm"
                  size="sm"
                  className="border rounded-lg overflow-hidden"
                  label="API Key"
                  placeholder="Select or generate an API key"
                  selectedKeys={selectedApiKey ? [selectedApiKey] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;

                    if (key === "generate") {
                      generateApiKey();
                      return;
                    }

                    setSelectedApiKey(key || "");
                  }}
                  items={[
                    ...(apiKeys || []).map((k) => ({
                      key: k._id,
                      label: k.name
                    })),
                    { key: "generate", label: "Generate new API key" }
                  ]}
                >
                  {(item) => (
                    <SelectItem
                      key={item.key}
                      startContent={
                        item.key === "generate" ? <PlusIcon className="size-4" /> : undefined
                      }
                      className={item.key === "generate" ? "!text-primary" : ""}
                    >
                      {item.label}
                    </SelectItem>
                  )}
                </Select>
                <CodeBlock lang="bash" code={`npm install zot-sdk`} />
                <CodeBlock
                  code={`import "dotenv/config";
import { ZotSDK } from "zot-sdk";

const client = new ZotSDK({
  apiKey: "${selectedApiKeyValue || "your-api-key"}",
});

const res = await client.waitlist("${createdWaitlistId || "wl_abc123"}").addUser({
  email: "asponceg@gmail.com",
  name: "Andre Ponce", // Optional
  referredBy: "user@gmail.com", // Optional — auto-sets source to "referral"
  source: "social", // Optional — social | email | paid_ads (organic/referral are auto-determined)
  metadata: {
    // Any relevant data for you
  },
});`}
                  displayCode={
                    selectedApiKeyValue
                      ? `import "dotenv/config";
import { ZotSDK } from "@zot/sdk";

const client = new ZotSDK({
  apiKey: "${selectedApiKeyValue.slice(0, 8)}${"•".repeat(20)}",
});

const res = await client.waitlist("${createdWaitlistId || "wl_abc123"}").addUser({
  email: "asponceg@gmail.com",
  name: "Andre Ponce", // Optional
  referredBy: "user@gmail.com", // Optional — auto-sets source to "referral"
  source: "social", // Optional — social | email | paid_ads (organic/referral are auto-determined)
  metadata: {
    // Any relevant data for you
  },
});`
                      : undefined
                  }
                />
              </div>
            </Tab>
          </Tabs>

          <div className="flex gap-2 justify-between bg-default-50 p-4 py-3 border rounded-sm">
            <Button
              className="w-fit"
              variant="flat"
              color="success"
              size="sm"
              isDisabled={!createdWaitlistId}
              isLoading={isTestingConnection}
              onPress={() => testConnection()}
            >
              <BoltIcon className="size-4" />
              <Type variant="sm">Test Connection</Type>
              <Kbd className="text-xs" keys={["command"]}>
                ↵
              </Kbd>
            </Button>
            <div className="flex gap-2">
              <Button className="w-fit" variant="bordered" size="sm" onPress={() => setStep(1)}>
                <Type variant="sm">Back</Type>
              </Button>
              <Button color="primary" className="w-fit border" size="sm" onPress={() => setStep(3)}>
                <Type variant="sm">Next</Type>
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <Title description="Choose the email template sent to new signups">
            Configure email sending
          </Title>

          <Card radius="sm" className="flex flex-col border">
            <CardBody className="p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <Type variant="h6">Default template</Type>
                <Type className="text-muted-foreground">
                  Select a published template to send automatically when someone joins your
                  waitlist.
                </Type>
              </div>

              {isTemplatesPending ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-sm border bg-default-50 animate-pulse"
                    />
                  ))}
                </div>
              ) : templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 rounded-sm bg-default-50">
                  <SparklesIcon className="size-5 text-muted-foreground" />
                  <Type className="text-muted-foreground">No published templates yet</Type>
                  <Button
                    as={Link}
                    href="/app/new/email/template"
                    target="_blank"
                    size="sm"
                    variant="flat"
                    color="primary"
                    radius="sm"
                    className="mt-1"
                  >
                    <PlusIcon className="size-4" />
                    Create your first template
                  </Button>
                </div>
              ) : (
                <Controller
                  control={control}
                  name="emailTemplateToNewSignUps"
                  render={({ field }) => (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {templates.map((template) => {
                          const isSelected = field.value === template._id;

                          return (
                            <button
                              key={template._id}
                              type="button"
                              onClick={() => field.onChange(isSelected ? undefined : template._id)}
                              className={cn(
                                "group relative flex flex-col gap-2 rounded-sm bg-default-50 p-0 text-left transition hover:border-primary",
                                isSelected &&
                                "border-primary ring-1 ring-primary bg-primary/30 opacity-80"
                              )}
                            >
                              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-sm bg-white/90 flex justify-center">
                                <div className="w-3/4 h-3/4 absolute bottom-0 rounded-sm overflow-hidden">
                                  <Image
                                    src={template.preview}
                                    alt={template.alias}
                                    width={400}
                                    height={300}
                                    className="object-cover group-hover:scale-[1.02] transition"
                                  />
                                </div>

                                {isSelected && (
                                  <div className="absolute top-2 right-2">
                                    <CheckCircleIcon className="size-5 text-primary" />
                                  </div>
                                )}
                              </div>

                              <div className="px-3 pb-3">
                                <Type variant="h6" className="truncate">
                                  {template.alias}
                                </Type>
                                <Type className="text-muted-foreground truncate">
                                  {template.subject || "No subject"}
                                </Type>
                              </div>
                            </button>
                          );
                        })}

                        <Link
                          href="/app/new/email/template"
                          target="_blank"
                          className="flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed bg-default-50/50 aspect-[4/3] transition-colors hover:border-primary/50 hover:bg-default-100/50"
                        >
                          <PlusIcon className="size-5 text-muted-foreground" />
                          <Type className="text-muted-foreground">Create template</Type>
                        </Link>
                      </div>
                    </div>
                  )}
                />
              )}
            </CardBody>

            <CardFooter className="border-t flex justify-end py-4">
              <div className="flex gap-2 justify-end">
                <Button className="w-fit" variant="bordered" size="sm" onPress={() => setStep(2)}>
                  <Type variant="sm">Back</Type>
                </Button>
                <Button
                  color="primary"
                  className="w-fit border"
                  size="sm"
                  onPress={() => setStep(4)}
                >
                  <Type variant="sm">Next</Type>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === 4 &&
        (() => {
          const formValues = watch();
          const selectedTemplate = templates.find(
            (t) => t._id === formValues.emailTemplateToNewSignUps
          );

          return (
            <div className="flex flex-col gap-4">
              <Title description="Review your waitlist configuration before launching">
                Review
              </Title>

              <Card
                radius="sm"
                as={Form}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col border"
                error={error}
              >
                <CardBody className="p-0 flex flex-col">
                  <div className="flex justify-between items-center p-4">
                    <div className="flex flex-col">
                      <Type variant="h6">Waitlist name</Type>
                      <Type className="text-muted-foreground">
                        How your waitlist appears to users
                      </Type>
                    </div>
                    <Type>{formValues.name || "—"}</Type>
                  </div>

                  <hr />

                  <div className="flex justify-between items-center p-4">
                    <div className="flex flex-col">
                      <Type variant="h6">Email to new signups</Type>
                      <Type className="text-muted-foreground">
                        Send confirmation email on registration
                      </Type>
                    </div>
                    <Chip status={formValues.sendEmail ? "active" : "neutral"}>
                      {formValues.sendEmail ? "Enabled" : "Disabled"}
                    </Chip>
                  </div>

                  <hr />

                  <div className="flex justify-between items-center p-4">
                    <div className="flex flex-col">
                      <Type variant="h6">Security</Type>
                      <Type className="text-muted-foreground">Dymo email verification</Type>
                    </div>
                    <Chip status={formValues.addSecurity ? "active" : "neutral"}>
                      {formValues.addSecurity ? "Enabled" : "Disabled"}
                    </Chip>
                  </div>

                  <hr />

                  <div className="flex justify-between items-center p-4">
                    <div className="flex flex-col">
                      <Type variant="h6">Webhook</Type>
                      <Type className="text-muted-foreground">Notify on new signups</Type>
                    </div>
                    {formValues.webhookUrl ? (
                      <Type variant="code">{formValues.webhookUrl}</Type>
                    ) : (
                      <Type className="text-muted-foreground">Not configured</Type>
                    )}
                  </div>

                  <hr />

                  <div className="flex justify-between items-start p-4">
                    <div className="flex flex-col">
                      <Type variant="h6">Email template</Type>
                      <Type className="text-muted-foreground">Template for new signup emails</Type>
                    </div>
                    {selectedTemplate ? (
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-sm overflow-hidden bg-white/90 border flex justify-center relative">
                          <div className="w-3/4 h-3/4 absolute bottom-0 overflow-hidden">
                            <Image
                              src={selectedTemplate.preview}
                              alt={selectedTemplate.alias}
                              width={100}
                              height={75}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <Type>{selectedTemplate.alias}</Type>
                      </div>
                    ) : (
                      <Type className="text-muted-foreground">None selected</Type>
                    )}
                  </div>
                </CardBody>

                <CardFooter className="border-t flex justify-end py-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      className="w-fit"
                      variant="bordered"
                      size="sm"
                      onPress={() => setStep(3)}
                    >
                      <Type variant="sm">Back</Type>
                    </Button>
                    <Button
                      color="primary"
                      className="w-fit border"
                      isLoading={isPending}
                      type="submit"
                      size="sm"
                    >
                      <Type variant="sm">Launch</Type>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          );
        })()}
    </PageComponent>
  );
}
