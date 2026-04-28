import { NextIntlClientProvider } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarChat } from "@/components/block/chat";

export { generateStaticParams } from "@/i18n/static-params";

const WIDTH_VALUE = "24rem";

export default function Page() {
  return (
    // <NextIntlClientProvider>
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
      <SidebarChat
        autoResume={false}
        id={"chat-page"}
        initialMessages={[]}
        isReadonly={false}
      />
      {/* <SidebarHeader>"Chat" --- IGNORE ---</SidebarHeader>
      <SidebarContent>"Chat content goes here" --- IGNORE ---</SidebarContent>
      <SidebarFooter>
        "Chart input and submit button goes here" --- IGNORE ---
      </SidebarFooter> */}
    </Sidebar>
    // </NextIntlClientProvider>
  );
}
