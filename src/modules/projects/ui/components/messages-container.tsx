import { useEffect, useRef } from 'react';
import { api } from '~/trpc/react';
import { MessageCard } from './message-card';
import { MessageForm } from './message-form';
import type { Fragment } from '@prisma/client';
import { MessageLoading } from './mesaage-loading';

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);
  const [messages] = api.messages.getMany.useSuspenseQuery(
    {
      projectId,
    },
    {
      // TODO: tempery live message
      refetchInterval: 5000,
    },
  );

  useEffect(() => {
    const lastAssistantMessage = messages.findLast((message) => message.role === 'ASSISTANT');
    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastUserMessage = lastMessage?.role === 'USER';

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pt-2 pr-1">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content}
            role={message.role}
            fragment={message.fragment}
            createdAt={message.createdAt}
            isActiveFragment={activeFragment?.id === message.fragment?.id}
            onFragmentClick={() => setActiveFragment(message.fragment)}
            type={message.type}
          />
        ))}
        {isLastUserMessage && <MessageLoading />}
        <div ref={bottomRef} />
      </div>
      <div className="relative p-3 pt-1">
        <div className="to-background pointer-events-none absolute -top-6 right-0 left-0 h-6 bg-gradient-to-b from-transparent" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
