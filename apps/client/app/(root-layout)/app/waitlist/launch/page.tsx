"use client";

import { getProfile } from "@/actions/auth/profile";
import { createWaitList } from "@/actions/wait-list/wait-list.actions";
import Form from "@/components/form";
import FormField from "@/components/form-field";
import Stepper from "@/components/global/stepper";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { useHotkey } from "@/hooks/use-hotkey";
import { Button, Card, CardBody, CardFooter, Checkbox } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitWaitlistSchema, SubmitWaitListValues } from "@repo/packages/shared/schemas/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LaunchWaitList() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SubmitWaitListValues>({
    resolver: zodResolver(submitWaitlistSchema),
    defaultValues: {
      sendEmail: true
    }
  });

  const [step, setStep] = useState(1);

  const { data: userData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  const router = useRouter();

  useHotkey({
    key: "escape",
    onPress: () => {
      router.push("/app/waitlist/dashboard");
    }
  });

  const { isPending, error, mutate } = useMutation({
    mutationFn: (data: SubmitWaitListValues) =>
      createWaitList({
        name: data.name,
        sendEmailToNewSignup: data.sendEmail,
        isSecurityActive: data.addSecurity
      }),
    onSuccess: () => {}
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
                title: "Configure api key"
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
            as={Form}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col border"
            error={error}
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
                <Checkbox size="sm" {...register("sendEmail")} defaultChecked={true}>
                  Activate email sending
                </Checkbox>
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
                <Checkbox size="sm" isDisabled={userData?.suscriptionPlan == "FREE"}>
                  Add extra security
                </Checkbox>
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
                  onPress={() => setStep(2)}
                >
                  <Type variant="sm">Next</Type>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <Title description="Set up your API key to connect your waitlist">
            Configure api key
          </Title>

          <Card radius="sm" className="flex flex-col border">
            <CardBody className="p-5">
              <Type className="text-muted-foreground">API key configuration coming soon.</Type>
            </CardBody>

            <CardFooter className="border-t flex justify-end py-4">
              <div className="flex gap-2 justify-end">
                <Button className="w-fit" variant="bordered" size="sm" onPress={() => setStep(1)}>
                  <Type variant="sm">Back</Type>
                </Button>
                <Button
                  color="primary"
                  className="w-fit border"
                  size="sm"
                  onPress={() => setStep(3)}
                >
                  <Type variant="sm">Next</Type>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <Title description="Configure the emails sent to new signups">
            Configure email sending
          </Title>

          <Card radius="sm" className="flex flex-col border">
            <CardBody className="p-5">
              <Type className="text-muted-foreground">
                Email sending configuration coming soon.
              </Type>
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

      {step === 4 && (
        <div className="flex flex-col gap-4">
          <Title description="Review your waitlist configuration before launching">Review</Title>

          <Card
            radius="sm"
            as={Form}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col border"
            error={error}
          >
            <CardBody className="p-5">
              <Type className="text-muted-foreground">Review your settings and launch.</Type>
            </CardBody>

            <CardFooter className="border-t flex justify-end py-4">
              <div className="flex gap-2 justify-end">
                <Button className="w-fit" variant="bordered" size="sm" onPress={() => setStep(3)}>
                  <Type variant="sm">Back</Type>
                </Button>
                <Button
                  color="primary"
                  className="w-fit border"
                  isDisabled={isPending}
                  type="submit"
                  size="sm"
                >
                  <Type variant="sm">Launch</Type>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </PageComponent>
  );
}
