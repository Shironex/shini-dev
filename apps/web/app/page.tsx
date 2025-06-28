"use client";
import { Input } from "@shini-dev/ui/components/input";
import { Button } from "@shini-dev/ui/components/button";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Page() {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: (data) => {
      toast.success("Inngest invoked");
    },
  }));

  const handleClick = async () => {
    invoke.mutate({ text: value });
  };

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button size="sm" onClick={handleClick}>Invoke Inngest</Button>
      </div>
    </div>
  );
}
