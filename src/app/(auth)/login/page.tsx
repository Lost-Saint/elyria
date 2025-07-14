// /app/signin/page.tsx
import { LoginForm } from '~/components/form/LoginForm';
import React from 'react';
import Link from 'next/link';
import { auth } from '~/server/auth';
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          Better Auth Starter
        </Link>
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
