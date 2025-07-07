"use client";

import { api } from "~/trpc/react";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const projectQuery = api.projects.getOne.useSuspenseQuery({
    id: projectId,
  });
  const messagesQuery = api.messages.getMany.useSuspenseQuery({
    projectId: projectId,
  });

  return (
    <div>
      <pre>{JSON.stringify(projectQuery, null, 2)}</pre>
      <pre>{JSON.stringify(messagesQuery, null, 2)}</pre>
    </div>
  );
};
