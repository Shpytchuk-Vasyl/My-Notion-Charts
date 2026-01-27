"use client";
import { AvatarInfo, AvatarInfoSckeleton } from "@/components/ui/avatar-info";
import { useDashboardContext } from "@/pages/protected/general/dashboard/context";
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
      title={resolvedUser.name}
      description={resolvedUser.email || ""}
      url={resolvedUser.avatar}
    />
  );
};
