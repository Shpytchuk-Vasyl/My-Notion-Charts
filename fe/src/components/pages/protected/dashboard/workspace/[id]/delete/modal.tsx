"use client";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/button-submit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, routing, useRouter } from "@/i18n/routing";
import { useFormState } from "react-dom";

type DeleteWorkspaceModalProps = {
  deleteWorkspace: (id: string) => Promise<{
    success: boolean;
    msg?: string;
  }>;
  translation: {
    title: string;
    description: string;
    cancelButtonText: string;
    deleteButtonText: string;
    moreDetailsLink: string;
    successMessage: string;
  };
};

export function DeleteWorkspaceModal({
  deleteWorkspace,
  translation,
}: DeleteWorkspaceModalProps) {
  const router = useRouter();
  const { id } = useParams();

  const goBack = () => {
    window.history.back();
    router.replace(routing.pathnames["/dashboard"]);
  }

  const [state, handleDelete, isPending] = useActionState(async () => {
    return await deleteWorkspace(id as string);
  }, null);

  useEffect(() => {
    if (state?.msg) {
      toast.error(state.msg);
    }

    if (state?.success) {
      toast.success(translation.successMessage);
      goBack();
    }
  }, [state]);

  return (
    <Dialog open onOpenChange={goBack}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translation.title}</DialogTitle>
          <DialogDescription>
            {translation.description}{" "}
            <Link
              href={routing.pathnames["/help/workspace/delete"]}
              className="underline"
            >
              {translation.moreDetailsLink}
            </Link>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={goBack}
            disabled={isPending}
          >
            {translation.cancelButtonText}
          </Button>

          <form action={handleDelete} className="contents">
            <SubmitButton variant="destructive">
              {translation.deleteButtonText}
            </SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
