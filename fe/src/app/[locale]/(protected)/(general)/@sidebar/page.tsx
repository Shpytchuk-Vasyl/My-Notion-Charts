import { NavMain } from "@/components/block/sidebar/nav-main";
import { NavSecondary } from "@/components/block/sidebar/nav-secondary";
import { NavUser } from "@/components/block/sidebar/nav-user";
import { NavWorkspace } from "@/components/block/sidebar/nav-workspace";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavCharts } from "@/components/block/sidebar/nav-charts";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export { generateStaticParams } from "@/i18n/static-params";

export default async function AppSidebar() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      messages={{ pages: { dashboard: messages.pages.dashboard } }}
    >
      <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
        <SidebarHeader>
          <NavWorkspace />
        </SidebarHeader>
        <SidebarContent>
          <NavCharts />
          <NavMain />
          <NavSecondary className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </NextIntlClientProvider>
  );
}
