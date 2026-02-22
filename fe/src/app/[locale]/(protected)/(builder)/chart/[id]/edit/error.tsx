"use client";

import { ChartErrorView } from "@/components/block/chart/error-view";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <ChartErrorView
      error={error.message}
      className="place-self-center my-auto mx-4 p-6"
    />
  );
}
