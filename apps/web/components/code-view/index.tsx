"use client";

import prismjs from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "./code-theme.css";
import { useEffect } from "react";

interface CodeViewProps {
  code: string;
  lang: string;
}

const CodeView = ({ code, lang }: CodeViewProps) => {
  useEffect(() => {
    prismjs.highlightAll();
  }, [code, lang]);

  return (
    <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};

export default CodeView;
