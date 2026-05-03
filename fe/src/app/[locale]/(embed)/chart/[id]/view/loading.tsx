import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center h-dvh">
      <Spinner />
    </main>
  );
}
