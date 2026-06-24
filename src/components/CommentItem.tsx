"use client";

import { useState } from "react";
import { CommentForm } from "./CommentForm";
import { motion, AnimatePresence } from "framer-motion";

type CommentData = {
  id: number;
  name: string;
  content: string;
  createdAt: Date;
  replies?: CommentData[];
};

type Props = {
  comment: CommentData;
  projectId: number;
  num1: number;
  num2: number;
  token: string;
  isReply?: boolean;
};

export function CommentItem({ comment, projectId, num1, num2, token, isReply = false }: Props) {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const replyCount = comment.replies?.length ?? 0;

  return (
    <div className={`relative ${!isReply ? "border-l-2 border-gray-200 dark:border-gray-700 ml-2 pl-4" : "ml-4"}`}>
      {/* Thread connector dot */}
      {!isReply && <div className="absolute -left-[0.35rem] top-5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-950" />}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-300">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            {getInitials(comment.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                {comment.name}
              </span>
              <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
            </div>
            <p className="mt-1.5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showReply ? "Cancel" : "Reply"}
              </button>
              {replyCount > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showReplies ? "Hide" : `View ${replyCount} repl${replyCount > 1 ? "ies" : "y"}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inline reply form */}
        <AnimatePresence>
          {showReply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 ml-6">
                <CommentForm
                  projectId={projectId}
                  parentId={comment.id}
                  num1={num1}
                  num2={num2}
                  token={token}
                  onSuccess={() => setShowReply(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nested replies */}
      {showReplies && replyCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-3 ml-6 space-y-3"
        >
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              projectId={projectId}
              num1={num1}
              num2={num2}
              token={token}
              isReply
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
