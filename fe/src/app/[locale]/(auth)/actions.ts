"use server";

import { redirect as nextRedirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { redirect, routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const t = await getTranslations("validation");

  const signInSchema = z.object({
    email: z.email(t("email.invalid")),
    password: z.string().min(6, t("password.minSignIn")),
  });

  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validation = signInSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      formData: rawData,
      timestamp: Date.now(),
    };
  }

  const { email, password } = validation.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
      formData: rawData,
      timestamp: Date.now(),
    };
  }

  const locale = await getLocale();
  redirect({
    locale,
    href: routing.pathnames["/dashboard"],
  });
}

export async function signUp(formData: FormData) {
  const t = await getTranslations("validation");

  const signUpSchema = z
    .object({
      email: z.email(t("email.invalid")),
      password: z
        .string()
        .min(8, t("password.minSignUp"))
        .regex(/[A-Z]/, t("password.uppercase"))
        .regex(/[a-z]/, t("password.lowercase"))
        .regex(/[0-9]/, t("password.number")),
      "confirm-password": z.string().min(8, t("confirmPassword.min")),
    })
    .refine((data) => data.password === data["confirm-password"], {
      message: t("confirmPassword.match"),
      path: ["confirm-password"],
    });

  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    "confirm-password": formData.get("confirm-password") as string,
  };

  const validation = signUpSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      formData: rawData,
      timestamp: Date.now(),
    };
  }

  const { email, password } = validation.data;

  const supabase = await createClient();
  const locale = await getLocale();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      error: error.message,
      formData: rawData,
      timestamp: Date.now(),
    };
  }

  redirect({
    locale,
    href: routing.pathnames["/verify-email"],
  });
}

export async function signInWithGoogle() {
  const locale = await getLocale();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect({
      locale,
      href: {
        pathname: routing.pathnames["/login"],
        query: { error: error.message },
      },
    });
    return;
  }

  if (data.url) {
    nextRedirect(data.url);
  }
}

export async function resendVerificationEmail() {
  const t = await getTranslations("pages.verifyEmail");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      success: false,
      msg: t("resendError"),
    };
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: user.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      msg: t("resendError"),
    };
  }

  return {
    success: true,
    msg: t("resendSuccess"),
  };
}
