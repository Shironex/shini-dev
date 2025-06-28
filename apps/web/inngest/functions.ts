import { Agent, openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";

const SANDBOX_TEMPLATE_ID = "shini-dev-next-js-test";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(SANDBOX_TEMPLATE_ID);
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "Code Agent",
      system:
        "A agent that can write javascript and typescript code. You are a senior developer and you are given a task and you need to write the code to complete the task.",
      model: openai({
        model: "gpt-4o",
      }),
    });

    const { output } = await codeAgent.run(event.data.text);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);
