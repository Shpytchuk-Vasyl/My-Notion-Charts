"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { deleteWorkspace } from "@/app/[locale]/(protected)/(general)/dashboard/@modal/(.)workspace/[id]/delete/actions";

export default function DeleteWorkspacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteWorkspace(params.id);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        setError("Failed to delete workspace");
      }
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Delete Workspace</CardTitle>
          <CardDescription>
            Are you sure you want to delete this workspace? This action cannot be undone.
            You will need to disconnect the integration from Notion Settings manually.
          </CardDescription>
        </CardHeader>
        
        {error && (
          <CardContent>
            <div className="text-sm text-destructive">{error}</div>
          </CardContent>
        )}

        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Workspace"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
