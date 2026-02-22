"use client";

import { useLocale } from "next-intl";
import { redirect, routing } from "@/i18n/routing";

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
