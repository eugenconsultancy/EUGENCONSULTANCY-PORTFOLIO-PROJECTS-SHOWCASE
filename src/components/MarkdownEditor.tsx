"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Code,
  Heading1,
  Heading2,
  Eye,
  Edit3,
  Quote,
  Info,
  Type,
  Table2,
  Minus,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

// ── Toolbar button ──
function ToolBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="relative group w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500
                 hover:bg-gray-100 dark:hover:bg-gray-700/70
                 hover:text-gray-800 dark:hover:text-gray-100
                 active:scale-90 active:bg-gray-200 dark:active:bg-gray-700
                 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      {icon}
      {/* Tooltip */}
      <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 shadow-lg">
        {label}
      </span>
    </button>
  );
}

// ── Thin group divider ──
function Divider() {
  return (
    <div className="w-px self-stretch my-1 bg-gray-200 dark:bg-gray-700/70 mx-1" />
  );
}

// ── Word + character counts ──
function countStats(text: string) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const lines = text === "" ? 1 : text.split("\n").length;
  return { words, chars, lines };
}

export function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stats = countStats(value);

  // Track typing indicator (clears 1 s after last keystroke)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      setIsTyping(true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setIsTyping(false), 1000);
    },
    [onChange]
  );

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  const insertAtCursor = (before: string, after = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const next =
      value.substring(0, start) +
      before +
      selected +
      after +
      value.substring(end);
    onChange(next);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  };

  // ── Toolbar groups ──
  const groups = [
    {
      label: "Structure",
      tools: [
        {
          icon: <Heading1 size={15} />,
          label: "Heading 2",
          action: () => insertAtCursor("## "),
        },
        {
          icon: <Heading2 size={15} />,
          label: "Heading 3",
          action: () => insertAtCursor("### "),
        },
        {
          icon: <Type size={15} />,
          label: "Heading 4",
          action: () => insertAtCursor("#### "),
        },
      ],
    },
    {
      label: "Format",
      tools: [
        {
          icon: <Bold size={15} />,
          label: "Bold",
          action: () => insertAtCursor("**", "**"),
        },
        {
          icon: <Italic size={15} />,
          label: "Italic",
          action: () => insertAtCursor("*", "*"),
        },
        {
          icon: <Quote size={15} />,
          label: "Blockquote",
          action: () => insertAtCursor("> "),
        },
        {
          icon: <Code size={15} />,
          label: "Inline code",
          action: () => insertAtCursor("`", "`"),
        },
      ],
    },
    {
      label: "Lists",
      tools: [
        {
          icon: <List size={15} />,
          label: "Bullet list",
          action: () => insertAtCursor("- "),
        },
        {
          icon: <ListOrdered size={15} />,
          label: "Numbered list",
          action: () => insertAtCursor("1. "),
        },
      ],
    },
    {
      label: "Insert",
      tools: [
        {
          icon: <Link2 size={15} />,
          label: "Hyperlink",
          action: () => insertAtCursor("[", "](url)"),
        },
        {
          icon: <Table2 size={15} />,
          label: "Table",
          action: () =>
            insertAtCursor(
              "| Column A | Column B |\n| --------- | --------- |\n| Cell     | Cell     |\n"
            ),
        },
        {
          icon: <Minus size={15} />,
          label: "Divider",
          action: () => insertAtCursor("\n---\n"),
        },
      ],
    },
  ];

  return (
    <div
      className={`
        flex flex-col rounded-2xl overflow-hidden
        border transition-all duration-200
        bg-white dark:bg-[#0e1117]
        shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]
        dark:shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)]
        ${isFocused
          ? "border-blue-400/60 dark:border-blue-500/40 shadow-[0_0_0_3px_rgba(59,130,246,0.12)] dark:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
          : "border-gray-200 dark:border-gray-700/60"
        }
      `}
    >
      {/* ══ Editor Header ══ */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-200/70 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          {/* Three-dot window chrome */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="h-3.5 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
              Markdown Editor
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-none">
              Write with Markdown — embed images via{" "}
              <code className="font-mono bg-gray-200/70 dark:bg-gray-700/70 px-1 rounded">
                [img:ID]
              </code>
            </p>
          </div>
        </div>

        {/* Preview / Edit toggle pill */}
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
            transition-all duration-200 border
            ${preview
              ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20"
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
            }
          `}
        >
          {preview ? <Edit3 size={12} /> : <Eye size={12} />}
          <span>{preview ? "Back to edit" : "Preview"}</span>
        </button>
      </div>

      {/* ══ Toolbar (glass strip) ══ */}
      {!preview && (
        <div className="flex-shrink-0 flex items-center px-4 py-2 gap-0.5
                        bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm
                        border-b border-gray-100 dark:border-gray-700/50
                        overflow-x-auto scrollbar-none">
          {groups.map((group, gi) => (
            <div key={gi} className="flex items-center">
              {/* Group label + tools */}
              <div className="flex flex-col items-start">
                <span className="hidden lg:block text-[8px] font-bold uppercase tracking-[0.14em] text-gray-300 dark:text-gray-600 px-1 mb-0.5 select-none">
                  {group.label}
                </span>
                <div className="flex items-center gap-0.5">
                  {group.tools.map((tool, ti) => (
                    <ToolBtn
                      key={ti}
                      icon={tool.icon}
                      label={tool.label}
                      onClick={tool.action}
                    />
                  ))}
                </div>
              </div>
              {gi < groups.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      )}

      {/* ══ Content area ══ */}
      <div className="relative flex-1">
        {preview ? (
          /* ── Preview panel ── */
          <div className="bg-gray-50/60 dark:bg-gray-950/50 min-h-[22rem] px-8 py-7">
            <div className="max-w-3xl mx-auto">
              {value.trim() ? (
                <div
                  className="prose prose-gray dark:prose-invert max-w-none
                              prose-headings:font-bold prose-headings:tracking-tight
                              prose-p:leading-7 prose-p:text-gray-600 dark:prose-p:text-gray-300
                              prose-a:text-blue-600 dark:prose-a:text-blue-400
                              prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em]
                              prose-blockquote:border-l-blue-400 prose-blockquote:text-gray-500 dark:prose-blockquote:text-gray-400
                              prose-strong:text-gray-900 dark:prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-300 dark:text-gray-600">
                  <Eye size={32} className="opacity-30" />
                  <p className="text-sm font-medium">Nothing to preview yet</p>
                  <p className="text-xs text-gray-400">
                    Switch back to edit and start writing.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Edit panel with simulated gutter ── */
          <div className="flex min-h-[22rem]">
            {/* Gutter strip */}
            <div
              className="hidden sm:flex flex-col items-end pt-4 pb-4 select-none
                          bg-gray-50/80 dark:bg-[#0a0d13] border-r border-gray-100 dark:border-gray-800/80
                          text-[11px] font-mono text-gray-300 dark:text-gray-700 leading-7
                          min-w-[2.75rem] px-2 overflow-hidden"
              aria-hidden="true"
            >
              {Array.from({ length: Math.max(stats.lines + 5, 20) }, (_, i) => (
                <span key={i} className="block text-right w-full">
                  {i + 1}
                </span>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={Math.max(stats.lines + 5, 20)}
              className="flex-1 min-h-[22rem] resize-y border-0 bg-transparent
                         px-5 py-4
                         font-mono text-sm leading-7 tracking-tight
                         text-gray-800 dark:text-gray-100
                         placeholder-gray-300 dark:placeholder-gray-700
                         focus:outline-none focus:ring-0
                         selection:bg-blue-100 dark:selection:bg-blue-900/50"
              placeholder={
                "# My Project\n\nStart writing here. Markdown is fully supported.\n\n- Use ** for bold **\n- Use * for italic *\n- Use [img:ID] to embed images"
              }
              spellCheck
            />
          </div>
        )}
      </div>

      {/* ══ Status Bar ══ */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5
                      bg-gray-50/80 dark:bg-gray-900/80
                      border-t border-gray-100 dark:border-gray-700/50">
        {/* Left: hint */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
          <Info size={11} className="flex-shrink-0" />
          <span>
            Use{" "}
            <code className="font-mono bg-gray-200/60 dark:bg-gray-700/60 px-1 rounded text-[10px]">
              [img:ID]
            </code>{" "}
            to embed uploaded images
          </span>
        </div>

        {/* Right: live stats */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400 dark:text-gray-500">
          {/* Typing pulse */}
          {isTyping && (
            <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Typing
            </span>
          )}
          <span title="Lines">{stats.lines}L</span>
          <span title="Words">{stats.words}W</span>
          <span
            title="Characters"
            className={stats.chars > 10000 ? "text-amber-500" : ""}
          >
            {stats.chars.toLocaleString()}ch
          </span>
          {/* Mode badge */}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${preview
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/40"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
              }`}
          >
            {preview ? "Preview" : "Markdown"}
          </span>
        </div>
      </div>
    </div>
  );
}