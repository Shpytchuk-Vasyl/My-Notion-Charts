import { useTranslations } from "next-intl";
import { FieldGroup } from "@/components/ui/field";
import { Link, routing } from "@/i18n/routing";
import { ResendButton } from "@/pages/auth/verify-email/resend-button";
import { resendVerificationEmail } from "../actions";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  const t = useTranslations("pages.verifyEmail");

  return (
    <FieldGroup className="p-6 md:p-8 flex flex-col items-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-primary"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-balance max-w-md">
          {t("description")}
        </p>
      </div>

      <div className="w-full">
        <span className="text-sm text-muted-foreground">{t("resendText")}</span>
        <ResendButton
          resendAction={resendVerificationEmail}
          resendButtonText={t("resendButton")}
        />
      </div>

      <Link href={routing.pathnames["/login"]}>{t("backToLogin")}</Link>
    </FieldGroup>
  );
}
