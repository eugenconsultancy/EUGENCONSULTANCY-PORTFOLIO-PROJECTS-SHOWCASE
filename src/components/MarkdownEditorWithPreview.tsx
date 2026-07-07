"use client";

import { useState } from "react";
import MDEditor, { commands, ICommand } from "@uiw/react-md-editor";

import { Eye, Edit3, Maximize2, Minimize2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function MarkdownEditorWithPreview({ value, onChange }: Props) {
  const [mode, setMode] = useState<"edit" | "preview" | "live">("live");
  const [fullscreen, setFullscreen] = useState(false);

  const modeOptions = [
    { mode: "edit" as const, icon: <Edit3 size={14} />, label: "Edit" },
    { mode: "live" as const, icon: <Eye size={14} />, label: "Live" },
    { mode: "preview" as const, icon: <Eye size={14} />, label: "Preview" },
  ];

  return (
    <div className={`${fullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-950 p-6 overflow-auto" : ""}`}>
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
            Markdown Editor
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Supports GitHub Flavored Markdown. Use <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[11px]">[img:ID]</code> to embed uploaded images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggles */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {modeOptions.map((opt) => (
              <button
                key={opt.mode}
                onClick={() => setMode(opt.mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === opt.mode
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
              >
                {opt.icon}
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── Editor ── */}
      <div data-color-mode="light" className="dark:hidden">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          height={fullscreen ? window.innerHeight - 140 : 500}
          visibleDragbar={false}
          preview={mode}
          previewOptions={{
            rehypePlugins: [],
          }}
          textareaProps={{
            placeholder: "Write your project documentation in Markdown...",
          }}
        />
      </div>

      {/* ── Editor (dark mode) ── */}
      <div data-color-mode="dark" className="hidden dark:block">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          height={fullscreen ? window.innerHeight - 140 : 500}
          visibleDragbar={false}
          preview={mode}
          previewOptions={{
            rehypePlugins: [],
          }}
          textareaProps={{
            placeholder: "Write your project documentation in Markdown...",
          }}
        />
      </div>
    </div>
  );
}