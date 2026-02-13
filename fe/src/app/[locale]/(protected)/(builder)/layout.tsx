import { SidebarInset } from "@/components/ui/sidebar";
import { ChatSidebarProvider } from "@/pages/protected/builder/chat/context";
import { ChatSidebarTrigger } from "@/pages/protected/builder/chat/sidebar-trigger";
import { BuilderProvider } from "@/pages/protected/builder/context";

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
    <BuilderProvider>
      {header}
      <div className="flex flex-1">
        {sidebar}
        <SidebarInset>{children}</SidebarInset>
        <ChatSidebarProvider defaultOpen={false}>
          {chat}
          <ChatSidebarTrigger />
        </ChatSidebarProvider>
      </div>
    </BuilderProvider>
  );
}
