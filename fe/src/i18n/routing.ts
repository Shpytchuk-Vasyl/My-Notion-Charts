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

    // Protected
    "/settings": "/settings",
    "/dashboard": "/dashboard",
    "/help": "/help",
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
