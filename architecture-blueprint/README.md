# Architecture Blueprint

This folder contains a self-contained specification of the architecture used in this project.

## Files

- [ARCHITECTURE.md](./ARCHITECTURE.md) — full blueprint. Drop this file into a new project (or paste it into an LLM context) to reproduce the same Turborepo + NestJS + Next.js + TanStack Query + React Hook Form + Zod architecture.

## How to use it

**With an LLM (new project):**

> Read `ARCHITECTURE.md` and scaffold a new monorepo that follows this exact structure. Then implement the feature `<X>` end-to-end using the four-layer loop in section 5.

**Inside this repo:**

The same document is the canonical reference for how features are built here. When adding a feature, follow section 5 (the end-to-end data flow) and the conventions in section 4.

## Pairing with `CLAUDE.md`

The root `CLAUDE.md` and `apps/client/CLAUDE.md` are the day-to-day operating notes for Claude Code. `ARCHITECTURE.md` is the higher-level blueprint that explains *why* those notes exist and how the layers fit together.
