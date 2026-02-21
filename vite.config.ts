/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

const dirname = typeof __dirname !== "undefined"
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "chronoscope-react/presets/tailwind": path.resolve(dirname, "src/presets/tailwind/index.ts"),
      "chronoscope-react/presets/bootstrap": path.resolve(dirname, "src/presets/bootstrap/index.ts"),
      "chronoscope-react/presets/unstyled": path.resolve(dirname, "src/presets/unstyled/index.ts"),
      "chronoscope-react/hooks": path.resolve(dirname, "src/hooks/index.ts"),
      "chronoscope-react/utils": path.resolve(dirname, "src/utils/index.ts"),
      "chronoscope-react": path.resolve(dirname, "src/index.ts"),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      include: [
        "src/hooks/*.ts",
        "src/utils/date.ts",
        "src/utils/classnames.ts",
      ],
      exclude: [
        "src/hooks/index.ts",
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
