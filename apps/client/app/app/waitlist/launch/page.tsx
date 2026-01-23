"use client";

import { submitWaitListAction } from "@/actions/submit-waitlist";
import Form from "@/components/form";
import FormField from "@/components/form-field";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { addToast, Button, Card, CardBody, CardFooter, Checkbox } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  submitWaitlistSchema,
  SubmitWaitListValues
} from "@repo/packages/schemas/submit-watlist.zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
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

  const { isPending, error, mutate } = useMutation({
    mutationFn: submitWaitListAction,
    onSuccess: () => {
      addToast({
        title: "Wait-List created",
        description: "Your Wait-List has been created",
        color: "primary"
      });
    }
  });

  const onSubmit = (data: SubmitWaitListValues) => {
    mutate(data);
  };

  return (
    <PageComponent className="p-8">
      <HeaderNavigation
        navigationItems={[
          {
            label: "New Launch",
            pathname: ""
          }
        ]}
      />

      <SidebarNavigation children={
        <div className="text-sm p-4 px-6 flex flex-col gap-8">
          <div className="flex flex-col">
            <Type className="text-muted-foreground text-xs">Step 1</Type>
            <div className="flex items-center gap-2 font-medium">
              <Type>General configurations</Type>
            </div>
          </div>


          <div className="flex flex-col text-muted-foreground">
            <Type className="text-xs">Step 2</Type>
            <div className="flex items-center gap-2 font-medium">
              <Type>Configure api key</Type>
            </div>
          </div>

          <div className="flex flex-col text-muted-foreground">
            <Type className="text-xs">Step 3 - <span className="italic">optional</span></Type>
            <div className="flex items-center gap-2 font-medium">
              <Type>Configure email sending</Type>
            </div>
          </div>

          <div className="flex flex-col text-muted-foreground">
            <Type className="text-xs">Step 4</Type>
            <div className="flex items-center gap-2 font-medium">
              <Type>Review</Type>
            </div>
          </div>
        </div>
      } />

      <div className="flex flex-col gap-4">
        <Title description="Getting started by adding basic details of your waitlist">General configurations</Title>

        <Card radius="sm" as={Form} onSubmit={handleSubmit(onSubmit)} className="flex flex-col border" error={error}>
          <CardBody className="p-0 flex flex-col">
            <FormField
              title="Wait-List Name"
              description="This shows up to Signups in the no-code widget, when they sign up, and in any emails."
              error={errors.name}
              isRequired
              className="p-4"
            >
              <InputComponent placeholder="App Launch" maxLength={30} {...register("name")} autoFocus />
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
              description="We prevent fake emails from being sent to your WaitList. "
              isPremiumFeature
              error={errors.addSecurity}
              className="p-4"
            >
              <Checkbox size="sm" isDisabled>
                Add extra security
              </Checkbox>
            </FormField>
          </CardBody>

          <CardFooter className="border-t flex justify-end">
            <div className="flex gap-2 justify-end">
              <Button as={Link} href="/app/waitlist/dashboard" className="w-fit" variant="bordered" size="sm">
                <Type variant="sm">Cancel</Type>
              </Button>
              <Button
                color="primary"
                className="w-fit border"
                isDisabled={isPending}
                type="submit"
                size="sm"
              >
                <Type variant="sm">Next</Type>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageComponent>
  );
}
