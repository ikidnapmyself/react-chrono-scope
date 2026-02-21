import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

const external = ["react", "react-dom", "react/jsx-runtime"];

const input = {
  index: "src/index.ts",
  "hooks/index": "src/hooks/index.ts",
  "utils/index": "src/utils/index.ts",
  "presets/tailwind/index": "src/presets/tailwind/index.ts",
  "presets/bootstrap/index": "src/presets/bootstrap/index.ts",
  "presets/unstyled/index": "src/presets/unstyled/index.ts",
};

export default [
  {
    input,
    output: {
      dir: "dist/esm",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].js",
    },
    external,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        declaration: false,
        declarationMap: false,
        declarationDir: undefined,
        outDir: "dist/esm",
      }),
    ],
  },
  {
    input,
    output: {
      dir: "dist/cjs",
      format: "cjs",
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].js",
      exports: "named",
    },
    external,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.build.json",
        declaration: false,
        declarationMap: false,
        declarationDir: undefined,
        outDir: "dist/cjs",
      }),
    ],
  },
];
