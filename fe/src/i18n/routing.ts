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

    // Dashboard
    "/dashboard": "/dashboard",
    "/dashboard/chart/new": "/dashboard/chart/new",
    "/dashboard/chart/[id]/delete": "/dashboard/chart/[id]/delete",

    "/dashboard/workspace/[workspaceId]/delete":
      "/dashboard/workspace/[workspaceId]/delete",

    // Charts
    "/chart/all": "/chart/all",
    "/chart/[id]/edit": "/chart/[id]/edit",
    "/chart/[id]": "/chart/[id]",

    "/feedback": "/feedback",
    "/support": "/support",
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
