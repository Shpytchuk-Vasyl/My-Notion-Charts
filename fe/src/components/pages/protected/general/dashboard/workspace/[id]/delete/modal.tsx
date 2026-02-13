import { useTranslations } from "next-intl";
import { deleteWorkspace } from "@/app/[locale]/(protected)/(general)/dashboard/actions";
import { WorkspaceService } from "@/services/workspace";
import { DeleteWorkspaceForm } from "./form";

export function DeleteWorkspaceModal({
  params,
  isIntercepted = false,
}: {
  params: Promise<{ id: string }>;
  isIntercepted?: boolean;
}) {
  const workspace = params.then(({ id }) =>
    WorkspaceService.getWorkspaceById(id, "workspace_name"),
  );

  const t = useTranslations("pages.dashboard.workspace.delete");
  return (
    <DeleteWorkspaceForm
      deleteWorkspace={deleteWorkspace}
      translation={{
        title: t("title"),
        description: t("description"),
        cancelButtonText: t("cancelButtonText"),
        deleteButtonText: t("deleteButtonText"),
        moreDetailsLink: t("moreDetailsLink"),
        successMessage: t("successMessage"),
      }}
      isIntercepted={isIntercepted}
      workspace={workspace}
    />
  );
}
