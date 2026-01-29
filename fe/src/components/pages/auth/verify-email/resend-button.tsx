"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/ui/button-submit";

type ResendButtonProps = {
  resendAction: () => Promise<{ success: boolean; msg: string }>;
  resendButtonText: string;
};

const RESEND_INTERVAL = 4;

export function ResendButton({
  resendAction,
  resendButtonText,
}: ResendButtonProps) {
  const [state, action] = useActionState(resendAction, null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const time = parseInt(buttonRef.current!.textContent!, 10);
      if (time > 0) {
        buttonRef.current!.textContent = (time - 1).toString();
      } else {
        buttonRef.current!.textContent = resendButtonText;
        buttonRef.current!.disabled = false;
        return clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state]);

  useEffect(() => {
    if (state) {
      toast[state.success ? "success" : "error"](state.msg);
    }
  }, [state]);

  return (
    <form action={action} className="inline">
      <SubmitButton variant="link" asChild>
        <button ref={buttonRef} disabled={true}>
          {RESEND_INTERVAL}
        </button>
      </SubmitButton>
    </form>
  );
}
