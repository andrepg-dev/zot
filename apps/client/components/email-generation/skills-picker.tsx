"use client";

import { getGenerationSkills } from "@/actions/ai/generation.actions";
import Type from "@/components/type";
import { SparklesIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import type { GenerationSkill } from "@repo/packages/shared/schemas";
import { useQuery } from "@tanstack/react-query";

const MAX_SKILLS = 4;

/**
 * Composer control for attaching design skills to a turn. Attaching one loads
 * its full recipe into the request instead of leaving the model to decide
 * whether to fetch it, so the user reliably gets the technique they picked.
 */
export default function SkillsPicker({
  selected,
  onChange,
  isDisabled,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  isDisabled?: boolean;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["generation-skills"],
    queryFn: getGenerationSkills,
    staleTime: 60 * 60 * 1000,
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
    <Popover radius="none" placement="top-start">
      <PopoverTrigger>
        <Button
          size="sm"
          radius="sm"
          variant={selected.length > 0 ? "flat" : "light"}
          color={selected.length > 0 ? "primary" : "default"}
          startContent={<SparklesIcon className="size-4" />}
          isDisabled={isDisabled}
          isLoading={isPending}
        >
          {selected.length > 0 ? `${selected.length} skills` : "Skills"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 max-w-sm">
        <div className="flex flex-col gap-3 p-3 w-full">
          <div className="flex flex-col gap-0.5">
            <Type variant="h6">Design skills</Type>
            <Type variant="sm" className="text-muted-foreground font-normal">
              Attach up to {MAX_SKILLS}. Each one is applied to this turn.
            </Type>
          </div>

          {skills.length === 0 ? (
            <Type className="text-muted-foreground">No skills available</Type>
          ) : (
            <>
              <SkillGroup label="Techniques" skills={techniques} selected={selected} onToggle={toggle} />
              <SkillGroup label="Font pairings" skills={fonts} selected={selected} onToggle={toggle} />
            </>
          )}

          {selected.length > 0 ? (
            <Button size="sm" radius="sm" variant="light" onPress={() => onChange([])}>
              Clear all
            </Button>
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
  onToggle,
}: {
  label: string;
  skills: GenerationSkill[];
  selected: string[];
  onToggle: (skill: GenerationSkill) => void;
}) {
  if (skills.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <Type variant="sm" className="text-muted-foreground uppercase tracking-wide">
        {label}
      </Type>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => {
          const isActive = selected.includes(skill.name);
          return (
            <Tooltip
              key={skill.name}
              radius="none"
              content={
                <div className="max-w-xs p-1">
                  <Type variant="h6">{skill.label}</Type>
                  <Type variant="sm" className="text-muted-foreground font-normal">
                    {skill.summary}
                  </Type>
                </div>
              }
            >
              <Button
                size="sm"
                radius="sm"
                variant={isActive ? "solid" : "bordered"}
                color={isActive ? "primary" : "default"}
                onPress={() => onToggle(skill)}
              >
                {skill.label}
              </Button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
