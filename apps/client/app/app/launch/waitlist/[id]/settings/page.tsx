"use client";

import FormField from "@/components/form-field";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Switch } from "@heroui/switch";

export default function SettingsPage() {
  return (
    <PageComponent className="flex flex-col gap-10 w-5xl">
      <Title description="Configure wait-list general options">Settings</Title>

      <div className="flex flex-col gap-4">
        <Title>General Settings</Title>

        <Card className="border" radius="sm">
          <CardBody className="p-0">
            <FormField
              title="Wait-List name"
              description="Displayed throughout the dashboard."
              className="p-4"
            >
              <InputComponent maxLength={30} />
            </FormField>

            <hr />
            <FormField
              title="Availability"
              description="Pause wait-list operations"
              className="p-4"
            >
              <Button className="w-max" size="sm" variant="bordered" color="warning">
                Disable
              </Button>
            </FormField>
            <hr />

            <CardFooter className="flex justify-end">
              <Button size="sm" color="primary" className="border">
                Save changes
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Title description="Manage email wait-list configuration">Email</Title>

        <Card className="border" radius="sm">
          <CardBody className="p-0">
            <FormField
              title="Send email to new signups"
              description="New Signups on your WaitList will receive an email containing their referral link and Waitlist status."
              className="p-4"
              icon={<EnvelopeIcon className="size-4" />}
              rightChildrenClassName="ml-auto"
            >
              <Switch size="sm" color="primary">
                Enabled
              </Switch>
            </FormField>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Title description="Permanently remove your wait-list and its database.">
          Delete WaitList
        </Title>

        <Alert
          color="danger"
          variant="faded"
          classNames={{ iconWrapper: "bg-red-500 mb-auto mt-3.5" }}
        >
          <div className="flex items-center flex-col gap-1 mt-3">
            <div className="flex flex-col">
              <Type variant="h6" className="text-white">
                Deleting WaitList
              </Type>
              <span className="text-muted-foreground">
                All landing page used in this wait-list don't gonna work, make sure to handle
                correctly your landing page
              </span>
            </div>

            <div className="flex justify-start w-full mt-2">
              <Button size="sm" color="danger" className="text-foreground">
                Delete
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    </PageComponent>
  );
}
