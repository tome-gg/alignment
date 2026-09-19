import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Vendored assistant-ui/shadcn component registry code — not hand-maintained,
      // updated via `npx assistant-ui update` / `npx shadcn add --overwrite` instead.
      "src/components/assistant-ui/**",
      "src/components/ui/**",
      "src/hooks/use-attachment-src.ts",
      "src/hooks/use-copy-to-clipboard.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
