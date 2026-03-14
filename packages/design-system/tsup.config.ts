import path from "path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  tsconfig: "tsconfig.build.json",
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    /^@heroui\//,
    /^@heroicons\//,
    "clsx",
    "tailwind-merge",
    "framer-motion",
  ],
  esbuildPlugins: [
    {
      name: "resolve-path-alias",
      setup(build) {
        build.onResolve({ filter: /^@\// }, async (args) => {
          const resolved = await build.resolve(
            args.path.replace(/^@\//, "./"),
            {
              resolveDir: path.resolve(process.cwd(), "src"),
              kind: args.kind,
            },
          );
          if (resolved.errors.length > 0) {
            return { errors: resolved.errors };
          }
          return { path: resolved.path };
        });
      },
    },
  ],
  banner: {
    js: '"use client";',
  },
});
