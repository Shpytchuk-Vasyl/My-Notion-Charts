import { Skeleton } from "@/components/ui/skeleton";

export default function () {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className="aspect-video rounded-xl"
        />
      ))}
    </div>
  );
}
