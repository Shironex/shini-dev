"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const SHinnerMessages = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Analyzing...",
    "Processing...",
    "Generating...",
    "Building your website...",
    "Almost there...",
    "Optimizing layout...",
    "Creating a beautiful design...",
    "Adding final touches...",
    "Finishing up...",
    "Almost done...",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">{messages[currentMessageIndex]}</span>
    </div>
  );
};

const MessageLoading = () => {
  return <div className="flex flex-col group px-2 pb-4">
    <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
            src={'/logo.svg'}
            alt="logo"
            width={18}
            height={18}
            className="shrink-0"
        />
        <span className="text-sm font-medium">
            Shini
        </span>
    </div>
    <div className="pl-8.5 flex flex-col gap-y-4">
        <SHinnerMessages />
    </div>
  </div>;
};

export default MessageLoading;
