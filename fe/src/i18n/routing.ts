import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uk"],
  defaultLocale: "uk",
  pathnames: {
    // public
    "/": "/",

    // Authentication
    "/login": "/login",
    "/signup": "/signup",
    "/forgot-password": "/forgot-password",
    "/verify-email": "/verify-email",
    "/logout": "/logout",

    // Protected
    "/settings": "/settings",
    "/dashboard": "/dashboard",
    "/dashboard/[workspaceId]/delete": "/dashboard/[workspaceId]/delete",
    "/chart/all": "/chart/all",
    "/chart/[chartId]/edit": "/chart/[chartId]/edit",
    "/chart/[chartId]": "/chart/[chartId]",
    "/help": "/help",
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
