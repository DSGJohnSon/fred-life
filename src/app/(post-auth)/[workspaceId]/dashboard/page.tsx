interface WorkspaceLayoutProps {
  params: { workspaceId: string };
}

async function DashboardPage({ params }: WorkspaceLayoutProps) {
  const { workspaceId } = await params;

  return <div>DashboardPage {workspaceId}</div>;
}

export default DashboardPage;
