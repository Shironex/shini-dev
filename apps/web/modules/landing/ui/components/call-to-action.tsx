"use client";
import { motion } from "framer-motion";
import { Button } from "@shini-dev/ui/components/button";
import { Play } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to build your next big idea?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers who are already using Shini to bring their ideas to life faster than ever before.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="h-12 px-8">
              Start Building Now
              <Play className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};