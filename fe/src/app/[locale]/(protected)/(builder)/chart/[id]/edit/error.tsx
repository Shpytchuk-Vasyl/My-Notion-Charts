"use client";

import { ViewError } from "@/components/block/chart/view-error";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <ViewError
      error={error.message}
      className="place-self-center my-auto mx-4 p-6"
    />
  );
}
