"use client";
import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface StreamingMessage {
  type: "message" | "streaming";
  data: any;
}

export function useStreamingMessages(projectId: string) {
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  useEffect(() => {
    if (!projectId) return;

    const connectEventSource = () => {
      const eventSource = new EventSource(`/api/stream?projectId=${projectId}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsStreaming(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as StreamingMessage;

          if (message.type === "streaming") {
            console.log(`[HOOK] Received streaming message with status: ${message.data.status}`);
            
            // Invalidate queries to refresh the messages
            queryClient.invalidateQueries(
              trpc.messages.getMany.queryOptions({ projectId })
            );
            
            // If message is completed or failed, stop streaming
            if (message.data.status === "COMPLETED" || message.data.status === "FAILED") {
              console.log(`[HOOK] Message completed, stopping stream`);
              setIsStreaming(false);
              eventSource.close();
              eventSourceRef.current = null;
            }
          }
        } catch (error) {
          console.error(`[HOOK] Error parsing streaming message:`, error);
        }
      };

      eventSource.onerror = (error) => {
        console.error(`[HOOK] EventSource error:`, error);
        console.log(`[HOOK] EventSource readyState:`, eventSource.readyState);
        
        // Only close and cleanup if not already closed
        if (eventSource.readyState !== EventSource.CLOSED) {
          eventSource.close();
        }
        
        eventSourceRef.current = null;
        setIsStreaming(false);

        // Final refetch to make sure we have the latest data
        setTimeout(() => {
          queryClient.invalidateQueries(
            trpc.messages.getMany.queryOptions({ projectId })
          );
        }, 1000);
      };

      eventSource.addEventListener("close", () => {
        setIsStreaming(false);
        eventSource.close();
        eventSourceRef.current = null;

        // Final refetch to make sure we have the latest data
        setTimeout(() => {
          queryClient.invalidateQueries(
            trpc.messages.getMany.queryOptions({ projectId })
          );
        }, 1000);
      });
    };

    connectEventSource();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setIsStreaming(false);
      }
    };
  }, [projectId, queryClient]);

  return { isStreaming };
}
