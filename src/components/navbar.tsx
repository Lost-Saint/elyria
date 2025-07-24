'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AvatarDropdownMenu } from './user-control';
import { signOut, useSession } from '~/server/auth/auth-client';
import Router from 'next/router';
import { Button } from './ui/button';

export const NavBar = () => {
  const { data: session, isPending } = useSession();

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/85581209?v=4&size=64', // optional
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-transparent bg-transparent p-4 transition-all duration-200">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Elyria Logo" width={25} height={25} />
          <span className="text-lg font-semibold">Elyria</span>
        </Link>

        {/* Show loading state while checking session */}
        {isPending ? (
          <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
        ) : session?.user ? (
          // Show avatar dropdown for authenticated users
          <AvatarDropdownMenu
            user={user}
            onLogout={() => signOut()}
            onNavigate={(path) => Router.push(path)}
          />
        ) : (
          // Show sign in/up buttons for unauthenticated users
          <div className="flex gap-2">
            <Link href="/register">
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
