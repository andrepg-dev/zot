import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundation/Design Tokens",
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  }
};

export default meta;

const ColorSwatch = ({ name, cssVar, value }: { name: string; cssVar: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-10 h-10 rounded-md border border-white/10 flex-shrink-0"
      style={{ background: value }}
    />
    <div className="flex flex-col">
      <span className="text-sm font-medium text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground font-mono">{cssVar}</span>
    </div>
  </div>
);

export const Colors: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Core Colors</h3>
        <div className="grid grid-cols-3 gap-4">
          <ColorSwatch name="Background" cssVar="--background" value="var(--background)" />
          <ColorSwatch name="Foreground" cssVar="--foreground" value="var(--foreground)" />
          <ColorSwatch name="Card" cssVar="--card" value="var(--card)" />
          <ColorSwatch name="Popover" cssVar="--popover" value="var(--popover)" />
          <ColorSwatch name="Muted" cssVar="--muted" value="var(--muted)" />
          <ColorSwatch name="Muted Foreground" cssVar="--muted-foreground" value="var(--muted-foreground)" />
          <ColorSwatch name="Accent" cssVar="--accent" value="var(--accent)" />
          <ColorSwatch name="Secondary" cssVar="--secondary" value="var(--secondary)" />
          <ColorSwatch name="Destructive" cssVar="--destructive" value="var(--destructive)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Borders & Inputs</h3>
        <div className="grid grid-cols-3 gap-4">
          <ColorSwatch name="Border" cssVar="--border" value="var(--border)" />
          <ColorSwatch name="Input" cssVar="--input" value="var(--input)" />
          <ColorSwatch name="Ring" cssVar="--ring" value="var(--ring)" />
          <ColorSwatch name="Sidebar" cssVar="--sidebar" value="var(--sidebar)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Chart Colors</h3>
        <div className="grid grid-cols-5 gap-4">
          <ColorSwatch name="Chart 1" cssVar="--chart-1" value="var(--chart-1)" />
          <ColorSwatch name="Chart 2" cssVar="--chart-2" value="var(--chart-2)" />
          <ColorSwatch name="Chart 3" cssVar="--chart-3" value="var(--chart-3)" />
          <ColorSwatch name="Chart 4" cssVar="--chart-4" value="var(--chart-4)" />
          <ColorSwatch name="Chart 5" cssVar="--chart-5" value="var(--chart-5)" />
        </div>
      </div>
    </div>
  )
};

export const Typography: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Type Scale</h3>
        <div className="flex flex-col gap-3 border border-white/10 rounded-lg p-6">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">h1</span>
            <span className="text-xl font-normal">The quick brown fox - text-xl</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">h2</span>
            <span className="text-lg font-medium">The quick brown fox - text-lg medium</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">h3</span>
            <span className="text-lg font-normal">The quick brown fox - text-lg</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">h4</span>
            <span className="text-base font-medium">The quick brown fox - text-base medium</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">h5</span>
            <span className="text-base font-normal">The quick brown fox - text-base</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">h6</span>
            <span className="text-sm font-medium">The quick brown fox - text-sm medium</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">base</span>
            <span className="text-sm">The quick brown fox - text-sm</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">sm</span>
            <span className="text-xs">The quick brown fox - text-xs</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Font Families</h3>
        <div className="flex flex-col gap-3 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">Sans</span>
            <span className="font-sans text-sm">Inter / System UI - ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0">Mono</span>
            <span className="font-mono text-sm">Fira Code / Monospace - ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export const Spacing: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-medium text-foreground">Border Radius</h3>
      <div className="flex gap-6 items-end">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-primary/30 border border-primary/50 rounded-sm" />
          <span className="text-xs text-muted-foreground">sm (7px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-primary/30 border border-primary/50 rounded-default" />
          <span className="text-xs text-muted-foreground">default (8px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-primary/30 border border-primary/50 rounded-lg" />
          <span className="text-xs text-muted-foreground">lg</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-primary/30 border border-primary/50 rounded-full" />
          <span className="text-xs text-muted-foreground">full</span>
        </div>
      </div>
    </div>
  )
};
