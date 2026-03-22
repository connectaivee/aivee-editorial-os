import { notFound } from "next/navigation";
import { IssueWorkspacePage } from "@/components/pages/issue-workspace-page";
import { editorialData } from "@/lib/mock-data";

export default async function IssuePage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { issueId } = await params;
  const issue = editorialData.issues.find((entry) => entry.id === issueId);

  if (!issue) {
    notFound();
  }

  return <IssueWorkspacePage issueId={issueId} />;
}
