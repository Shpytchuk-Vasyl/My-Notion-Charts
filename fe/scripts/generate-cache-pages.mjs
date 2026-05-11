import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CACHE_VALUES = [600, 3600, 21600, 43200, 86400];

const ROUTES = ["src/app/[locale]/(embed)/chart/[id]/view/open"];

for (const route of ROUTES) {
  for (const ttl of CACHE_VALUES) {
    const dir = join(__dirname, "..", route, String(ttl));
    const file = join(dir, "page.tsx");

    mkdirSync(dir, { recursive: true });
    writeFileSync(
      file,
      `export const revalidate = ${ttl};\nexport { generateStaticParams } from "@/i18n/static-params";\nexport { default } from "../page";\n`,
    );

    console.log(`generated: ${route}/${ttl}/page.tsx`);
  }
}
