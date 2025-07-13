'use client';

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

export const ProjectList = () => {
  const { data: projects } = api.projects.getMany.useQuery();

  return (
    <div className="dark:bg-sidebar flex w-full flex-col gap-y-6 rounded-xl border bg-white p-8 sm:gap-y-4">
      <h2 className="text-2xl font-semibold">Saved Projects</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {projects?.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-muted-foreground text-sm">No projects found</p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant="outline"
            className="h-auto w-full justify-start p-4 text-start font-normal"
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4">
                <Image
                  src="/logo.svg"
                  alt="Elyria"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col">
                  <h3 className="truncate font-medium">{project.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
