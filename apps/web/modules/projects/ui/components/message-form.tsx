'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
} from "@shini-dev/ui/components/form";
import { cn } from "@shini-dev/ui/lib/utils";
import TextAreaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

interface MessageFormProps {
  projectId: string;
}

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }).max(1000, {
    message: "Message must be less than 1000 characters",
  }),
});

const MessageForm = ({ projectId }: MessageFormProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        setIsFocused(false);
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({
            projectId,
          })
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  const onSubmit = async (data: FormValues) => {
    await createMessage.mutateAsync({
      content: {
        projectId,
        prompt: data.message,
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextAreaAutosize
                  placeholder="What would you like to build?"
                  className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                  {...field}
                  disabled={isPending}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  minRows={2}
                  maxRows={8}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span>&#8984;</span>
              Enter
              <span>&nbsp;to submit</span>
            </kbd>
          </div>

          <button
            className={cn(
              "size-8 rounded-full",
              isButtonDisabled && "bg-muted-foreground border"
            )}
            disabled={isButtonDisabled}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default MessageForm;
