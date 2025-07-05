"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Badge } from "@shini-dev/ui/components/badge";
import { Button } from "@shini-dev/ui/components/button";
import { Input } from "@shini-dev/ui/components/input";
import { Card } from "@shini-dev/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shini-dev/ui/components/tabs";
import { 
  User, 
  Bot, 
  Code, 
  Eye, 
  Play,
  Sparkles,
  FileCode,
  Loader,
  Folder,
  File
} from "lucide-react";
import CodeView from "@/components/code-view";
import FileTree from "@/components/file-tree";

type DemoStep = 'input' | 'thinking' | 'coding' | 'preview' | 'complete';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const demoSteps = [
  {
    step: 'thinking' as DemoStep,
    assistantMessage: "🤔 I'll create a beautiful coffee shop landing page with a hero section, menu showcase, and contact information...",
    duration: 2000
  },
  {
    step: 'coding' as DemoStep,
    assistantMessage: "🔧 Building components:\n• Hero section with coffee imagery\n• Menu grid with pricing\n• Location and hours\n• Contact form",
    duration: 3000
  },
  {
    step: 'preview' as DemoStep,
    assistantMessage: "✅ Coffee shop landing page completed! Check out the preview and source code.",
    duration: 1000
  }
];

const mockFiles = {
  "app/page.tsx": `import { HeroSection } from "@/components/hero-section";
import { MenuSection } from "@/components/menu-section";
import { ContactSection } from "@/components/contact-section";

export default function CoffeeShopPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <MenuSection />
      <ContactSection />
    </main>
  );
}`,
  "components/hero-section.tsx": `import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Artisan Coffee
            <span className="text-amber-600"> Experience</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover our carefully crafted coffee blends, 
            made with passion and served with love.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              View Menu
            </Button>
            <Button variant="outline" size="lg">
              Visit Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};`,
  "components/menu-section.tsx": `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const menuItems = [
  { name: "Espresso", price: "$3.50", description: "Rich and bold" },
  { name: "Cappuccino", price: "$4.25", description: "Creamy foam perfection" },
  { name: "Latte", price: "$4.75", description: "Smooth and milky" },
  { name: "Cold Brew", price: "$3.95", description: "Refreshing and smooth" }
];

export const MenuSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Menu</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Card key={item.name} className="text-center">
              <CardHeader>
                <CardTitle className="text-amber-600">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{item.price}</p>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};`,
  "components/contact-section.tsx": `import { Card } from "@/components/ui/card";
import { MapPin, Clock, Phone } from "lucide-react";

export const ContactSection = () => {
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Visit Us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-4 text-amber-600" />
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground">123 Coffee St<br />Downtown, City 12345</p>
          </Card>
          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-4 text-amber-600" />
            <h3 className="font-semibold mb-2">Hours</h3>
            <p className="text-muted-foreground">Mon-Fri: 7AM-8PM<br />Sat-Sun: 8AM-9PM</p>
          </Card>
          <Card className="p-6 text-center">
            <Phone className="w-8 h-8 mx-auto mb-4 text-amber-600" />
            <h3 className="font-semibold mb-2">Contact</h3>
            <p className="text-muted-foreground">(555) 123-CAFE<br />hello@artisancoffee.com</p>
          </Card>
        </div>
      </div>
    </section>
  );
};`
};

