import { Sandbox } from '@e2b/code-interpreter';
import type { AgentResult, TextMessage } from '@inngest/agent-kit';

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === 'assistant',
  );

  if (lastAssistantTextMessageIndex === -1) {
    return undefined;
  }

  const message = result.output[lastAssistantTextMessageIndex] as TextMessage | undefined;

  return message?.content
    ? typeof message.content === 'string'
      ? message.content
      : message.content.map((c) => c.text).join('')
    : undefined;
}
