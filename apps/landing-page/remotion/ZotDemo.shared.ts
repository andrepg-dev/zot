export const VIDEO_CONFIG = {
  fps: 30,
  durationInFrames: 360,
  width: 1280,
  height: 720,
} as const;

export type CodeToken = {
  content: string;
  color?: string;
  fontStyle?: number;
};

export type CodeTokenLines = CodeToken[][];

export const DEMO_CODE_SNIPPET = `import { useAddUser } from "@zot-core/sdk/react";

export function Waitlist() {
  const { addUser, isPending } = useAddUser();

  return (
    <form action={addUser}>
      <input name="email" type="email" required />
      <button disabled={isPending}>Join</button>
    </form>
  );
}
`;

export interface ZotDemoProps {
  tokens: CodeTokenLines;
}
