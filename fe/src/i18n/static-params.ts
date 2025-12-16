import { routing } from "./routing";

/**
 * Generates static params for all locales
 * Use this in pages to enable static generation with i18n
 *
 * @example
 * ```tsx
 * export { generateStaticParams } from "@/i18n/static-params";
 *
 * export default function Page() {
 *   return <div>My page</div>;
 * }
 * ```
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Type-safe locale parameter
 */
export type LocaleParams = {
  locale: (typeof routing.locales)[number];
};
