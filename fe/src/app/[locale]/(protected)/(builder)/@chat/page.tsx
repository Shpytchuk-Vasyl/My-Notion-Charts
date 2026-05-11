import { NextIntlClientProvider } from "next-intl";
import { Sidebar } from "@/components/ui/sidebar";
import { getMessages } from "next-intl/server";
import { BuilderSidebarChat } from "@/pages/protected/builder/chat/builder-chat";

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
      </Sidebar>
    </NextIntlClientProvider>
  );
}
