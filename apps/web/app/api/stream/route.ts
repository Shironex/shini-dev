import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return new Response("Missing projectId", { status: 400 });
  }

  const encoder = new TextEncoder();
  let isConnected = true;
  // Start checking from 10 seconds ago to catch any recent messages
  let lastCheck = new Date(Date.now() - 10000);

  const stream = new ReadableStream({
    start(controller) {
      console.log(`[STREAM] Starting stream for project: ${projectId}`);
      
      const sendMessage = (data: any) => {
        if (isConnected) {
          try {
            const message = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(message));
            console.log(`[STREAM] Sent message: ${data.type}`);
          } catch (e) {
            console.error(`[STREAM] Error sending message:`, e);
            isConnected = false;
          }
        }
      };

      const checkForUpdates = async () => {
        try {
          // Don't check if already disconnected
          if (!isConnected) return;
          
          // Check for new or updated messages since last check
          const messages = await prisma.message.findMany({
            where: {
              projectId,
              updatedAt: {
                gt: lastCheck,
              },
            },
            orderBy: {
              updatedAt: "asc",
            },
            include: {
              fragment: true,
            },
          });
          
          if (messages.length > 0) {
            for (const message of messages) {
              if (!isConnected) return; // Double check before sending
              
              sendMessage({
                type: "streaming",
                data: message,
              });
              
              // If message is completed or failed, close the stream
              if (message.status === "COMPLETED" || message.status === "FAILED") {
                isConnected = false;
                try {
                  controller.close();
                } catch (e) {
                  // Controller might already be closed, ignore the error
                  console.log(`[STREAM] Controller already closed`);
                }
                return;
              }
            }
          }

          lastCheck = new Date();
        } catch (error) {
          console.error(`[STREAM] Error checking for updates:`, error);
          if (isConnected) {
            try {
              controller.error(error);
            } catch (e) {
              // Controller might already be closed
            }
            isConnected = false;
          }
        }
      };

      // Start polling
      const pollInterval = setInterval(() => {
        if (isConnected) {
          checkForUpdates();
        } else {
          clearInterval(pollInterval);
        }
      }, 2000);

      // Initial check
      checkForUpdates();

      // Clean up on stream close
      return () => {
        clearInterval(pollInterval);
        isConnected = false;
      };
    },
    cancel() {
      isConnected = false;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}