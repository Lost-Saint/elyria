import Image from 'next/image';
import { ProjectForm } from '../_components/project-form';

const Page = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image className="hidden md:block" src="/logo.svg" alt="Elyria" width={50} height={50} />
        </div>
        <h1 className="text-center text-2xl font-bold md:text-5xl">Elyria</h1>
        <p className="text-muted-foreground text-center text-lg md:text-xl">
          Create apps and websites with AI
        </p>
        <div className="mx-auto w-full max-w-3xl">
          <ProjectForm />
        </div>
      </section>
    </div>
  );
};

export default Page;
