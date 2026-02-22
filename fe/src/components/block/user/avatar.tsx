"use client";

import { Suspense, use } from "react";
import { AvatarInfo, AvatarInfoSckeleton } from "@/components/ui/avatar-info";
import { useProtectedContext } from "@/pages/protected/context";

export function UserAvatar() {
  return (
    <Suspense fallback={<AvatarInfoSckeleton />}>
      <Avatar />
    </Suspense>
  );
}

const Avatar = () => {
  const { user } = useProtectedContext();
  const resolvedUser = use(user);
  return (
    <AvatarInfo
      title={resolvedUser.name}
      description={resolvedUser.email || ""}
      url={resolvedUser.avatar}
    />
  );
};
