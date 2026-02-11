"use client";

import { ViewError } from "@/components/block/chart/view-error";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <ViewError error={error.message} className="border-none p-0 shadow-none" />
  );
}
