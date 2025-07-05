"use client";
import React, { Suspense, useState } from "react";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@shini-dev/ui/components/resizable";
import MessagesContainer from "../components/messages-container";
import { Fragment } from "@/generated/prisma";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shini-dev/ui/components/tabs";
import { CodeIcon, EyeIcon } from "lucide-react";
import FileExplorer, { FileCollection } from "@/components/file-explorer";

interface ProjectViewProps {
  projectId: string;
}

const ProjectView = ({ projectId }: ProjectViewProps) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<div>Loading project header...</div>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<div>Loading messages...</div>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          <Tabs
            className="h-full gap-y-0"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "preview" | "code")}
          >
            <div className="flex items-center w-full p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span className="text-sm">Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span className="text-sm">Code</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {activeFragment?.files ? (
                <FileExplorer
                  files={activeFragment.files as FileCollection}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No files available for this fragment</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
