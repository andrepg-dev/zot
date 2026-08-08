"use client";

import Type from "@/components/type";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import type { GenerationVersion } from "@repo/packages/shared/schemas";

/**
 * Retained version history for the open email. Only the newest 20 revisions are
 * kept; picking one loads it into the preview.
 */
export default function VersionsDropdown({
  versions,
  activeSeq,
  onSelect,
  isDisabled,
}: {
  versions: GenerationVersion[];
  activeSeq?: number;
  onSelect: (version: GenerationVersion) => void;
  isDisabled?: boolean;
}) {
  if (versions.length === 0) return null;

  return (
    <Dropdown radius="sm" placement="bottom-end">
      <DropdownTrigger>
        <Button
          size="sm"
          radius="sm"
          variant="light"
          startContent={<ClockIcon className="size-4" />}
          isDisabled={isDisabled}
        >
          {activeSeq ? `Version ${activeSeq}` : "Versions"}
        </Button>
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
              <Type variant="sm" className="text-muted-foreground font-normal truncate">
                {version.subject}
              </Type>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
