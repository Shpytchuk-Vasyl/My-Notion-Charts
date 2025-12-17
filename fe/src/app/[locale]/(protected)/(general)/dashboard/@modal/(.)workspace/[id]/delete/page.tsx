"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { deleteWorkspace } from "./actions";

export default function DeleteWorkspaceModal({ params }: { params: { id: string } }) {
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
          router.back();
          router.refresh();
        }
      } catch (err) {
        setError("Failed to delete workspace");
      }
    });
  };

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workspace</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this workspace? This action cannot be undone.
            You will need to disconnect the integration from Notion Settings manually.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}

        <DialogFooter>
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
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
