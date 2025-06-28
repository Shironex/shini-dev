"use client";
import { Input } from "@shini-dev/ui/components/input";
import { Button } from "@shini-dev/ui/components/button";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Page() {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const { data: messages } = useQuery(trpc.messages.getMessages.queryOptions());
  const invoke = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: (data) => {
      toast.success("Message created");
    },
  }));

  const handleClick = async () => {
    invoke.mutate({ content: { prompt: value } });
  };

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button size="sm" onClick={handleClick}>Create Message</Button>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        {messages?.map((message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
    </div>
  );
}
