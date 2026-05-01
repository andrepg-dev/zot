"use client";

import { getEmailTemplates } from "@/actions/email-templates/email-templates.actions";
import { sendEmailToUsersById } from "@/actions/emails/emails.actions";
import GlobalButton from "@/components/global/button";
import GlobalTooltip from "@/components/global/tooltip";
import PrimaryActionButton from "@/components/global/primary-action-button";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import CampaignResultAnimation from "@/components/wait-list/campaign-result-animation";
import CampaignSentAnimation, {
  getAnimationHeight,
  getFramesPerRow
} from "@/components/wait-list/campaign-sent-animation";
import { extractTemplateVariables } from "@/lib/extract-template-variables";
import {
  ArrowUturnLeftIcon,
  PencilIcon,
  PlusIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
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
import React, { useEffect, useMemo, useState } from "react";

export interface CampaignUser {
  _id: string;
  email: string;
  name?: string;
  position?: number;
  referredBy?: string;
  metadata?: Record<string, unknown>;
}

const BASE_FIELDS: Array<{ value: string; label: string }> = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "position", label: "Position" },
  { value: "referredBy", label: "Referred by" },
  { value: "createdAt", label: "Joined at" }
];

const GLOBAL_FIELDS: Array<{ value: string; label: string }> = [
  { value: "globals.waitlistName", label: "waitlistName" }
];

