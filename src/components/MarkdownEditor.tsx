"use client";

import { useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Link2, Code, Heading1, Heading2, Eye, Edit3, Quote } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const insertAtCursor = (before: string, after = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = value.substring(start, end);
    const newText = value.substring(0, start) + before + text + after + value.substring(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + text.length);
    }, 0);
  };

  const tools = [
    { icon: <Heading1 size={15} />, label: "H2", action: () => insertAtCursor("## ") },
    { icon: <Heading2 size={15} />, label: "H3", action: () => insertAtCursor("### ") },
    { icon: <Bold size={15} />, label: "Bold", action: () => insertAtCursor("**", "**") },
    { icon: <Italic size={15} />, label: "Italic", action: () => insertAtCursor("*", "*") },
    { icon: <Quote size={15} />, label: "Quote", action: () => insertAtCursor("> ") },
    { icon: <Code size={15} />, label: "Code", action: () => insertAtCursor("`", "`") },
    { icon: <List size={15} />, label: "UL", action: () => insertAtCursor("- ") },
    { icon: <ListOrdered size={15} />, label: "OL", action: () => insertAtCursor("1. ") },
    { icon: <Link2 size={15} />, label: "Link", action: () => insertAtCursor("[", "](url)") },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1">
          {tools.map((tool, i) => (
            <button
              key={i}
              onClick={tool.action}
              title={tool.label}
              className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition"
            >
              {tool.icon}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPreview(!preview)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${preview
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
        >
          {preview ? <Edit3 size={13} /> : <Eye size={13} />}
          <span>{preview ? "Edit" : "Preview"}</span>
        </button>
      </div>

      {/* ── Content ── */}
      {preview ? (
        <div className="p-5 prose dark:prose-invert max-w-none min-h-[20rem]">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <p className="text-gray-400 italic">Nothing to preview</p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={20}
          className="w-full border-0 bg-transparent px-5 py-4 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-0 resize-y min-h-[20rem]"
          placeholder="Write your Markdown here…"
        />
      )}

      {/* ── Footer hint ── */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-700">
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          Use <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-[10px]">[img:ID]</code> to embed uploaded images at cursor position.
        </p>
      </div>
    </div>
  );
}