import { DeleteWorkspaceModal } from "@/pages/protected/general/dashboard/workspace/[id]/delete/modal";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <DeleteWorkspaceModal params={params} />;
}
