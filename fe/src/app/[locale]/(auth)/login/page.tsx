import { useTranslations } from "next-intl";
import { LoginForm } from "@/pages/auth/login/form";
import { signIn, signInWithGoogle } from "../actions";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  const t = useTranslations("pages.login");

  return (
    <LoginForm
      action={signIn}
      googleAction={signInWithGoogle}
      translation={{
        title: t("title"),
        description: t("description"),
        emailLabel: t("emailLabel"),
        passwordLabel: t("passwordLabel"),
        forgotPasswordText: t("forgotPasswordText"),
        loginButtonText: t("loginButtonText"),
        orContinueWithText: t("orContinueWithText"),
        googleLoginButtonText: t("googleLoginButtonText"),
        signUpPromptText: t("signUpPromptText"),
        signUpLinkText: t("signUpLinkText"),
      }}
    />
  );
}
