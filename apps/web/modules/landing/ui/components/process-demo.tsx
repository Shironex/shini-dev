"use client";
import { motion } from "framer-motion";
import { Badge } from "@shini-dev/ui/components/badge";
import { Sparkles, Code2, Eye } from "lucide-react";

export const ProcessDemo = () => {
  const steps = [
    {
      number: "01",
      title: "Describe Your Idea",
      description: "Simply type what you want to build. Our AI understands natural language and technical requirements.",
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      number: "02", 
      title: "AI Generates Code",
      description: "Watch as our AI architect designs and codes your application using modern best practices.",
      icon: <Code2 className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Preview & Iterate",
      description: "See your app in action immediately. Make changes and improvements with simple descriptions.",
      icon: <Eye className="w-8 h-8" />
    }
  ];

  return (
    <section id="process" className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From idea to app in 3 simple steps
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes app development accessible to everyone, regardless of technical expertise.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center relative"
            >
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 text-6xl font-bold text-primary/10">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-8 left-full w-12 h-0.5 bg-gradient-to-r from-primary to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};