import Sandbox from "@e2b/code-interpreter";
import type { Sandbox as SandboxType } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string): Promise<SandboxType> {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

export async function lastAssistantTextMessageContent(result: AgentResult) {
  const lastMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  if (lastMessageIndex === -1) {
    return undefined;
  }

  const message = result.output[lastMessageIndex] as TextMessage | undefined;

  if (!message) {
    return undefined;
  }

  return message.content
    ? typeof message.content === "string"
      ? message.content
      : message.content
          .map((c) => c.text)
          .join("")
    : undefined;
}
