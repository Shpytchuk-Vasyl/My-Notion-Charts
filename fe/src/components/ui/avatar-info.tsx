import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface AvatarInfoProps {
  title: string;
  description?: string | null;
  url?: string | null;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const defaultGetFallback = (title: string) =>
  title
    .split(" ")
    .map((n) => n[0].toLocaleUpperCase())
    .slice(0, 2)
    .join("");

export function AvatarInfo({
  title,
  description,
  url,
  size = "md",
  icon = undefined,
}: AvatarInfoProps) {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  return (
    <>
      {icon ?? (
        <Avatar className={cn(sizeClasses[size], "rounded-lg")}>
          <AvatarImage src={url ?? undefined} alt={title} />
          <AvatarFallback className="rounded-lg">
            {defaultGetFallback(title)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{title}</span>
        {description && <span className="truncate text-xs">{description}</span>}
      </div>
    </>
  );
}

export function AvatarInfoSckeleton({
  size = "md",
}: Pick<AvatarInfoProps, "size">) {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  return (
    <>
      <Skeleton className={cn("rounded-lg", sizeClasses[size])} />
      <div className="grid flex-1 text-left text-sm leading-tight gap-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </>
  );
}
