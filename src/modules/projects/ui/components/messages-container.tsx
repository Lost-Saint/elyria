import { api } from "~/trpc/react";
import { MessageCard } from "./message-card";

interface Props {
  projectId: string;
}

export const MessagesContainer = ({ projectId }: Props) => {
  const [messages] = api.messages.getMany.useSuspenseQuery({
    projectId: projectId,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={false}
              onFragmentClick={() => {
                /*empty */
              }}
              type={message.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
