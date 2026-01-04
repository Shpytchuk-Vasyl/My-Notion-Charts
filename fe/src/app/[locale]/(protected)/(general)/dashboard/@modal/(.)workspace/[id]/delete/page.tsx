import { useTranslations } from "next-intl";
import { DeleteWorkspaceModal } from "@/pages/protected/dashboard/workspace/[id]/delete/modal";
import { deleteWorkspace } from "../../../../actions";

export { generateStaticParams } from "@/i18n/static-params";

export default function () {
  const t = useTranslations("pages.dashboard.workspace.delete");
  return (
    <DeleteWorkspaceModal
      deleteWorkspace={deleteWorkspace}
      translation={{
        title: t("title"),
        description: t("description"),
        cancelButtonText: t("cancelButtonText"),
        deleteButtonText: t("deleteButtonText"),
        moreDetailsLink: t("moreDetailsLink"),
        successMessage: t("successMessage"),
      }}
      isIntercepted={true}
    />
  );
}
