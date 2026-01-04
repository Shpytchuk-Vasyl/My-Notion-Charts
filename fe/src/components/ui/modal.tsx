"use client";
import React, { useActionState, useEffect } from "react";
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
import { routing, useRouter } from "@/i18n/routing";

type ModalProps = {
  action:
    | (() => Promise<{
        success: boolean;
        msg: string;
      }>)
    | ((
        state: any,
        formData: FormData,
      ) => Promise<{
        success: boolean;
        msg: string;
      }>);
  isIntercepted?: boolean;
  children?: React.ReactNode;
  backPath?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  cancel: React.ReactNode;
  submit: React.ReactNode;
  successMsg?: string;
};

export function DefaultModal({
  action,
  isIntercepted = false,
  children = null,
  backPath = routing.pathnames["/dashboard"],
  title,
  description,
  cancel,
  submit,
  successMsg,
}: ModalProps) {
  const router = useRouter();

  const goBack = () => {
    if (isIntercepted) {
      router.back();
    } else {
      // @ts-expect-error
      router.push(backPath);
    }
  };

  const [state, handleAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state) {
      if (!state.success) {
        toast.error(state.msg);
        return;
      }

      if (state.success) {
        toast.success(state.msg || successMsg);
        goBack();
      }
    }
  }, [state]);

  return (
    <Dialog open onOpenChange={goBack}>
      <DialogContent>
        <form action={handleAction} className="contents">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {children}

          <DialogFooter>
            <Button variant="outline" onClick={goBack} disabled={isPending}>
              {cancel}
            </Button>

            <SubmitButton variant="destructive">{submit}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
