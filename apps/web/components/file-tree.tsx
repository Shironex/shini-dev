'use client'
import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileJson,
} from "lucide-react";
import { Button } from "@shini-dev/ui/components/button";
import { ScrollArea } from "@shini-dev/ui/components/scroll-area";
import { cn } from "@shini-dev/ui/lib/utils";

type FileNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[] | { [key: string]: FileNode };
};

interface FileTreeProps {
  files: { [path: string]: string };
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  
  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "py":
    case "cpp":
    case "c":
    case "java":
    case "go":
    case "rs":
      return <FileCode className="w-4 h-4" />;
    case "json":
    case "yaml":
    case "yml":
      return <FileJson className="w-4 h-4" />;
    case "md":
    case "mdx":
    case "txt":
    case "doc":
    case "docx":
      return <FileText className="w-4 h-4" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return <FileImage className="w-4 h-4" />;
    case "mp4":
    case "avi":
    case "mov":
    case "webm":
      return <FileVideo className="w-4 h-4" />;
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
      return <FileAudio className="w-4 h-4" />;
    case "zip":
    case "tar":
    case "gz":
    case "rar":
      return <FileArchive className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
}

function buildFileTree(files: { [path: string]: string }): FileNode[] {
  const root: { [key: string]: FileNode } = {};
  
  Object.keys(files).forEach((filePath) => {
    const parts = filePath.split("/").filter(Boolean);
    let currentLevel = root;
    
    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        const isFile = index === parts.length - 1;
        const nodePath = parts.slice(0, index + 1).join("/");
        
        currentLevel[part] = {
          name: part,
          path: nodePath,
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : {},
        };
      }
      
      if (index < parts.length - 1 && currentLevel[part].children) {
        currentLevel = currentLevel[part].children as { [key: string]: FileNode };
      }
    });
  });
  
  function convertToArray(obj: { [key: string]: FileNode }): FileNode[] {
    return Object.values(obj).map((node) => {
      if (node.type === "folder" && node.children && !Array.isArray(node.children)) {
        return {
          ...node,
          children: convertToArray(node.children),
        };
      }
      return node;
    }).sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }
  
  return convertToArray(root);
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
}

function TreeNode({
  node,
  level,
  selectedFile,
  onFileSelect,
  expandedFolders,
  toggleFolder,
}: TreeNodeProps) {
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedFile === node.path;
  
  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start px-2 py-1 h-auto font-normal hover:bg-accent",
          isSelected && "bg-accent",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.type === "folder") {
            toggleFolder(node.path);
          } else {
            onFileSelect(node.path);
          }
        }}
      >
        {node.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2" />
            ) : (
              <Folder className="w-4 h-4 mr-2" />
            )}
          </>
        ) : (
          <span className="mr-2">{getFileIcon(node.name)}</span>
        )}
        <span className="truncate">{node.name}</span>
      </Button>
      
      {node.type === "folder" && isExpanded && node.children && Array.isArray(node.children) && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({
  files,
  selectedFile,
  onFileSelect,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["/"])
  );
  
  const fileTree = useMemo(() => buildFileTree(files), [files]);
  
  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };
  
  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {fileTree.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            level={0}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
          />
        ))}
      </div>
    </ScrollArea>
  );
}