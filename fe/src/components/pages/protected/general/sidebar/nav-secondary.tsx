"use client";

import { LifeBuoy, type LucideIcon, Send } from "lucide-react";
import type * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type NavItem = {
  titleKey: "support" | "feedback";
  url: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  {
    titleKey: "support",
    url: routing.pathnames["/support"],
    icon: LifeBuoy,
  },
  {
    titleKey: "feedback",
    url: routing.pathnames["/feedback"],
    icon: Send,
  },
];

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const t = useTranslations("nav");

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={`nav-secondary-${item.titleKey}`}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.url as any}>
                  <item.icon />
                  <span>{t(item.titleKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