const mockPreview = (
  <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden border">
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="bg-amber-700 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Artisan Coffee</h1>
          <nav className="hidden md:flex space-x-4 text-sm">
            <a href="#" className="hover:text-amber-200">Menu</a>
            <a href="#" className="hover:text-amber-200">About</a>
            <a href="#" className="hover:text-amber-200">Contact</a>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 p-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Artisan Coffee
            <span className="text-amber-600"> Experience</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Discover our carefully crafted coffee blends, made with passion and served with love.
          </p>
          <div className="space-x-3">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              View Menu
            </Button>
            <Button variant="outline" size="sm">
              Visit Us
            </Button>
          </div>
        </div>
      </section>
      
      {/* Menu Section */}
      <section className="p-6">
        <h3 className="text-2xl font-bold mb-4 text-center">Our Menu</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Espresso", price: "$3.50" },
            { name: "Cappuccino", price: "$4.25" },
            { name: "Latte", price: "$4.75" },
            { name: "Cold Brew", price: "$3.95" }
          ].map((item) => (
            <div key={item.name} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
              <h4 className="font-semibold text-amber-600">{item.name}</h4>
              <p className="text-lg font-bold">{item.price}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="p-6 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-xl font-bold mb-4 text-center">Visit Us</h3>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="w-6 h-6 mx-auto mb-2 bg-amber-600 rounded-full"></div>
            <p className="font-medium">Location</p>
            <p className="text-gray-600 dark:text-gray-400">123 Coffee St</p>
          </div>
          <div>
            <div className="w-6 h-6 mx-auto mb-2 bg-amber-600 rounded-full"></div>
            <p className="font-medium">Hours</p>
            <p className="text-gray-600 dark:text-gray-400">7AM-8PM</p>
          </div>
          <div>
            <div className="w-6 h-6 mx-auto mb-2 bg-amber-600 rounded-full"></div>
            <p className="font-medium">Contact</p>
            <p className="text-gray-600 dark:text-gray-400">(555) 123-CAFE</p>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState<DemoStep>('input');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [typingText, setTypingText] = useState("");
  const [selectedFile, setSelectedFile] = useState<string>("app/page.tsx");

  const resetDemo = () => {
    setCurrentStep('input');
    setMessages([]);
    setIsRunning(false);
    setActiveTab("preview");
    setTypingText("");
    setSelectedFile("app/page.tsx");
  };

  const runDemo = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setMessages([]);
    setTypingText("");
    
    // Add user message first
    const userMessage: Message = {
      id: '1',
      type: 'user',
      content: "Create a modern landing page for a coffee shop",
      timestamp: new Date()
    };
    
    setMessages([userMessage]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate typing and responses for each step
    for (let i = 0; i < demoSteps.length; i++) {
      const step = demoSteps[i];
      if (step) {
        setCurrentStep(step.step);
        
        if (step.assistantMessage) {
          // Simulate typing effect
          setTypingText("");
          for (let j = 0; j <= step.assistantMessage.length; j++) {
            setTypingText(step.assistantMessage.slice(0, j));
            await new Promise(resolve => setTimeout(resolve, 30));
          }
          
          const assistantMessage: Message = {
            id: (i + 2).toString(),
            type: 'assistant',
            content: step.assistantMessage,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setTypingText("");
          
          if (i < demoSteps.length - 1) {
            await new Promise(resolve => setTimeout(resolve, step.duration));
          }
        }
      }
    }
    
    setCurrentStep('complete');
    setIsRunning(false);
  };

  return (
    <section id="demo" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Interactive Demo</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See Shini in action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch how our AI transforms a simple description into a fully functional application with real-time preview and source code.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-[600px] flex flex-col shadow-lg">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">Shini AI Chat</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetDemo}
                    disabled={isRunning}
                  >
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-primary' : 'bg-muted'}`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-primary-foreground" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isRunning && typingText && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-muted">
                          <p className="text-sm whitespace-pre-line leading-relaxed">
                            {typingText}
                            <span className="animate-pulse">|</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Describe your app idea..."
                    value={isRunning ? "Running demo..." : "Create a modern landing page for a coffee shop"}
                    disabled
                    className="flex-1"
                  />
                  <Button 
                    onClick={runDemo}
                    disabled={isRunning}
                    size="sm"
                  >
                    {isRunning ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Preview/Code Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-[600px] shadow-lg">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "preview" | "code")} className="h-full">
                <div className="p-4 border-b">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview" className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </TabsTrigger>
                    <TabsTrigger value="code" className="flex items-center space-x-2">
                      <Code className="w-4 h-4" />
                      <span>Code</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="preview" className="h-[calc(100%-85px)] p-4">
                  <AnimatePresence mode="wait">
                    {currentStep === 'complete' ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-full"
                      >
                        {mockPreview}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20"
                      >
                        <div className="text-center">
                          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                          <p className="text-muted-foreground">
                            {isRunning ? "Generating preview..." : "Start demo to see preview"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
                
                <TabsContent value="code" className="h-[calc(100%-85px)] p-0">
                  <AnimatePresence mode="wait">
                    {currentStep === 'complete' ? (
                      <motion.div
                        key="code"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-full"
                      >
                        <div className="h-full flex">
                          {/* File Tree */}
                          <div className="w-1/3 border-r bg-muted/30">
                            <div className="p-3 border-b bg-muted/50">
                              <h4 className="text-sm font-medium flex items-center">
                                <Folder className="w-4 h-4 mr-2" />
                                Files
                              </h4>
                            </div>
                            <div className="p-2">
                              <FileTree 
                                files={mockFiles}
                                selectedFile={selectedFile}
                                onFileSelect={setSelectedFile}
                              />
                            </div>
                          </div>
                          
                          {/* Code View */}
                          <div className="flex-1 flex flex-col">
                            <div className="p-3 border-b bg-muted/50">
                              <div className="flex items-center text-sm font-medium">
                                <File className="w-4 h-4 mr-2" />
                                {selectedFile}
                              </div>
                            </div>
                            <div className="flex-1 overflow-auto">
                              <CodeView 
                                code={mockFiles[selectedFile as keyof typeof mockFiles]} 
                                lang="typescript" 
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex items-center justify-center bg-muted/50 rounded-lg mx-4"
                      >
                        <div className="text-center">
                          <FileCode className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {isRunning ? "Writing code..." : "Start demo to see code"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button onClick={runDemo} disabled={isRunning} size="lg">
            {isRunning ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Demo Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Interactive Demo
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};