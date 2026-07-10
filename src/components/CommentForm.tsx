"use client";

import { useState, useRef, useEffect } from "react";
import { submitComment } from "@/lib/actions/comments";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Check, Loader2 } from "lucide-react";

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
  const [success, setSuccess] = useState(false);
  const [loadTimestamp] = useState(() => Date.now().toString());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // Reset success state after 2 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
      setSuccess(true); // trigger button success state
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
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-6 space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          💬 Join the Discussion
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Share your thoughts with other developers.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Name with floating label */}
        <div className="relative">
          <input
            type="text"
            name="name"
            placeholder=" "
            required
            className="peer w-full border border-gray-200 dark:border-gray-700 bg-transparent px-3 pt-5 pb-2 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
          <label className="absolute left-3 top-3 text-sm text-gray-400 transition-all pointer-events-none
            peer-focus:text-xs peer-focus:-translate-y-2 peer-focus:text-blue-500 dark:peer-focus:text-blue-400
            peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:text-blue-500 dark:peer-[&:not(:placeholder-shown)]:text-blue-400">
            Your name
          </label>
        </div>

        {/* Comment with floating label and emoji picker */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            name="content"
            rows={4}
            placeholder=" "
            required
            className="peer w-full border border-gray-200 dark:border-gray-700 bg-transparent px-3 pt-5 pb-10 rounded-xl text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
          <label className="absolute left-3 top-3 text-sm text-gray-400 transition-all pointer-events-none
            peer-focus:text-xs peer-focus:-translate-y-2 peer-focus:text-blue-500 dark:peer-focus:text-blue-400
            peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:text-blue-500 dark:peer-[&:not(:placeholder-shown)]:text-blue-400">
            Share feedback, ask a question, or suggest improvements...
          </label>

          {/* Emoji button */}
          <button
            type="button"
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute right-3 bottom-3 text-xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1.5 transition-colors"
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

        {/* Spam check */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            What is {num1} + {num2}? (Spam check)
          </label>
          <input
            type="number"
            name="answer"
            required
            className="w-full border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            placeholder="Enter the sum"
          />
        </div>

        {/* Honeypot */}
        <div style={{ position: "absolute", left: "-9999px" }}>
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={sending}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all
            ${success
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
            }
            disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Publishing...
            </>
          ) : success ? (
            <>
              <Check size={16} />
              Published!
            </>
          ) : (
            <>
              💬 Publish Comment
            </>
          )}
        </button>
      </form>
    </div>
  );
}