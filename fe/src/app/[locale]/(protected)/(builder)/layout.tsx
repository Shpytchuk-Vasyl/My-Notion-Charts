import { SidebarInset } from "@/components/ui/sidebar";
import { BuilderProvider } from "@/pages/protected/builder/context";
import { getDatabeses } from "../(general)/dashboard/actions";

export default function GeneralLayout({
  children,
  sidebar,
}: React.PropsWithChildren<{
  sidebar: React.ReactNode;
}>) {
  return (
    <BuilderProvider
      databasesPromise={getDatabeses().then(({ databases }) => databases)}
    >
      {sidebar}
      <SidebarInset>{children}</SidebarInset>
    </BuilderProvider>
  );
}
