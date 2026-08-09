"use client";

import type { GenerationSkill } from "@repo/packages/shared/schemas";

import { SparklesIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { getGenerationSkills } from "@/actions/ai/generation.actions";
import GlobalButton from "@/components/global/button";
import Type from "@/components/type";

const MAX_SKILLS = 4;

/**
 * Composer control for attaching design skills to a turn. Attaching one loads
 * its full recipe into the request instead of leaving the model to decide
 * whether to fetch it, so the user reliably gets the technique they picked.
 */
export default function SkillsPicker({
  selected,
  onChange,
  isDisabled
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  isDisabled?: boolean;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["generation-skills"],
    queryFn: getGenerationSkills,
    staleTime: 60 * 60 * 1000
  });

  const skills = data ?? [];

  const toggle = (skill: GenerationSkill) => {
    if (selected.includes(skill.name)) {
      onChange(selected.filter((name) => name !== skill.name));

      return;
    }
    if (selected.length >= MAX_SKILLS) return;
    onChange([...selected, skill.name]);
  };

  const techniques = skills.filter((skill) => skill.kind === "technique");
  const fonts = skills.filter((skill) => skill.kind === "font");

  return (
    <Popover placement="top-start" radius="none">
      <PopoverTrigger>
        <GlobalButton
          color={selected.length > 0 ? "primary" : "default"}
          isDisabled={isDisabled}
          isLoading={isPending}
          startContent={<SparklesIcon className="size-4" />}
          variant={selected.length > 0 ? "flat" : "light"}
        >
          {selected.length > 0 ? `${selected.length} skills` : "Skills"}
        </GlobalButton>
      </PopoverTrigger>

      <PopoverContent className="p-0 max-w-sm">
        <div className="flex flex-col gap-3 p-3 w-full">
          <div className="flex flex-col gap-0.5">
            <Type variant="h6">Design skills</Type>
            <Type className="text-muted-foreground font-normal" variant="sm">
              Attach up to {MAX_SKILLS}. Each one is applied to this turn.
            </Type>
          </div>

          {skills.length === 0 ? (
            <Type className="text-muted-foreground">No skills available</Type>
          ) : (
            <>
              <SkillGroup
                label="Techniques"
                selected={selected}
                skills={techniques}
                onToggle={toggle}
              />
              <SkillGroup
                label="Font pairings"
                selected={selected}
                skills={fonts}
                onToggle={toggle}
              />
            </>
          )}

          {selected.length > 0 ? (
            <GlobalButton radius="sm" size="sm" variant="light" onPress={() => onChange([])}>
              Clear all
            </GlobalButton>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SkillGroup({
  label,
  skills,
  selected,
  onToggle
}: {
  label: string;
  skills: GenerationSkill[];
  selected: string[];
  onToggle: (skill: GenerationSkill) => void;
}) {
  if (skills.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <Type className="text-muted-foreground uppercase tracking-wide" variant="sm">
        {label}
      </Type>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => {
          const isActive = selected.includes(skill.name);

          return (
            <Tooltip
              key={skill.name}
              content={
                <div className="max-w-xs p-1">
                  <Type variant="h6">{skill.label}</Type>
                  <Type className="text-muted-foreground font-normal" variant="sm">
                    {skill.summary}
                  </Type>
                </div>
              }
              radius="none"
            >
              <GlobalButton
                color={isActive ? "primary" : "default"}
                variant={isActive ? "solid" : "bordered"}
                onPress={() => onToggle(skill)}
              >
                {skill.label}
              </GlobalButton>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
