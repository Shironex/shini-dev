"use client";
import { Sparkles, GitBranch, MessageCircle, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Shini</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered development platform for building amazing applications.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-foreground transition-colors">Features</a>
              <a href="#" className="block hover:text-foreground transition-colors">Examples</a>
              <a href="#" className="block hover:text-foreground transition-colors">Documentation</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-foreground transition-colors">About</a>
              <a href="#" className="block hover:text-foreground transition-colors">Blog</a>
              <a href="#" className="block hover:text-foreground transition-colors">Careers</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <GitBranch className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Shini. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};