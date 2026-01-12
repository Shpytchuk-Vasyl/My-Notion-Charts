"use client";
import { redirect, routing } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function () {
  const locale = useLocale();
  if (process.env.NODE_ENV === "production") {
    redirect({
      locale,
      href: {
        pathname: routing.pathnames["/logout"],
      },
    });
  }
  return null;
}
