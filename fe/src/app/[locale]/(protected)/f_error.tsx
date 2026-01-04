"use client";
import { redirect, routing } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function () {
  const locale = useLocale();
  redirect({
    locale,
    href: {
      pathname: routing.pathnames["/login"],
    },
  });
  return null;
}
