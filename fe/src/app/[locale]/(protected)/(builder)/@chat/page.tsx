import { NextIntlClientProvider } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  return (
    // <NextIntlClientProvider>
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      side="right"
    >
      <SidebarHeader>"Chat" --- IGNORE ---</SidebarHeader>
      <SidebarContent>"Chat content goes here" --- IGNORE ---</SidebarContent>
      <SidebarFooter>
        "Chart input and submit button goes here" --- IGNORE ---
      </SidebarFooter>
    </Sidebar>
    // </NextIntlClientProvider>
  );
}
