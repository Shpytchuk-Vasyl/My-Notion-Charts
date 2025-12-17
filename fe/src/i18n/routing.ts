import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uk"],
  defaultLocale: "uk",
  pathnames: {
    // public
    "/": "/",
    "/help/workspace/delete": "/help/workspace/delete",
    "/help": "/help",

    // Authentication
    "/login": "/login",
    "/signup": "/signup",
    "/forgot-password": "/forgot-password",
    "/verify-email": "/verify-email",
    "/logout": "/logout",

    // Protected
    "/settings": "/settings",
    "/dashboard": "/dashboard",
    "/dashboard/workspace/[workspaceId]/delete":
      "/dashboard/workspace/[workspaceId]/delete",
    "/chart/all": "/chart/all",
    "/chart/[chartId]/edit": "/chart/[chartId]/edit",
    "/chart/[chartId]": "/chart/[chartId]",

    "/feedback": "/feedback",
    "/support": "/support",
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
