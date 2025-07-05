"use client";
import { Fragment, MessageRole, MessageType, MessageStatus } from "@/generated/prisma";
import React from "react";
import { Card } from "@shini-dev/ui/components/card";
import { cn } from "@shini-dev/ui/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { ChevronRightIcon, Code2Icon, LoaderIcon } from "lucide-react";

interface MessageCardProps {
  content: string;
  createdAt: Date;
  role: MessageRole;
  fragment: Fragment | null;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
  status?: MessageStatus;
}

const MessageCard = ({
  content,
  createdAt,
  role,
  fragment,
  isActiveFragment,
  onFragmentClick,
  type,
  status,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        createdAt={createdAt}
        type={type}
        status={status}
      />
    );
  }

  return <UserMessage content={content} />;
};

interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
        {content}
      </Card>
    </div>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
  createdAt: Date;
  status?: MessageStatus;
}

const AssistantMessage = ({
  content,
  fragment,
  isActiveFragment,
  onFragmentClick,
  type,
  createdAt,
  status,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="shini"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="font-medium text-sm">shini</span>
        {status === "STREAMING" && (
          <LoaderIcon className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
        <span className="font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-2">
        <div className="whitespace-pre-wrap">
          {status === "STREAMING" ? (
            <div>
              {content}
              <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
            </div>
          ) : (
            content
          )}
        </div>

        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
        isActiveFragment &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5 " />
      <div className="flex flex-col flex-1">
        <span className="font-medium text-sm line-clamp-1">
          {fragment.title}
        </span>
        <span className="text-sm line-clamp-1">PREVIEW</span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <ChevronRightIcon className="size-4" />
      </div>
    </button>
  );
};

export default MessageCard;
