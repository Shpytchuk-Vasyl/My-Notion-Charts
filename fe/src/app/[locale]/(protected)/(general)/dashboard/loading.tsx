import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="inline-grid auto-rows-min gap-4 md:grid-cols-3 p-4 max-h-[calc(100%-(--spacing(8)))]">
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton
          key={`loading-skeleton-${index}`}
          className="aspect-video rounded-xl"
        />
      ))}
    </div>
  );
}
