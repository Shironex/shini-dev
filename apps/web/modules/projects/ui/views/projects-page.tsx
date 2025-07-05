"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Button } from "@shini-dev/ui/components/button";
import { Input } from "@shini-dev/ui/components/input";
import { Card } from "@shini-dev/ui/components/card";
import { Badge } from "@shini-dev/ui/components/badge";
import { Skeleton } from "@shini-dev/ui/components/skeleton";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Sparkles,
  FolderOpen,
  ArrowRight,
  MessageSquare,
  Loader,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function ProjectsPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectPrompt, setNewProjectPrompt] = useState("");

  // Fetch projects
  const { data: projects, isLoading } = useQuery(
    trpc.projects.getMany.queryOptions()
  );

  // Create project mutation
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
    })
  );

  // Filter projects based on search
  const filteredProjects =
    projects?.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.messages.some((msg: any) =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

  const handleCreateProject = async () => {
    if (!newProjectPrompt.trim()) return;

    await createProject.mutateAsync({
      content: {
        prompt: newProjectPrompt,
      },
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">My Projects</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold">{projects?.length || 0}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold">
                  {projects?.filter((p) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(p.createdAt) > weekAgo;
                  }).length || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-3xl font-bold">
                  {projects?.reduce((acc, p) => acc + p.messages.length, 0) ||
                    0}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-5/6 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </Card>
            ))}
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Create your first project to get started"}
            </p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => {
              const lastMessage = project.messages[project.messages.length - 1];
              const userMessages = project.messages.filter(
                (m: any) => m.role === "USER"
              );
              const firstUserMessage = userMessages[0];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50 group"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg line-clamp-1 flex-1">
                        {project.name}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                    </div>

                    {firstUserMessage && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {firstUserMessage.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {project.messages.length}
                        </Badge>
                        {lastMessage?.status === "STREAMING" && (
                          <Badge
                            variant="default"
                            className="text-xs animate-pulse"
                          >
                            <Loader className="w-3 h-3 mr-1 animate-spin" />
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(project.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreating && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsCreating(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                <p className="text-muted-foreground mb-6">
                  Describe what you want to build and let our AI create it for
                  you.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Project Description
                    </label>
                    <Input
                      placeholder="e.g., Create a modern blog with dark mode..."
                      value={newProjectPrompt}
                      onChange={(e) => setNewProjectPrompt(e.target.value)}
                      className="w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateProject();
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setNewProjectPrompt("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateProject}
                      disabled={
                        !newProjectPrompt.trim() || createProject.isPending
                      }
                      className="bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      {createProject.isPending ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create Project
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
