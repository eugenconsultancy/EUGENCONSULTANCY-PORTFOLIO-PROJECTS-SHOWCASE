"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  code: string;
  language?: string;
  fileName?: string;
  onClose: () => void;
};

export function CodeModal({ code, language, fileName = "code", onClose }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* ── VS Code Window ── */}
      <div
        className="w-full max-w-5xl max-h-[85vh] flex flex-col rounded-lg overflow-hidden shadow-2xl border border-[#333]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Window Chrome (Traffic Lights + Tab) ── */}
        <div className="flex items-center bg-[#252526] px-4 py-2 space-x-3">
          {/* Traffic Light Controls (macOS style) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition focus:outline-none"
              aria-label="Close window"
            />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>

          {/* Tab */}
          <div className="flex-1 flex items-center justify-between bg-[#1e1e1e] text-[#cccccc] px-4 py-1 rounded-t-md border-b border-[#333]">
            <span className="text-sm font-mono truncate">{fileName}</span>
            <button
              onClick={onClose}
              className="ml-2 text-[#858585] hover:text-white transition"
              aria-label="Close tab"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Editor Area ── */}
        <div className="flex-1 bg-[#1e1e1e] overflow-auto custom-scrollbar">
          <SyntaxHighlighter
            language={language || "text"}
            style={vscDarkPlus}
            showLineNumbers
            lineNumberStyle={{
              minWidth: "3em",
              paddingRight: "1em",
              color: "#858585",
              textAlign: "right",
              userSelect: "none",
            }}
            customStyle={{
              margin: 0,
              padding: "1rem 0",
              background: "transparent",
              fontSize: "14px",
              lineHeight: "1.6",
              fontFamily:
                '"Fira Code", "Cascadia Code", Consolas, "Courier New", monospace',
            }}
            codeTagProps={{
              style: {
                fontFamily: "inherit",
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>,
    document.body
  );
}