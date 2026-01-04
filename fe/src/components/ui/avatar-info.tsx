import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface AvatarInfoProps {
  name: string;
  email?: string | null;
  avatar?: string | null;
  avatarSize?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const defaultGetFallback = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0].toLocaleUpperCase())
    .slice(0, 2)
    .join("");

export function AvatarInfo({
  name,
  email,
  avatar,
  avatarSize = "md",
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
        <Avatar className={cn(sizeClasses[avatarSize], "rounded-lg")}>
          <AvatarImage src={avatar ?? undefined} alt={name} />
          <AvatarFallback className="rounded-lg">
            {defaultGetFallback(name)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        {email && <span className="truncate text-xs">{email}</span>}
      </div>
    </>
  );
}

export function AvatarInfoSckeleton({
  avatarSize = "md",
}: Pick<AvatarInfoProps, "avatarSize">) {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  return (
    <>
      <Skeleton className={cn("rounded-lg", sizeClasses[avatarSize])} />
      <div className="grid flex-1 text-left text-sm leading-tight gap-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </>
  );
}
