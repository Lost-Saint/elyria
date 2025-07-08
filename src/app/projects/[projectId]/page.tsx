import { api, HydrateClient } from '~/trpc/server';
import { ProjectView } from '~/modules/projects/ui/views/project-view';
import { Suspense } from 'react';

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}
const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  void api.messages.getMany.prefetch({ projectId });
  void api.projects.getOne.prefetch({ id: projectId });
  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
