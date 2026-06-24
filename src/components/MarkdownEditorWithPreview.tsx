"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type ViewMode = "editor" | "split" | "preview";

interface ToolbarAction {
  icon: string;
  label: string;
  shortcut?: string;
  action: (value: string, start: number, end: number) => {
    newValue: string;
    cursorStart: number;
    cursorEnd: number;
  };
}

const TOOLBAR_ACTIONS: (ToolbarAction | "divider")[] = [
  {
    icon: "B",
    label: "Bold",
    shortcut: "⌘B",
    action: (value, start, end) => {
      const selected = value.slice(start, end);
      const wrapped = `**${selected || "bold text"}**`;
      return {
        newValue: value.slice(0, start) + wrapped + value.slice(end),
        cursorStart: selected ? start : start + 2,
        cursorEnd: selected ? start + wrapped.length : start + 2 + 9,
      };
    },
  },
  {
    icon: "I",
    label: "Italic",
    shortcut: "⌘I",
    action: (value, start, end) => {
      const selected = value.slice(start, end);
      const wrapped = `*${selected || "italic text"}*`;
      return {
        newValue: value.slice(0, start) + wrapped + value.slice(end),
        cursorStart: selected ? start : start + 1,
        cursorEnd: selected ? start + wrapped.length : start + 1 + 11,
      };
    },
  },
  {
    icon: "S̶",
    label: "Strikethrough",
    action: (value, start, end) => {
      const selected = value.slice(start, end);
      const wrapped = `~~${selected || "strikethrough"}~~`;
      return {
        newValue: value.slice(0, start) + wrapped + value.slice(end),
        cursorStart: selected ? start : start + 2,
        cursorEnd: selected ? start + wrapped.length : start + 2 + 13,
      };
    },
  },
  "divider",
  {
    icon: "H1",
    label: "Heading 1",
    action: (value, start, end) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const prefix = "# ";
      return {
        newValue: value.slice(0, lineStart) + prefix + value.slice(lineStart),
        cursorStart: start + prefix.length,
        cursorEnd: end + prefix.length,
      };
    },
  },
  {
    icon: "H2",
    label: "Heading 2",
    action: (value, start, end) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const prefix = "## ";
      return {
        newValue: value.slice(0, lineStart) + prefix + value.slice(lineStart),
        cursorStart: start + prefix.length,
        cursorEnd: end + prefix.length,
      };
    },
  },
  {
    icon: "H3",
    label: "Heading 3",
    action: (value, start, end) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const prefix = "### ";
      return {
        newValue: value.slice(0, lineStart) + prefix + value.slice(lineStart),
        cursorStart: start + prefix.length,
        cursorEnd: end + prefix.length,
      };
    },
  },
  "divider",
  {
    icon: "⁝≡",
    label: "Bullet list",
    action: (value, start, end) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const prefix = "- ";
      return {
        newValue: value.slice(0, lineStart) + prefix + value.slice(lineStart),
        cursorStart: start + prefix.length,
        cursorEnd: end + prefix.length,
      };
    },
  },
  {
    icon: "1.",
    label: "Numbered list",
    action: (value, start, end) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const prefix = "1. ";
      return {
        newValue: value.slice(0, lineStart) + prefix + value.slice(lineStart),
        cursorStart: start + prefix.length,
        cursorEnd: end + prefix.length,
      };
    },
  },
  {
    icon: "❝",
    label: "Blockquote",
    action: (value, start, end) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const prefix = "> ";
      return {
        newValue: value.slice(0, lineStart) + prefix + value.slice(lineStart),
        cursorStart: start + prefix.length,
        cursorEnd: end + prefix.length,
      };
    },
  },
  "divider",
  {
    icon: "</>",
    label: "Inline code",
    shortcut: "⌘E",
    action: (value, start, end) => {
      const selected = value.slice(start, end);
      const wrapped = `\`${selected || "code"}\``;
      return {
        newValue: value.slice(0, start) + wrapped + value.slice(end),
        cursorStart: selected ? start : start + 1,
        cursorEnd: selected ? start + wrapped.length : start + 1 + 4,
      };
    },
  },
  {
    icon: "```",
    label: "Code block",
    action: (value, start, end) => {
      const selected = value.slice(start, end);
      const wrapped = `\`\`\`\n${selected || "// your code here"}\n\`\`\``;
      return {
        newValue: value.slice(0, start) + wrapped + value.slice(end),
        cursorStart: selected ? start + 4 : start + 4,
        cursorEnd: selected
          ? start + 4 + selected.length
          : start + 4 + 18,
      };
    },
  },
  "divider",
  {
    icon: "🔗",
    label: "Link",
    shortcut: "⌘K",
    action: (value, start, end) => {
      const selected = value.slice(start, end);
      const wrapped = `[${selected || "link text"}](url)`;
      return {
        newValue: value.slice(0, start) + wrapped + value.slice(end),
        cursorStart: selected
          ? start + selected.length + 3
          : start + 1,
        cursorEnd: selected
          ? start + wrapped.length - 1
          : start + 1 + 9,
      };
    },
  },
  {
    icon: "—",
    label: "Horizontal rule",
    action: (value, start, end) => {
      const divider = "\n\n---\n\n";
      return {
        newValue: value.slice(0, start) + divider + value.slice(end),
        cursorStart: start + divider.length,
        cursorEnd: start + divider.length,
      };
    },
  },
];

function wordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function readingTime(text: string): number {
  return Math.max(1, Math.ceil(wordCount(text) / 200));
}

export function MarkdownEditorWithPreview({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const applyAction = useCallback(
    (action: ToolbarAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const { newValue, cursorStart, cursorEnd } = action.action(
        value,
        start,
        end
      );

      onChange(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorStart, cursorEnd);
      }, 0);
    },
    [value, onChange]
  );

  const insertShortcode = useCallback(
    (shortcode: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        value.substring(0, start) + shortcode + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + shortcode.length,
          start + shortcode.length
        );
      }, 0);
    },
    [value, onChange]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement !== textareaRef.current) return;
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;

      const shortcuts: Record<string, string> = {
        b: "Bold",
        i: "Italic",
        e: "Inline code",
        k: "Link",
      };

      const label = shortcuts[e.key.toLowerCase()];
      if (label) {
        e.preventDefault();
        const action = TOOLBAR_ACTIONS.find(
          (a) => a !== "divider" && a.label === label
        ) as ToolbarAction | undefined;
        if (action) applyAction(action);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [applyAction]);

  // Tab key inserts 2 spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current!;
      const start = textarea.selectionStart;
      const newValue =
        value.substring(0, start) + "  " + value.substring(start);
      onChange(newValue);
      setTimeout(() => textarea.setSelectionRange(start + 2, start + 2), 0);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
  };

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col"
    : "flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm";

  return (
    <div className={containerClass} style={{ fontFamily: "inherit" }}>
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 gap-2 flex-wrap">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {TOOLBAR_ACTIONS.map((item, i) => {
            if (item === "divider")
              return (
                <div
                  key={`div-${i}`}
                  className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"
                />
              );
            return (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setActiveTooltip(item.label)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() => applyAction(item)}
                  className="flex items-center justify-center w-8 h-8 rounded text-xs font-mono font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label={item.label}
                >
                  {item.icon}
                </button>
                {activeTooltip === item.label && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                      {item.label}
                      {item.shortcut && (
                        <span className="ml-1.5 opacity-60">
                          {item.shortcut}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {/* View mode toggle */}
          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            {(["editor", "split", "preview"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 text-xs transition-colors ${viewMode === mode
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
              >
                {mode === "editor" ? "Edit" : mode === "split" ? "Split" : "Preview"}
              </button>
            ))}
          </div>

          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Copy raw markdown"
          >
            {copyFeedback ? "✓ Copied" : "Copy MD"}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="flex items-center justify-center w-7 h-7 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? "⊠" : "⛶"}
          </button>
        </div>
      </div>

      {/* ── Editor / Preview panes ── */}
      <div
        className={`flex flex-1 overflow-hidden ${viewMode === "split" ? "divide-x divide-gray-200 dark:divide-gray-700" : ""
          }`}
        style={{ minHeight: "520px" }}
      >
        {/* Editor pane */}
        {(viewMode === "editor" || viewMode === "split") && (
          <div
            className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"
              }`}
          >
            {viewMode === "split" && (
              <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Markdown
                </span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={20}
              spellCheck={false}
              className="flex-1 w-full resize-none p-4 font-mono text-sm leading-relaxed bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none placeholder-gray-300 dark:placeholder-gray-600"
              placeholder="Write your Markdown here…&#10;&#10;Use [img:ID] to embed uploaded images."
              style={{ tabSize: 2 }}
            />
          </div>
        )}

        {/* Preview pane */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"
              }`}
          >
            {viewMode === "split" && (
              <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Preview
                </span>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
              {value.trim() === "" ? (
                <p className="text-gray-300 dark:text-gray-600 italic text-sm">
                  Nothing to preview yet…
                </p>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-code:text-rose-600 dark:prose-code:text-rose-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-headings:font-semibold prose-a:text-blue-600">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-3">
          <span>{wordCount(value).toLocaleString()} words</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{value.length.toLocaleString()} chars</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{readingTime(value)} min read</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            Tab → 2 spaces · ⌘B Bold · ⌘I Italic · ⌘K Link
          </span>
          <span>Markdown</span>
        </div>
      </div>
    </div>
  );
}