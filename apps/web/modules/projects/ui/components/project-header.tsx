"use client";
import { useTRPC } from "@/trpc/client";
import { Button } from "@shini-dev/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@shini-dev/ui/components/dropdown-menu";
import Image from "next/image";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface ProjectHeaderProps {
  projectId: string;
}

const ProjectHeader = ({ projectId }: ProjectHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return (
    <header className="p-2 flex justify-between items-center border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2"
            asChild
          >
            <div>
              <Image src={"/logo.svg"} alt="logo" width={18} height={18} />
              <span className="text-sm font-medium">{project.name}</span>
              <ChevronDownIcon />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem>
            <Link href={"/projects"} className="flex items-center gap-2">
              <ChevronLeftIcon className="size-4" />
              <span>Back to Projects</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/"} className="flex items-center gap-2">
              <ChevronLeftIcon className="size-4" />
              <span>Back to Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="size-4 text-muted-foreground" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value)}
              >
                <DropdownMenuRadioItem value="light">
                  <SunIcon className="size-4 text-muted-foreground" />
                  <span>Light</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <MoonIcon className="size-4 text-muted-foreground" />
                  <span>Dark</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <MonitorIcon className="size-4 text-muted-foreground" />
                  <span>System</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default ProjectHeader;
