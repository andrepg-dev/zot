#!/usr/bin/env node
import { execute } from "@oclif/core";
process.env.NODE_ENV ??= "development";
await execute({ dir: import.meta.url, development: true });
