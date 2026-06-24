"use client";

import { useState, useRef } from "react";
import { submitComment } from "@/lib/actions/comments";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type Props = {
  projectId: number;
  parentId?: number;
  onSuccess?: () => void;
  num1: number;
  num2: number;
  token: string;
};

export function CommentForm({
  projectId,
  parentId,
  onSuccess,
  num1,
  num2,
  token,
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [loadTimestamp] = useState(() => Date.now().toString());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const emoji = emojiData.emoji;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const newValue = value.substring(0, start) + emoji + value.substring(end);
    textarea.value = newValue;
    const newCursorPos = start + emoji.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.currentTarget);
    formData.append("projectId", projectId.toString());
    if (parentId) formData.append("parentId", parentId.toString());
    formData.append("ip", "client");
    formData.append("timestamp", loadTimestamp);
    formData.append("num1", num1.toString());
    formData.append("num2", num2.toString());
    formData.append("token", token);

    try {
      await submitComment(formData);
      toast.success("Comment submitted! It will appear after moderation.");
      formRef.current?.reset();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Submission failed");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          name="content"
          rows={4}
          placeholder="Write a comment..."
          required
          className="w-full border p-2 rounded pr-12 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <button
          type="button"
          ref={emojiButtonRef}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="absolute right-2 bottom-2 text-xl hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-1 transition"
          aria-label="Insert emoji"
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className="absolute z-20 bottom-full right-0 mb-2">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={320}
              height={400}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          What is {num1} + {num2}? (Spam check)
        </label>
        <input
          type="number"
          name="answer"
          required
          className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder="Enter the sum"
        />
      </div>

      <div style={{ position: "absolute", left: "-9999px" }}>
        <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {sending ? "Submitting..." : parentId ? "Reply" : "Post Comment"}
      </button>
    </form>
  );
}
