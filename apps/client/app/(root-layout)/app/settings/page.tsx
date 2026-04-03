"use client";

import { logout } from "@/actions/auth/logout";
import { getProfile } from "@/actions/auth/profile";
import { deleteAccount, updateUser } from "@/actions/users/users.actions";
import FormField from "@/components/form-field";
import GlobalButton from "@/components/global/button";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
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
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const settingsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters")
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function GeneralSettingsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const confirmModal = useDisclosure();
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const { data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  const updateMutation = useMutation({
    mutationFn: (values: SettingsFormValues) => updateUser(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      addToast({ description: "Profile updated", color: "primary" });
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: async () => {
      addToast({ description: "Account deleted", color: "default" });
      await logout();
      router.push("/login");
    },
    onError: (err) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    values: {
      name: data?.name ?? "",
      lastName: data?.lastName ?? ""
    }
  });

  const deletePhrase = "delete my account";

  return (
    <PageComponent className="flex flex-col gap-10 w-5xl">
      <Title description="Manage your account settings and preferences.">Settings</Title>

      {/* Profile Form */}
      <form onSubmit={handleSubmit((values) => updateMutation.mutate(values))}>
        <div className="flex flex-col gap-4">
          <Title>Account</Title>

          <Card className="border" radius="sm">
            <CardBody className="p-0">
              <FormField
                title="Name"
                description="Your first name displayed on your account."
                className="p-4"
                error={errors?.name}
                isRequired
              >
                <InputComponent maxLength={50} {...register("name")} />
              </FormField>

              <hr />

              <FormField
                title="Last name"
                description="Your last name displayed on your account."
                className="p-4"
                error={errors?.lastName}
                isRequired
              >
                <InputComponent maxLength={50} {...register("lastName")} />
              </FormField>

              <hr />

              <FormField
                title="Email"
                description="Your email address. This cannot be changed."
                className="p-4"
              >
                <InputComponent value={data?.email ?? ""} isDisabled />
              </FormField>

              <hr />

              <CardFooter className="flex justify-end">
                <Button
                  size="sm"
                  color="primary"
                  className="border"
                  type="submit"
                  isLoading={updateMutation.isPending}
                >
                  Save changes
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </div>
      </form>

      {/* Delete Account Section */}
      <div className="flex flex-col gap-4">
        <Title description="Permanently delete your account and all associated data.">
          Delete Account
        </Title>

        <Alert color="danger" variant="faded" classNames={{ iconWrapper: "bg-red-500 mb-auto" }}>
          <div className="flex items-center flex-col gap-1">
            <div className="flex flex-col">
              <Type variant="h6" className="text-white">
                Delete your account
              </Type>
              <span className="text-muted-foreground">
                This will permanently delete your account, all waitlists, email templates, and
                associated data. This action cannot be undone.
              </span>
            </div>

            <div className="flex justify-start w-full mt-2">
              <Button
                size="sm"
                color="danger"
                className="text-foreground"
                onPress={confirmModal.onOpen}
              >
                Delete account
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
              <ModalHeader>Confirm Account Deletion</ModalHeader>
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
