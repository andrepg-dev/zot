"use client";

import { getProfile } from "@/actions/auth/profile";
import { getWaitListStats } from "@/actions/wait-list/stats.actions";
import { deleteWaitList, updateWaitList } from "@/actions/wait-list/wait-list.actions";
import FormField from "@/components/form-field";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { Switch } from "@heroui/switch";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdateWaitListValues } from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { use, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const generalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isAvailable: z.boolean().optional(),
  isSecurityActive: z.boolean().optional()
});

const emailFormSchema = z.object({
  sendEmailToNewSignup: z.boolean().optional()
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;
type EmailFormValues = z.infer<typeof emailFormSchema>;

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const router = useRouter();
  const confirmModal = useDisclosure();
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const { data } = useQuery({
    queryKey: [id],
    queryFn: () => getWaitListStats(id)
  });

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  const isPremium = profile?.suscriptionPlan === "PREMIUM" || profile?.suscriptionPlan === "SCALE";

  const generalMutation = useMutation({
    mutationFn: (values: UpdateWaitListValues) => updateWaitList(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id] });
      addToast({ description: "Settings updated", color: "primary" });
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const emailMutation = useMutation({
    mutationFn: (values: UpdateWaitListValues) => updateWaitList(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id] });
      addToast({ description: "Email settings updated", color: "primary" });
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWaitList(id),
    onSuccess: () => {
      posthog.capture("waitlist_deleted", { waitlist_id: id, name: data?.name });
      addToast({ description: "Waitlist deleted", color: "default" });
      router.push("/app/waitlist/dashboard");
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  // General settings form
  const {
    register,
    control: generalControl,
    handleSubmit,
    formState: { errors }
  } = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    values: {
      name: data?.name ?? "",
      isAvailable: data?.isAvailable ?? false,
      isSecurityActive: data?.isSecurityActive ?? false
    }
  });

  const onSubmitGeneral = (formData: GeneralFormValues) => {
    generalMutation.mutate(formData);
  };

  // Email form — auto-save on change
  const { control: emailControl } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    values: {
      sendEmailToNewSignup: data?.sendEmailToNewSignup ?? false
    }
  });

  const sendEmailValue = useWatch({ control: emailControl, name: "sendEmailToNewSignup" });

  useEffect(() => {
    if (data === undefined) return;
    if (sendEmailValue === data.sendEmailToNewSignup) return;

    emailMutation.mutate({ sendEmailToNewSignup: sendEmailValue });
  }, [sendEmailValue]);

  const deletePhrase = `delete ${data?.name}`;

  return (
    <PageComponent className="flex flex-col gap-10 w-5xl">
      <Title description="Configure wait-list general options">Settings</Title>

      {/* General Settings Form */}
      <form onSubmit={handleSubmit(onSubmitGeneral)}>
        <div className="flex flex-col gap-4">
          <Title>General Settings</Title>

          <Card className="border" radius="sm">
            <CardBody className="p-0">
              <FormField
                title="Wait-List name"
                description="Displayed throughout the dashboard."
                className="p-4"
                error={errors?.name}
                isRequired
              >
                <InputComponent maxLength={30} {...register("name")} />
              </FormField>

              <hr />

              <FormField
                title="Availability"
                description="Pause or resume waitlist registrations."
                className="p-4"
              >
                <Controller
                  control={generalControl}
                  name="isAvailable"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <Switch size="sm" isSelected={field.value} onValueChange={field.onChange}>
                        <Type variant="sm">{field.value ? "Active" : "Paused"}</Type>
                      </Switch>
                      {!field.value && (
                        <Type variant="sm" className="text-warning">
                          Your wait-list will be paused. No new registrations will be accepted until
                          you re-enable it.
                        </Type>
                      )}
                    </div>
                  )}
                />
              </FormField>

              <hr />

              <FormField
                title="Fake user's protection"
                description={
                  <>
                    Block temporary and disposable emails with{" "}
                    <Type variant="link">Dymo security services</Type>.
                  </>
                }
                className="p-4"
                isPremiumFeature
              >
                <Controller
                  control={generalControl}
                  name="isSecurityActive"
                  render={({ field }) => (
                    <Switch
                      size="sm"
                      isDisabled={!isPremium}
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    >
                      <Type variant="sm">{field.value ? "Enabled" : "Disabled"}</Type>
                    </Switch>
                  )}
                />
              </FormField>

              <hr />

              <CardFooter className="flex justify-end">
                <Button
                  size="sm"
                  color="primary"
                  className="border"
                  type="submit"
                  isLoading={generalMutation.isPending}
                >
                  Save changes
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </div>
      </form>

      {/* Email Settings — auto-saves on toggle */}
      <div className="flex flex-col gap-4">
        <Title description="Manage email waitlist configuration">Email</Title>

        <Card className="border" radius="sm">
          <CardBody className="p-0">
            <FormField
              title="Send email to new signups"
              description="New signups will receive an email with their referral link and waitlist position."
              className="p-4"
              icon={<EnvelopeIcon className="size-4" />}
              rightChildrenClassName="ml-auto"
            >
              <Controller
                control={emailControl}
                name="sendEmailToNewSignup"
                render={({ field }) => (
                  <Switch
                    size="sm"
                    color="primary"
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  >
                    <Type variant="sm">{field.value ? "Enabled" : "Disabled"}</Type>
                  </Switch>
                )}
              />
            </FormField>
          </CardBody>
        </Card>
      </div>

      {/* Delete Section */}
      <div className="flex flex-col gap-4">
        <Title description="Permanently remove your waitlist and all its data.">
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
                All landing pages connected to this waitlist will stop working. Make sure to update
                them before proceeding.
              </span>
            </div>

            <div className="flex justify-start w-full mt-2">
              <Button
                size="sm"
                color="danger"
                className="text-foreground"
                onPress={confirmModal.onOpen}
              >
                Delete
              </Button>
            </div>
          </div>
        </Alert>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmText("");
          confirmModal.onOpenChange();
        }}
        radius="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. Type <Type variant="code">{deletePhrase}</Type> to
                  confirm.
                </p>
                <InputComponent
                  placeholder={deletePhrase}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={onClose}>
                  Cancel
                </GlobalButton>
                <GlobalButton
                  color="danger"
                  isDisabled={deleteConfirmText !== deletePhrase}
                  onPress={() => deleteMutation.mutate()}
                  isLoading={deleteMutation.isPending}
                >
                  Delete
                </GlobalButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </PageComponent>
  );
}
