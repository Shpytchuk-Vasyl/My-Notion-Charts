import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogMedia,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Link } from "@/i18n/routing";
import { Ban } from "lucide-react";
import { useTranslations } from "next-intl";

type ForbiddenPageProps = {
  translationPath?: string;
};

export const ForbiddenPage = ({
  translationPath = "pages.forbidden",
}: ForbiddenPageProps) => {
  useTranslations(translationPath);
  return null;
};

export const ForbiddenModal = ({
  translationPath = "pages.forbidden",
}: ForbiddenPageProps) => {
  const t = useTranslations(translationPath);

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Ban />
          </AlertDialogMedia>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full" variant="outline">
            <Link href="/dashboard">{t("backToDashboard")}</Link>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
