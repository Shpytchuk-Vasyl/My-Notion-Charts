import type { ReactNode } from "react";
import { SiteHeader } from "@/components/block/sidebar/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { locale } = await params;
    redirect({ href: "/login", locale });
    return null;
  }

  return (
    <SidebarProvider className="[--header-height:calc(--spacing(14))] flex flex-col">
      <SiteHeader />
      <div className="flex flex-1">{children}</div>
    </SidebarProvider>
  );
}
