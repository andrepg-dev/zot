"use client";

import { submitWaitListAction } from "@/actions/submit-waitlist";
import Form from "@/components/form";
import FormField from "@/components/form-field";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { addToast, Button, Checkbox } from "@heroui/react";
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
    <PageComponent className="bg-default-50 border border-dashed rounded-sm w-5/6 mx-auto mt-8">
      <HeaderNavigation
        navigationItems={[
          {
            label: "New Launch",
            pathname: ""
          }
        ]}
      />

      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" error={error}>
        <FormField
          title="Wait-List Name"
          description="This shows up to Signups in the no-code widget, when they sign up, and in any emails."
          error={errors.name}
          isRequired
        >
          <InputComponent placeholder="App Launch" maxLength={30} {...register("name")} autoFocus />
        </FormField>

        <FormField
          title="Wait-List URL"
          description={
            <>
              Use your own URL to join in the widget<Type variant="link">See example.</Type>
            </>
          }
          error={errors.url}
        >
          <InputComponent placeholder="example.com/waitlist" type="url" {...register("url")} />
        </FormField>

        <FormField
          title="Send email to new signups"
          description="New Signups on your Waitlist will receive an email containing their referral link and Waitlist status."
          error={errors.sendEmail}
        >
          <Checkbox size="sm" {...register("sendEmail")} defaultChecked={true}>
            Activate email sending
          </Checkbox>
        </FormField>

        <FormField
          title="Add security to your WaitList"
          description="We prevent fake emails from being sent to your WaitList. "
          isPremiumFeature
          error={errors.addSecurity}
        >
          <Checkbox size="sm" isDisabled>
            Add extra security
          </Checkbox>
        </FormField>

        <div className="flex gap-2 justify-end">
          <Button as={Link} href="/app/waitlist" className="w-fit" variant="bordered" size="sm">
            <Type variant="sm">Cancel</Type>
          </Button>
          <Button
            color="primary"
            className="w-fit border"
            isDisabled={isPending}
            type="submit"
            size="sm"
          >
            <Type variant="sm">Create WaitList</Type>
          </Button>
        </div>
      </Form>
    </PageComponent>
  );
}
