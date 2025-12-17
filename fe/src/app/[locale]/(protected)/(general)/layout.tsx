import { SidebarInset } from "@/components/ui/sidebar";

export default function GeneralLayout({
  children,
  sidebar,
}: React.PropsWithChildren<{
  sidebar: React.ReactNode;
}>) {
  return (
    <>
      {sidebar}
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
