"use client";

import { useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Markdown Content</label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={20}
        className="border rounded p-3 font-mono text-sm"
        placeholder="Write your Markdown here..."
      />
      <p className="text-xs text-gray-500">
        Use <code>[img:ID]</code> to embed images. Upload images below and click
        &ldquo;Insert&rdquo; to add the shortcode at cursor position.
      </p>
    </div>
  );
}
