'use client';

import { Suspense, useState } from 'react';
import type { Fragment } from '@prisma/client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { MessagesContainer } from '../components/messages-container';
import { ProjectHeader } from '../components/project-header';
import { FragmentWeb } from '../components/fragment-web';
import { CodeIcon, CrownIcon, EyeIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { FileExplorer } from '~/components/file-explorer';
import { AvatarDropdownMenu } from '~/components/user-control';
import Router from 'next/router';
import { signOut } from '~/server/auth/auth-client';

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<'preview' | 'code'>('preview');

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/85581209?v=4&size=64', // optional
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={25} className="flex min-h-0 flex-col">
          <Suspense fallback={<p>Project Loading...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>Loading messages...</p>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full w-full"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as 'preview' | 'code')}
          >
            <div className="flex w-full items-center gap-x-2 border-b p-2">
              <TabsList className="h-8 rounded-md border p-0">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size="sm" variant="default">
                  <Link href="/pricing">
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
                <AvatarDropdownMenu
                  user={user}
                  onLogout={() => signOut()}
                  onNavigate={(path) => Router.push(path)}
                />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as Record<string, string>} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
