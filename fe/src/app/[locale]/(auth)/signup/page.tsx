import { useTranslations } from "next-intl";
import { SignupForm } from "@/components/pages/auth/signup/form";
import { signInWithGoogle, signUp } from "../actions";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  const t = useTranslations("pages.signup");

  return (
    <SignupForm
      action={signUp}
      googleAction={signInWithGoogle}
      translation={{
        title: t("title"),
        description: t("description"),
        emailLabel: t("emailLabel"),
        passwordLabel: t("passwordLabel"),
        confirmPasswordLabel: t("confirmPasswordLabel"),
        createAccountButtonText: t("createAccountButtonText"),
        orContinueWithText: t("orContinueWithText"),
        googleSignupButtonText: t("googleSignupButtonText"),
        loginPromptText: t("loginPromptText"),
        loginLinkText: t("loginLinkText"),
      }}
    />
  );
}
