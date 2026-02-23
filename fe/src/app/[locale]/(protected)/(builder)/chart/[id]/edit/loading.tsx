import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Skeleton className="size-full rounded-xl m-4 max-h-[calc(100%-(--spacing(8)))]" />
  );
}
