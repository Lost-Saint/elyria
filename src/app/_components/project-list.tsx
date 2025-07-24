'use client';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { useSession } from '~/server/auth/auth-client';
import { api } from '~/trpc/react';

export const ProjectList = () => {
  const { data: session, isPending } = useSession();

  // Only query projects when we have a session
  const { data: projects } = api.projects.getMany.useQuery(undefined, {
    enabled: !!session?.user.id,
  });

  // Don't render anything while checking session
  if (isPending) {
    return (
      <div className="dark:bg-sidebar flex w-full flex-col gap-y-6 rounded-xl border bg-white p-8 sm:gap-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no session
  if (!session?.user) {
    return null;
  }

  return (
    <div className="dark:bg-sidebar flex w-full flex-col gap-y-6 rounded-xl border bg-white p-8 sm:gap-y-4">
      <h2 className="text-2xl font-semibold">{session.user.name}&apos;s Saved Projects</h2>
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
