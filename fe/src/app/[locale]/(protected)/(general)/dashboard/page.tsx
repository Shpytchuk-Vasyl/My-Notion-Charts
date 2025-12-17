import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton
            key={`skeleton-${index}`}
            className="aspect-video rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
