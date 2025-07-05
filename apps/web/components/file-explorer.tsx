'use client'
import { CopyIcon, CopyCheckIcon } from "lucide-react";
import { useState, useCallback, useMemo, Fragment } from "react";
import { Button } from "@shini-dev/ui/components/button";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@shini-dev/ui/components/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@shini-dev/ui/components/breadcrumb";

import CodeView from "./code-view";
import Hint from "./hint";
import FileTree from "./file-tree";

export type FileCollection = { [path: string]: string };

interface FileExplorerProps {
  files: FileCollection;
}

function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "text";
}

const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files || {});
    return fileKeys.length > 0 ? fileKeys[0] || null : null;
  });
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (selectedFile && files[selectedFile]) {
      try {
        await navigator.clipboard.writeText(files[selectedFile]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  }, [selectedFile, files]);

  const handleFileSelect = useCallback((path: string) => {
    setSelectedFile(path);
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={20} className="bg-sidebar">
        <FileTree
          files={files}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="flex flex-col h-full w-full">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-baseline items-center gap-x-2">
              <Hint text="Copy to clipboard" side="bottom">
                <Button variant="ghost" size="icon" className="ml-auto" onClick={handleCopy}>
                  {copied ? (
                    <CopyCheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </Button>
              </Hint>
            </div>

            <div className="flex-1 overflow-y-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getFileExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a file to view its contents</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FileExplorer;
