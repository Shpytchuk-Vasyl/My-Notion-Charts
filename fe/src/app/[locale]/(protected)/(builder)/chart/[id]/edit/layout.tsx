"use client";
import { Fragment } from "react";

import { useSearchParams } from "next/navigation";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const searchParams = useSearchParams();
  const refreshKey = searchParams.get("refresh_preview");

  return (
    <Fragment key={refreshKey}>
      {refreshKey}
      {children}
    </Fragment>
  );
}
