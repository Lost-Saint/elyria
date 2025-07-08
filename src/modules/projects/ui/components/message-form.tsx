import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Form, FormField } from '~/components/ui/form';
import { api } from '~/trpc/react';

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: 'Value is required' })
    .max(10000, { message: 'Value is too long.' }),
});

export const MessageForm = ({ projectId }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
    },
  });

  const utils = api.useUtils();

  const createdMessage = api.messages.create.useMutation({
    onSuccess: () => {
      form.reset();
      void utils.messages.getMany.invalidate({ projectId });
      // TODO: invalidate usages status
    },
    onError: (error) => {
      // TODO: redierct to pricing page if specific error
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createdMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const isPending = createdMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'bg-sidebar dark:bg-sidebar relative rounded-xl border p-4 pt-1 transition-all',
          isFocused && 'shadow-xs',
          showUsage && 'rounded-t-none',
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="w-full resize-none border-none bg-transparent pt-4 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  void form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex items-end justify-between gap-x-2 pt-2">
          <div className="text-muted-foreground font-mono text-[10px]">
            <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
              <span>&#8984;</span>Enter
            </kbd>
            &nbsp;to submit
          </div>
          <Button
            disabled={isButtonDisabled}
            className={cn('size-8 rounded-full', isButtonDisabled && 'bg-muted-foreground border')}
          >
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <ArrowUpIcon />}
          </Button>
        </div>
      </form>
    </Form>
  );
};
