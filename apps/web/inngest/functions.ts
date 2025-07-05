import {
  Agent,
  openai,
  createAgent,
  createTool,
  createNetwork,
  Tool,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT } from "./constants";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const SANDBOX_TEMPLATE_ID = "shini-dev-next-js-test";

interface AgentState {
  summary: string;
  files: {
    [path: string]: string;
  };
  projectId: string;
}

// Initialize OpenAI client for streaming
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to update streaming message
async function updateStreamingMessage(messageId: string, content: string, status: "STREAMING" | "COMPLETED" | "FAILED") {
  try {
    await prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        status,
      },
    });
  } catch (error) {
    console.error(`[STREAMING] Error updating message ${messageId}:`, error);
  }
}

export const codeAgent = inngest.createFunction(
  { 
    id: "code-agent",
    retries: 0, // Disable retries to prevent multiple executions
  },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const { streamingMessageId } = event.data;
    console.log(`[INNGEST] Starting streaming code agent with streamingMessageId: ${streamingMessageId}, projectId: ${event.data.projectId}`);
    
    // Check if this message already exists and is not in STREAMING state
    const existingMessage = await prisma.message.findUnique({
      where: { id: streamingMessageId }
    });
    
    if (existingMessage && existingMessage.status !== "STREAMING") {
      console.log(`[INNGEST] Message ${streamingMessageId} already completed with status: ${existingMessage.status}`);
      return {
        url: null,
        title: "already-completed",
        summary: "Task already completed",
        files: {},
      };
    }
    
    // Start with initial thinking message
    await updateStreamingMessage(streamingMessageId, "🤔 Analyzing your request and planning the implementation...", "STREAMING");
    
    const sandboxId = await step.run("get-sandbox-id", async () => {
      await updateStreamingMessage(streamingMessageId, "🤔 Analyzing your request and planning the implementation...\n\n🏗️ Setting up development environment...", "STREAMING");
      const sandbox = await Sandbox.create(SANDBOX_TEMPLATE_ID);
      return sandbox.sandboxId;
    });

    console.log(`[INNGEST] Created sandbox: ${sandboxId}`);
    
    // Stream initial planning phase  
    await step.run("stream-planning", async () => {
      console.log(`[INNGEST] Starting planning phase with OpenAI streaming`);
      
      try {
        const planningStream = await openaiClient.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a senior software engineer. The user has requested: "${event.data.text}". 
              
Please start by explaining your understanding of the request and your implementation plan. Be conversational and think out loud. 
Start with "I understand you want to..." and then explain your approach step by step.
Keep this initial response to 2-3 sentences focused on your understanding and high-level plan.`
            }
          ],
          stream: true,
          temperature: 0.1,
        });

        let content = "🤔 Analyzing your request and planning the implementation...\n\n🏗️ Setting up development environment...\n\n💭 ";
        
        for await (const chunk of planningStream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            content += delta;
            console.log(`[INNGEST] Streaming planning content, length: ${content.length}`);
            await updateStreamingMessage(streamingMessageId, content, "STREAMING");
            
            // Add small delay to make streaming visible
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        console.log(`[INNGEST] Planning phase completed, final length: ${content.length}`);
        return content;
      } catch (error) {
        console.error(`[INNGEST] Error in planning phase:`, error);
        const fallbackContent = "🤔 Analyzing your request and planning the implementation...\n\n🏗️ Setting up development environment...\n\n💭 I understand you want to create a landing page. I'll start by setting up the component structure and then implement the various sections with responsive design.";
        await updateStreamingMessage(streamingMessageId, fallbackContent, "STREAMING");
        return fallbackContent;
      }
    });

    const codeAgent = createAgent<AgentState>({
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
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
            const newFiles = await step?.run("createOrUpdateFile", async () => {
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
            console.log(`[INNGEST] Agent response received, length: ${lastAssistantMessageText.length}`);
            
            // Stream the agent's response in real-time
            if (streamingMessageId) {
              const currentMessage = await prisma.message.findUnique({
                where: { id: streamingMessageId }
              });
              
              if (currentMessage) {
                // Only add implementation updates, not duplicate the summary
                if (!lastAssistantMessageText.includes("<task_summary>")) {
                  const newContent = currentMessage.content + "\n\n🔧 " + lastAssistantMessageText;
                  await updateStreamingMessage(streamingMessageId, newContent, "STREAMING");
                }
              }
            }

            if (lastAssistantMessageText.includes("<task_summary>")) {
              console.log(`[INNGEST] Found task summary, updating network state`);
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
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

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      console.log(`[INNGEST] Saving result - isError: ${isError}, streamingMessageId: ${streamingMessageId}`);
      
      if (isError) {
        console.log(`[INNGEST] Error occurred, updating streaming message with error status`);
        if (streamingMessageId) {
          await updateStreamingMessage(streamingMessageId, "❌ Something went wrong. Please try again.", "FAILED");
        }
        return;
      }

      console.log(`[INNGEST] Success - completing streaming message with final result`);
      console.log(`[INNGEST] Summary: ${result.state.data.summary}`);
      console.log(`[INNGEST] Files count: ${Object.keys(result.state.data.files || {}).length}`);
      
      // Stream final completion message
      if (streamingMessageId) {
        const currentMessage = await prisma.message.findUnique({
          where: { id: streamingMessageId }
        });
        
        if (currentMessage) {
          // Add completion status
          const completionContent = currentMessage.content + "\n\n✅ Implementation completed successfully!";
          await updateStreamingMessage(streamingMessageId, completionContent, "STREAMING");
          
          // Brief pause for user to see completion
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Complete with final summary
          await prisma.message.update({
            where: { id: streamingMessageId },
            data: {
              content: result.state.data.summary,
              status: "COMPLETED",
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
          console.log(`[INNGEST] Successfully completed streaming message with fragment`);
        }
      }
    });

    return {
      url: sandboxUrl,
      title: "fragment",
      summary: result.state.data.summary,
      files: result.state.data.files,
    };
  }
);
