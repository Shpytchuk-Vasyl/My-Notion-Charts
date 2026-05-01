import { NextIntlClientProvider } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getMessages } from "next-intl/server";
import { BuilderSidebarChat } from "@/pages/protected/builder/chat/builder-chat";
// import dynamic from "next/dynamic";
// import { Skeleton } from "@/components/ui/skeleton";
//todo чогось динамічний імпорт не працює
// const SidebarChat = dynamic(() => import('@/components/block/chat').then((mod) => mod.SidebarChat),
// { loading: () => <Skeleton className="w-full" /> });

export { generateStaticParams } from "@/i18n/static-params";

const WIDTH_VALUE = "24rem";

export default async function Page() {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider
      messages={{
        pages: {
          chart: {
            edit: {
              chat: messages.pages.chart.edit.chat,
              nav: messages.pages.chart.edit.nav,
            },
          },
        },
      }}
    >
      <Sidebar
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
        side="right"
        asideProps={{
          style: {
            "--sidebar-width": WIDTH_VALUE,
          } as React.CSSProperties,
        }}
        WIDTH_MOBILE={WIDTH_VALUE}
      >
        <BuilderSidebarChat />
        {/* <SidebarHeader>"Chat" --- IGNORE ---</SidebarHeader>
      <SidebarContent>"Chat content goes here" --- IGNORE ---</SidebarContent>
      <SidebarFooter>
        "Chart input and submit button goes here" --- IGNORE ---
      </SidebarFooter> */}
      </Sidebar>
    </NextIntlClientProvider>
  );
}
