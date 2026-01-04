"use client";
import { AvatarInfo, AvatarInfoSckeleton } from "@/components/ui/avatar-info";
import { useDashboardContext } from "@/pages/protected/dashboard/context";
import { Suspense, use } from "react";

export function UserAvatar() {
  return (
    <Suspense fallback={<AvatarInfoSckeleton />}>
      <Avatar />
    </Suspense>
  );
}

const Avatar = () => {
  const { user } = useDashboardContext();
  const resolvedUser = use(user);
  return (
    <AvatarInfo
      name={resolvedUser.name}
      email={resolvedUser.email || ""}
      avatar={resolvedUser.avatar}
    />
  );
};
