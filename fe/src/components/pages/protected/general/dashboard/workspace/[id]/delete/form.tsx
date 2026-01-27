"use client";
import { Link, routing } from "@/i18n/routing";
import { DefaultModal } from "@/components/ui/modal";
import { type Workspace } from "@/models/workspace";
import { useParams } from "next/navigation";
import { SuspenseSkeleton } from "@/components/ui/skeleton-suspense";

type DeleteWorkspaceFormProps = {
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
  workspace: Promise<Workspace>;
};

export function DeleteWorkspaceForm({
  deleteWorkspace,
  translation,
  isIntercepted = false,
  workspace,
}: DeleteWorkspaceFormProps) {
  const { id } = useParams();
  const handleDelete = () => {
    return deleteWorkspace(id as string);
  };

  return (
    <DefaultModal
      title={
        <>
          {translation.title}: {<Name workspace={workspace} />}
        </>
      }
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

const Name = ({ workspace }: { workspace: Promise<Workspace> }) => {
  return (
    <SuspenseSkeleton
      className="w-40 h-full inline-block"
      afterKey="workspace_name"
      promise={workspace}
    />
  );
};
