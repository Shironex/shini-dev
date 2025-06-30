"use client";

import Hint from "@/components/hint";
import { Fragment } from "@/generated/prisma/client";
import { Button } from "@shini-dev/ui/components/button";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FragmentWebProps {
  data: Fragment;
}

const FragmentWeb = ({ data }: FragmentWebProps) => {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const handleRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    if (!data.sandboxUrl || navigator === undefined) return;

    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);

    toast.success("Copied to clipboard");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b flex items-center gap-x-2 bg-sidebar">
        <Hint text="Refresh the fragment">
          <Button size="sm" variant={"outline"} onClick={handleRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>

        <Hint text="Copy the fragment URL">
          <Button
            size="sm"
            variant={"outline"}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal"
            onClick={handleCopy}
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>
        
        <Hint text="Open in new tab">
          <Button
            size="sm"
            variant={"outline"}
            disabled={!data.sandboxUrl}
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        src={data.sandboxUrl ?? ""}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default FragmentWeb;
