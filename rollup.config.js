import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonJS from "rollup-plugin-commonjs";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      name: "idborm",
      file: pkg.main,
      format: "cjs",
      globals: {
        idb: "idb",
      },
    },
    {
      name: "idborm",
      file: pkg.iife,
      format: "iife",
      globals: {
        idb: "idb",
      },
    },
  ],
  plugins: [
    typescript({
      typescript: require("typescript"),
      tsconfig: "tsconfig.rollup.json",
    }),
    resolve(),
    terser(),
    commonJS({
      include: "node_modules/**",
    }),
  ],
};
