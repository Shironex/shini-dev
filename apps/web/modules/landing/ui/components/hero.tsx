"use client";
import { motion } from "framer-motion";
import { Button } from "@shini-dev/ui/components/button";
import { Input } from "@shini-dev/ui/components/input";
import { Badge } from "@shini-dev/ui/components/badge";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const Hero = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const [prompt, setPrompt] = useState("");

  const createProjectMutation = useMutation(trpc.projects.create.mutationOptions({
    onSuccess: (data) => {
      toast.success("Project created successfully!");
      router.push(`/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  }));

  const handleCreateProject = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your project");
      return;
    }
    createProjectMutation.mutate({ content: { prompt } });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="container mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Development
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Anything
              </span>
              {" "}with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into fully functional applications with our AI-powered development platform. 
              Just describe what you want, and watch it come to life.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="max-w-2xl mx-auto space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Describe your app idea... (e.g., 'Create a todo app with dark mode')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 h-12 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
              />
              <Button 
                size="lg" 
                onClick={handleCreateProject}
                disabled={createProjectMutation.isPending}
                className="h-12 px-8"
              >
                {createProjectMutation.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    Create App
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Try: "landing page for a coffee shop" or "dashboard with charts"
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="flex items-center justify-center space-x-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Real-time preview</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Full source code</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Instant deployment</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};