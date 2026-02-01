import { SidebarInset } from "@/components/ui/sidebar";
import { BuilderProvider } from "@/pages/protected/builder/context";
import { getDatabeses } from "../(general)/dashboard/actions";

export default function GeneralLayout({
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
        {chat}
      </div>
    </BuilderProvider>
  );
}
