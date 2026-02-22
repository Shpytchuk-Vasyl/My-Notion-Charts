import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    optimizePackageImports: [
      "zod",
      "next-intl",
      "@notionhq/client",
      "radix-ui",
    ],
    authInterrupts: true,
  },
};

export default withNextIntl(nextConfig);
