"use client";
import { Input } from "@shini-dev/ui/components/input";
import { Button } from "@shini-dev/ui/components/button";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const trpc = useTRPC();
  const [value, setValue] = useState("");

  const createProjectMutation = useMutation(trpc.projects.create.mutationOptions({
    onSuccess: (data) => {
      toast.success("Project created");
      router.push(`/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  }));

  const handleClick = async () => {
    createProjectMutation.mutate({ content: { prompt: value } });
  };

  return (
    <div className="h-screen w-screen flex flex-col space-y-4 items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Shini</h1>
          <p className="text-sm text-gray-500">
            Shini is a tool that helps you create messages.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button size="sm" onClick={handleClick}>Create Message</Button>
      </div>
 
 
    </div>
  );
}
