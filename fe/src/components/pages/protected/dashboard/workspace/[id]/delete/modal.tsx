"use client";
import { useParams, useSearchParams } from "next/navigation";
import { Link, routing } from "@/i18n/routing";
import { DefaultModal } from "@/components/ui/modal";

type DeleteWorkspaceModalProps = {
  deleteWorkspace: (id: string) => Promise<{
    success: boolean;
    msg: string;
  }>;
  translation: {
    title: string;
    description: string;
    cancelButtonText: string;
    deleteButtonText: string;
    moreDetailsLink: string;
    successMessage: string;
  };
  isIntercepted?: boolean;
};

export function DeleteWorkspaceModal({
  deleteWorkspace,
  translation,
  isIntercepted = false,
}: DeleteWorkspaceModalProps) {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const handleDelete = async () => {
    return await deleteWorkspace(id as string);
  };

  return (
    <DefaultModal
      title={`${translation.title}: ${searchParams.get("name") || ""}`}
      description={
        <>
          {translation.description}{" "}
          <Link
            href={routing.pathnames["/help/workspace/delete"]}
            className="underline"
          >
            {translation.moreDetailsLink}
          </Link>
        </>
      }
      cancel={translation.cancelButtonText}
      submit={translation.deleteButtonText}
      action={handleDelete}
      successMsg={translation.successMessage}
      isIntercepted={isIntercepted}
    />
  );
}
