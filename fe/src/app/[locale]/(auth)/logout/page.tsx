import { signOut } from "@/app/[locale]/(auth)/actions";

export { generateStaticParams } from "@/i18n/static-params";

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await signOut();

  return null;
}
