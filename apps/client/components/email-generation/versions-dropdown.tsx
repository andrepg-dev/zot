"use client";

import type { GenerationVersion } from "@repo/packages/shared/schemas";

import { ClockIcon } from "@heroicons/react/24/outline";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";

import GlobalButton from "@/components/global/button";
import Type from "@/components/type";

/**
 * Retained version history for the open email. Only the newest 20 revisions are
 * kept; picking one loads it into the preview.
 */
export default function VersionsDropdown({
  versions,
  activeSeq,
  onSelect,
  isDisabled
}: {
  versions: GenerationVersion[];
  activeSeq?: number;
  onSelect: (version: GenerationVersion) => void;
  isDisabled?: boolean;
}) {
  if (versions.length === 0) return null;

  return (
    <Dropdown placement="bottom-end" radius="sm">
      <DropdownTrigger>
        <GlobalButton
          isDisabled={isDisabled}
          startContent={<ClockIcon className="size-4" />}
          variant="light"
        >
          {activeSeq ? `Version ${activeSeq}` : "Versions"}
        </GlobalButton>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Email versions"
        onAction={(key) => {
          const picked = versions.find((version) => version._id === String(key));

          if (picked) onSelect(picked);
        }}
      >
        {versions.map((version, index) => (
          <DropdownItem key={version._id} textValue={`Version ${version.seq}`}>
            <div className="flex flex-col">
              <Type variant="h6">
                {`Version ${version.seq}`}
                {index === 0 ? " · latest" : ""}
              </Type>
              <Type className="text-muted-foreground font-normal truncate" variant="sm">
                {version.subject}
              </Type>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
