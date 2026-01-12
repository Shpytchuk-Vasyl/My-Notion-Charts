import { signOut } from "@/app/[locale]/(auth)/actions";

export default async function Page() {
  await signOut();
  return null;
}
