"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/button-submit";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, routing } from "@/i18n/routing";

type LoginFormProps = {
  action: (formData: FormData) => Promise<any>;
  googleAction: () => Promise<any>;
  translation: {
    title: string;
    description: string;
    emailLabel: string;
    passwordLabel: string;
    forgotPasswordText: string;
    loginButtonText: string;
    orContinueWithText: string;
    googleLoginButtonText: string;
    signUpPromptText: string;
    signUpLinkText: string;
  };
};

export function LoginForm({
  action,
  googleAction,
  translation,
}: LoginFormProps) {
  const [state, formAction] = useActionState(
    (_: any, formData: FormData) => action(formData),
    null,
  );

  return (
    <FieldGroup className="p-6 md:p-8">
      <form className="contents" action={formAction} key={state?.timestamp}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{translation.title}</h1>
          <p className="text-muted-foreground text-balance">
            {translation.description}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">{translation.emailLabel}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            defaultValue={state?.formData?.email || ""}
            aria-invalid={!!state?.errors?.email}
            required
          />
          {state?.errors?.email && (
            <FieldError>{state.errors.email[0]}</FieldError>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">
              {translation.passwordLabel}
            </FieldLabel>
            <Link
              href={routing.pathnames["/forgot-password"]}
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              {translation.forgotPasswordText}
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue={state?.formData?.password || ""}
            aria-invalid={!!state?.errors?.password}
            required
          />
          {state?.errors?.password && (
            <FieldError>{state.errors.password[0]}</FieldError>
          )}
        </Field>
        {state?.error && (
          <FieldError className="text-center">{state.error}</FieldError>
        )}

        <SubmitButton>{translation.loginButtonText}</SubmitButton>
      </form>
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
        {translation.orContinueWithText}
      </FieldSeparator>

      <form action={googleAction} className="grid grid-cols-1 gap-4">
        <SubmitButton variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          {translation.googleLoginButtonText}
        </SubmitButton>
      </form>
      <FieldDescription className="text-center">
        {translation.signUpPromptText}{" "}
        <Link href={routing.pathnames["/signup"]}>
          {translation.signUpLinkText}
        </Link>
      </FieldDescription>
    </FieldGroup>
  );
}
