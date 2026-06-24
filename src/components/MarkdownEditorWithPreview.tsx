"use client";

import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function MarkdownEditorWithPreview({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Editor</label>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={20}
          className="w-full border rounded p-3 font-mono text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Preview</label>
        <div className="border rounded p-3 prose dark:prose-invert max-w-none h-full overflow-y-auto bg-white dark:bg-gray-800 min-h-[20rem]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {value || "*Nothing to preview*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
