import { SidebarInset } from "@/components/ui/sidebar";
import { BuilderProvider } from "@/pages/protected/builder/context";
import { getDatabeses } from "../(general)/dashboard/actions";
import { ChatSidebarProvider } from "@/pages/protected/builder/chat/context";
import { ChatSidebarTrigger } from "@/pages/protected/builder/chat/sidebar-trigger";

export default function BuilderLayout({
  children,
  sidebar,
  header,
  chat,
}: React.PropsWithChildren<{
  sidebar: React.ReactNode;
  header: React.ReactNode;
  chat: React.ReactNode;
}>) {
  return (
    <BuilderProvider
      databasesPromise={getDatabeses().then(({ databases }) => databases)}
    >
      {header}
      <div className="flex flex-1">
        {sidebar}
          <SidebarInset>{children}</SidebarInset>
          <ChatSidebarProvider>
            {chat}
            <ChatSidebarTrigger />
          </ChatSidebarProvider>
      </div>
    </BuilderProvider>
  );
}
