import { SidebarInset } from "@/components/ui/sidebar";

export default function GeneralLayout({
  children,
  sidebar,
  header,
}: React.PropsWithChildren<{
  sidebar: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <>
      {header}
      <div className="flex flex-1">
        {sidebar}
        <SidebarInset>{children}</SidebarInset>
      </div>
    </>
  );
}
