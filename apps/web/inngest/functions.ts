import { Agent, openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const codeAgent = createAgent({
      name: "Code Agent",
      system:
        "A agent that can write javascript and typescript code. You are a senior developer and you are given a task and you need to write the code to complete the task.",
      model: openai({
        model: "gpt-4o",
      }),
    });

    const { output } = await codeAgent.run(
      event.data.text
    );

    return { output };
  }
);
