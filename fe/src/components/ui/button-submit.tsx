"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { Spinner } from "./spinner";

type SubmitButtonProps = React.ComponentProps<typeof Button>;

export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      disabled={pending}
      aria-disabled={pending}
      {...props}
    >
      {pending ? <Spinner /> : children}
    </Button>
  );
}
