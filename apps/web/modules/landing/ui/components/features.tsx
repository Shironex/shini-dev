"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@shini-dev/ui/components/card";
import { Badge } from "@shini-dev/ui/components/badge";
import { Zap, Eye, FileCode, Code2 } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate complete applications in seconds, not hours. Our AI understands your requirements and creates production-ready code instantly."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Live Preview",
      description: "See your application come to life in real-time. Preview your app as it's being built with our integrated preview system."
    },
    {
      icon: <FileCode className="w-6 h-6" />,
      title: "Full Source Code",
      description: "Get complete, readable source code for every component. Browse files, understand the structure, and customize as needed."
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Modern Stack",
      description: "Built with the latest technologies including React, Next.js, TypeScript, and Tailwind CSS for optimal performance."
    }
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to build amazing apps
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to create, preview, and deploy applications effortlessly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};