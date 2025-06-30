"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MessageCard from "./message-card";
import MessageForm from "./message-form";
import { Fragment } from "@/generated/prisma";
import MessageLoading from "./message-loading";

interface MessagesContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment) => void;
}

const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: MessagesContainerProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      {
        refetchInterval: 5000,
      }
    )
  );

  useEffect(() => {
    const lastAssistantMessage = messages.find(
      (message) => message.role === "ASSISTANT"
    );

    if (lastAssistantMessage && lastAssistantMessage.fragment) {
      setActiveFragment(lastAssistantMessage.fragment);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const lastAssistantMessage = messages[messages.length - 1];
  const isLastMessageUser = lastAssistantMessage?.role === "USER";

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={() => {
                if (!message.fragment) return;
                setActiveFragment(message.fragment);
              }}
              type={message.type}
            />
          ))}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessagesContainer;
