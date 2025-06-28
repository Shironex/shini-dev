import {
  Agent,
  openai,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT } from "./constants";
import { prisma } from "@/lib/db";

const SANDBOX_TEMPLATE_ID = "shini-dev-next-js-test";

export const codeAgent = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(SANDBOX_TEMPLATE_ID);
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "Code Agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4o",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "A tool that can run terminal commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return step?.run("terminal", async () => {
              const buffer = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffer.stdout += data;
                  },
                  onStderr: (data) => {
                    buffer.stderr += data;
                  },
                });

                return result.stdout;
              } catch (error) {
                console.error("Error running command", error);
                console.log(buffer);
                return `Error running command, ${error}`;
              }
            });
          },
        }),

        createTool({
          name: "createOrUpdateFiles",
          description: "A tool that can create or update a file",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = step?.run("createOrUpdateFile", async () => {
              const updatedFiles = network.state.data.files || {};

              try {
                const sandbox = await getSandbox(sandboxId);

                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }

                return updatedFiles;
              } catch (error) {
                console.error("Error creating or updating file", error);
                return `Error creating or updating file, ${error}`;
              }
            });

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        createTool({
          name: "readFiles",
          description: "A tool that can read files",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step, network }) => {
            return step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);

                const contents: { path: string; content: string }[] = [];

                for (const file of files) {
                  const fileContent = await sandbox.files.read(file);
                  contents.push({ path: file, content: fileContent });
                }

                return JSON.stringify(contents);
              } catch (error) {
                console.error("Error reading files", error);
                return `Error reading files, ${error}`;
              }
            });
          },
        }),
      ],

      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            await lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork({
      name: "coding-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        //? check if agent has completed the task if there is a summary the agent has completed the task if not return the agent to continueń
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(event.data.text);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              title: "fragment",
              summary: result.state.data.summary,
              files: result.state.data.files,
              sandboxUrl,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "fragment",
      summary: result.state.data.summary,
      files: result.state.data.files,
    };
  }
);
