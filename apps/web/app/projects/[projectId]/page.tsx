import ProjectView from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { projectId } = await params;

  if (!projectId) {
    return <div>Project not found</div>;
  }

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: ["messages", projectId],
    queryFn: () => trpc.messages.getMany.queryOptions({ projectId }),
  });

  void queryClient.prefetchQuery({
    queryKey: ["project", projectId],
    queryFn: () => trpc.projects.getOne.queryOptions({ id: projectId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProjectPage;
