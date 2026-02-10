import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Skeleton className="aspect-video rounded-xl m-4 max-h-[calc(100%-(--spacing(8)))]" />
  );
}
