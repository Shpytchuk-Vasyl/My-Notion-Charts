import { DeleteWorkspaceModal } from "@/pages/protected/dashboard/workspace/[id]/delete/modal";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <DeleteWorkspaceModal params={params} />;
}
