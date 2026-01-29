export { generateStaticParams } from "@/i18n/static-params";

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return "test";
}