function suggestFieldForVariable(
  variableName: string,
  availableValues: string[]
): string | undefined {
  const lower = variableName.toLowerCase();
  if (availableValues.includes(variableName)) return variableName;
  if (lower === "waitlistname" && availableValues.includes("globals.waitlistName"))
    return "globals.waitlistName";
  if (lower.includes("name") && availableValues.includes("name")) return "name";
  if (lower.includes("email") && availableValues.includes("email")) return "email";
  if (lower.includes("position") && availableValues.includes("position")) return "position";
  if (lower.includes("referr") && availableValues.includes("referredBy")) return "referredBy";
  return undefined;
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

  const metadataFields = useMemo(() => {
    const metaKeys = new Set<string>();
    users.forEach((u) => {
      if (u.metadata) Object.keys(u.metadata).forEach((k) => metaKeys.add(k));
    });
    return Array.from(metaKeys).map((k) => ({
      value: `metadata.${k}`,
      label: `metadata.${k}`
    }));
  }, [users]);

  const availableFields = useMemo(
    () => [...BASE_FIELDS, ...metadataFields, ...GLOBAL_FIELDS],
    [metadataFields]
  );

  const detectedVariables = useMemo(
    () => (selectedTemplate?.code ? extractTemplateVariables(selectedTemplate.code) : []),
    [selectedTemplate?.code]
  );

  type VariableBinding = { mode: "field" | "static"; value: string };
  const [bindings, setBindings] = useState<Record<string, VariableBinding>>({});

  useEffect(() => {
    if (detectedVariables.length === 0) {
      setBindings({});
      return;
    }
    const availableValues = availableFields.map((f) => f.value);
    const suggestion: Record<string, VariableBinding> = {};
    detectedVariables.forEach((v) => {
      const match = suggestFieldForVariable(v.name, availableValues);
      if (match) suggestion[v.name] = { mode: "field", value: match };
    });
    setBindings(suggestion);
  }, [detectedVariables, availableFields]);

  const { mapping, variables } = useMemo(() => {
    const fieldMap: Record<string, string> = {};
    const staticMap: Record<string, unknown> = {};
    Object.entries(bindings).forEach(([variable, binding]) => {
      if (!binding.value) return;
      if (binding.mode === "field") fieldMap[variable] = binding.value;
      else staticMap[variable] = binding.value;
    });
    return { mapping: fieldMap, variables: staticMap };
  }, [bindings]);

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
      sendEmailToUsersById(waitlistId, {
        users: userIds,
        templateId: selectedTemplate?._id,
        mapping: Object.keys(mapping).length > 0 ? mapping : undefined,
        variables: Object.keys(variables).length > 0 ? variables : undefined
      }),
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

                {detectedVariables.length > 0 && (
                  <div className="flex flex-col gap-2 border rounded-sm p-3">
                    <div className="flex flex-col">
                      <Type variant="sm">Variable mapping</Type>
                      <Type variant="sm" className="text-muted-foreground font-normal">
                        Pick the field each variable should read from for every recipient.
                      </Type>
                    </div>

                    <div className="flex flex-col gap-2">
                      {detectedVariables.map((variable) => {
                        const binding = bindings[variable.name];
                        const isStatic = binding?.mode === "static";
                        return (
                          <div
                            key={variable.name}
                            className="flex items-center justify-between gap-2"
                          >
                            <Type variant="sm" className="font-mono">
                              {variable.name}
                            </Type>
                            <div className="flex items-center gap-1">
                              {isStatic ? (
                                <InputComponent
                                  size="sm"
                                  radius="sm"
                                  placeholder="Static value"
                                  className="max-w-[220px]"
                                  value={binding?.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setBindings((prev) => ({
                                      ...prev,
                                      [variable.name]: { mode: "static", value }
                                    }));
                                  }}
                                />
                              ) : (
                                <Select
                                  aria-label={`Field for ${variable.name}`}
                                  placeholder="Select field"
                                  radius="sm"
                                  size="sm"
                                  className="max-w-[220px] min-w-[200px]"
                                  selectedKeys={binding?.value ? [binding.value] : []}
                                  onSelectionChange={(keys) => {
                                    const key = Array.from(keys)[0] as string | undefined;
                                    setBindings((prev) => {
                                      const next = { ...prev };
                                      if (key) next[variable.name] = { mode: "field", value: key };
                                      else delete next[variable.name];
                                      return next;
                                    });
                                  }}
                                >
                                  <SelectSection title="User fields" showDivider>
                                    {BASE_FIELDS.map((field) => (
                                      <SelectItem key={field.value}>{field.label}</SelectItem>
                                    ))}
                                  </SelectSection>
                                  {metadataFields.length > 0 ? (
                                    <SelectSection title="Metadata" showDivider>
                                      {metadataFields.map((field) => (
                                        <SelectItem key={field.value}>{field.label}</SelectItem>
                                      ))}
                                    </SelectSection>
                                  ) : null}
                                  <SelectSection title="Global variables">
                                    {GLOBAL_FIELDS.map((field) => (
                                      <SelectItem key={field.value}>{field.label}</SelectItem>
                                    ))}
                                  </SelectSection>
                                </Select>
                              )}

                              <GlobalTooltip
                                content={isStatic ? "Use a user field" : "Set a static value"}
                              >
                                <Button
                                  size="sm"
                                  radius="sm"
                                  variant="faded"
                                  isIconOnly
                                  aria-label={
                                    isStatic
                                      ? `Switch ${variable.name} to field mode`
                                      : `Edit ${variable.name} as static value`
                                  }
                                  onPress={() => {
                                    setBindings((prev) => {
                                      const current = prev[variable.name];
                                      if (current?.mode === "static") {
                                        const match = suggestFieldForVariable(
                                          variable.name,
                                          availableFields.map((f) => f.value)
                                        );
                                        const next = { ...prev };
                                        if (match) {
                                          next[variable.name] = { mode: "field", value: match };
                                        } else {
                                          delete next[variable.name];
                                        }
                                        return next;
                                      }
                                      return {
                                        ...prev,
                                        [variable.name]: { mode: "static", value: "" }
                                      };
                                    });
                                  }}
                                >
                                  {isStatic ? (
                                    <ArrowUturnLeftIcon className="size-4" />
                                  ) : (
                                    <PencilIcon className="size-4" />
                                  )}
                                </Button>
                              </GlobalTooltip>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedTemplate?.preview && (
                  <div className="rounded-sm border overflow-hidden bg-white max-h-[220px]">
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
