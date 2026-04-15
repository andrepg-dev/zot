"use client";

import { getEmailTemplates } from "@/actions/email-templates/email-templates.actions";
import { sendEmailToUsersById } from "@/actions/emails/emails.actions";
import GlobalButton from "@/components/global/button";
import PrimaryActionButton from "@/components/global/primary-action-button";
import CampaignResultAnimation from "@/components/wait-list/campaign-result-animation";
import CampaignSentAnimation, {
  getAnimationHeight,
  getFramesPerRow
} from "@/components/wait-list/campaign-sent-animation";
import { PlusIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@heroui/react";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { Player } from "@remotion/player";
import type { EmailTemplate } from "@repo/packages/shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";

export interface CampaignUser {
  _id: string;
  email: string;
}

interface SendCampaignModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  waitlistId: string;
  users: CampaignUser[];
  onSent?: (userIds: string[]) => void;
}

export default function SendCampaignModal({
  isOpen,
  onOpenChange,
  waitlistId,
  users,
  onSent
}: SendCampaignModalProps) {
  const queryClient = useQueryClient();
  const [animationPhase, setAnimationPhase] = useState<"idle" | "list" | "result">("idle");
  const [sentEmails, setSentEmails] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const { data: templates } = useQuery({
    queryKey: ["email-templates"],
    queryFn: getEmailTemplates,
    enabled: isOpen
  });

  const selectedTemplate = React.useMemo(
    () => ((templates ?? []) as EmailTemplate[]).find((t) => t._id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  const displayCount = Math.min(sentEmails.length, 50);
  const framesPerRow = getFramesPerRow(displayCount);
  const animationFrames = 10 + displayCount * framesPerRow + 40;
  const animationDurationMs = (animationFrames / 30) * 1000;

  useEffect(() => {
    if (animationPhase !== "list") return;
    const timer = setTimeout(() => {
      setAnimationPhase("result");
    }, animationDurationMs);
    return () => clearTimeout(timer);
  }, [animationPhase, animationDurationMs]);

  const {
    mutate: sendCampaign,
    isPending: isSending,
    isSuccess: isSendSuccess,
    isError: isSendError,
    error: sendError,
    reset: resetSend
  } = useMutation({
    mutationFn: (userIds: string[]) =>
      sendEmailToUsersById(waitlistId, { users: userIds, templateId: selectedTemplate?._id }),
    onSuccess: (_data, userIds) => {
      queryClient.invalidateQueries({ queryKey: [waitlistId, "email-records"] });
      queryClient.invalidateQueries({ queryKey: [waitlistId, "email-records-list"] });
      queryClient.invalidateQueries({ queryKey: [waitlistId, "audience"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      posthog.capture("email_campaign_sent", { waitlist_id: waitlistId, quantity: userIds.length });
      onSent?.(userIds);
    }
  });

  function handleClose() {
    setAnimationPhase("idle");
    resetSend();
    onOpenChange(false);
  }

  function handleSend() {
    const ids = users.map((u) => u._id);
    setSentEmails(users.map((u) => u.email));
    setAnimationPhase("list");
    sendCampaign(ids);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      radius="sm"
      isDismissable={animationPhase === "idle"}
      hideCloseButton={animationPhase !== "idle"}
    >
      <ModalContent>
        {() => {
          if (animationPhase === "list") {
            return (
              <ModalBody className="p-0 overflow-hidden">
                <Player
                  component={CampaignSentAnimation}
                  inputProps={{ emails: sentEmails }}
                  durationInFrames={animationFrames}
                  fps={30}
                  compositionWidth={460}
                  compositionHeight={getAnimationHeight(sentEmails.length)}
                  autoPlay
                  style={{ width: "100%", height: getAnimationHeight(sentEmails.length) }}
                />
              </ModalBody>
            );
          }

          if (animationPhase === "result") {
            const status = isSendSuccess ? "success" : isSendError ? "error" : "pending";

            return (
              <>
                <ModalBody className="p-0 overflow-hidden">
                  <Player
                    key={status}
                    component={CampaignResultAnimation}
                    inputProps={{
                      status,
                      message: isSendSuccess
                        ? `${sentEmails.length} emails dispatched`
                        : isSendError
                          ? (sendError?.message ?? "An error occurred")
                          : "Waiting for server response..."
                    }}
                    durationInFrames={9000}
                    fps={30}
                    compositionWidth={460}
                    compositionHeight={160}
                    autoPlay
                    loop={isSending}
                    style={{ width: "100%", height: 160 }}
                  />
                </ModalBody>
                {(isSendSuccess || isSendError) && (
                  <ModalFooter className="justify-center">
                    <GlobalButton variant="light" onPress={handleClose}>
                      Close
                    </GlobalButton>
                  </ModalFooter>
                )}
              </>
            );
          }

          return (
            <>
              <ModalHeader>Send Email Campaign</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  You are about to send an email campaign to <strong>{users.length}</strong>{" "}
                  selected user{users.length !== 1 ? "s" : ""}. Do you want to continue?
                </p>

                <Select
                  label="Email template"
                  placeholder="Select a template"
                  radius="sm"
                  size="sm"
                  selectedKeys={selectedTemplateId ? [selectedTemplateId] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    if (key === "create-new") {
                      window.open("/app/emails/templates", "_blank");
                      return;
                    }
                    setSelectedTemplateId(key ?? "");
                  }}
                >
                  <SelectSection title="Templates">
                    {((templates ?? []) as EmailTemplate[]).map((template) => (
                      <SelectItem key={template._id}>{template.alias}</SelectItem>
                    ))}
                  </SelectSection>
                  <SelectSection title="">
                    <SelectItem key="create-new" startContent={<PlusIcon className="size-4" />}>
                      Create new template
                    </SelectItem>
                  </SelectSection>
                </Select>

                {selectedTemplate?.preview && (
                  <div className="rounded-sm border overflow-hidden bg-white">
                    <Image
                      src={selectedTemplate.preview}
                      alt={selectedTemplate.alias}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <GlobalButton variant="light" onPress={handleClose}>
                  Cancel
                </GlobalButton>
                <PrimaryActionButton
                  startContent={<RocketLaunchIcon className="size-4" />}
                  isDisabled={users.length === 0 || !selectedTemplateId}
                  isLoading={isSending}
                  onPress={handleSend}
                >
                  Send to {users.length} user{users.length !== 1 ? "s" : ""}
                </PrimaryActionButton>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
