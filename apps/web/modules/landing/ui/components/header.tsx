"use client";
import { motion } from "framer-motion";
import { Button } from "@shini-dev/ui/components/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Shini</span>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#features" 
            className="text-sm hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Features
          </a>
          <a 
            href="#process" 
            className="text-sm hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            How it Works
          </a>
          <a 
            href="#demo" 
            className="text-sm hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Demo
          </a>
        </nav>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/projects">
            <Button variant="outline" size="sm">
              Projects
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
};