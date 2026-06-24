"use client";

import { useRef, useState } from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export function MarkdownEditor({ value, onChange }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertShortcode = (shortcode: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
            value.substring(0, start) + shortcode + value.substring(end);
        onChange(newValue);
        // Restore cursor position after React re-render
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + shortcode.length,
                start + shortcode.length
            );
        }, 0);
    };

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
                "Insert" to add the shortcode at cursor position.
            </p>
        </div>
    );
}