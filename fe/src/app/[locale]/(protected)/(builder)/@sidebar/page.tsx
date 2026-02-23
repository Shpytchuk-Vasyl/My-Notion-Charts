import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ChartConfigurationAccordion } from "@/pages/protected/builder/sidebar/chart-configuration";
import { NavUser } from "@/pages/protected/general/sidebar/nav-user";
import { NavWorkspace } from "@/pages/protected/general/sidebar/nav-workspace";

export { generateStaticParams } from "@/i18n/static-params";

export default async function AppSidebar() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      messages={{
        nav: messages.nav,
        pages: { chart: { edit: { nav: messages.pages.chart.edit.nav } } },
        tours: {
          chart: { edit: messages.tours.chart.edit },
          nav: messages.tours.nav,
        },
      }}
    >
      <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
        <SidebarHeader>
          <NavWorkspace />
        </SidebarHeader>
        <SidebarContent>
          <ChartConfigurationAccordion />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </NextIntlClientProvider>
  );
}
