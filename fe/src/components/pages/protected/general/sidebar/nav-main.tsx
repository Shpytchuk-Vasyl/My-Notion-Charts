"use client";

import {
  BookOpen,
  ChevronRight,
  type LucideIcon,
  Settings2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavItem = {
  titleKey: "documentation" | "settings";
  url: string;
  icon: LucideIcon;
  items: {
    titleKey:
      | "introduction"
      | "getStarted"
      | "tutorials"
      | "changelog"
      | "general"
      | "team"
      | "billing"
      | "limits";
    url: string;
  }[];
};

const getItems = (): NavItem[] => [
  {
    titleKey: "documentation",
    url: "#",
    icon: BookOpen,
    items: [
      {
        titleKey: "introduction",
        url: "#",
      },
      {
        titleKey: "getStarted",
        url: "#",
      },
      {
        titleKey: "tutorials",
        url: "#",
      },
      {
        titleKey: "changelog",
        url: "#",
      },
    ],
  },
  {
    titleKey: "settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        titleKey: "general",
        url: "#",
      },
      {
        titleKey: "team",
        url: "#",
      },
      {
        titleKey: "billing",
        url: "#",
      },
      {
        titleKey: "limits",
        url: "#",
      },
    ],
  },
];

export function NavMain() {
  const items = getItems();
  const t = useTranslations("nav");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("platform")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={`nav-main-${item.titleKey}`}
            asChild
            defaultOpen={false}
          >
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t(item.titleKey)}>
                <a href={item.url}>
                  <item.icon />
                  <span>{t(item.titleKey)}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">{t("toggle")}</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem
                          key={`nav-main-subitem-${subItem.titleKey}`}
                        >
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{t(subItem.titleKey)}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
