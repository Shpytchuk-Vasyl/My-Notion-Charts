"use client";
import { Suspense, use } from "react";
import { Skeleton } from "./skeleton";

type SuspenseSkeletonInnerProps<T> = {
  promise: Promise<T>;
  afterKey?: keyof T;
};

type SuspenseSkeletonProps<T> = React.ComponentProps<"div"> &
  SuspenseSkeletonInnerProps<T>;

const SuspenseSkeleton = <T,>({
  promise,
  afterKey,
  ...props
}: SuspenseSkeletonProps<T>) => {
  return (
    <Suspense fallback={<Skeleton {...props} />}>
      <SuspenseSkeletonInner promise={promise} afterKey={afterKey} />
    </Suspense>
  );
};

const SuspenseSkeletonInner = <T,>({
  promise,
  afterKey,
}: SuspenseSkeletonInnerProps<T>) => {
  const res = use(promise);
  return afterKey ? res[afterKey] : res;
};

export { SuspenseSkeleton };
