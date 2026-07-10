"use client";

import { useState } from "react";
import { CommentForm } from "./CommentForm";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  MessageSquareReply,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Link,
  Flag,
} from "lucide-react";

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

// ── Deterministic avatar gradient from name ──
function getAvatarGradient(name: string) {
  const pairs = [
    ["from-blue-500 to-cyan-400", "text-white", "bg-blue-500/20"],
    ["from-purple-500 to-pink-500", "text-white", "bg-purple-500/20"],
    ["from-emerald-500 to-teal-400", "text-white", "bg-emerald-500/20"],
    ["from-orange-500 to-amber-400", "text-white", "bg-orange-500/20"],
    ["from-rose-500 to-red-400", "text-white", "bg-rose-500/20"],
    ["from-indigo-500 to-violet-400", "text-white", "bg-indigo-500/20"],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return pairs[Math.abs(hash) % pairs.length];
}

export function CommentItem({
  comment,
  projectId,
  num1,
  num2,
  token,
  isReply = false,
}: Props) {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [likes, setLikes] = useState(0); // placeholder state
  const [liked, setLiked] = useState(false);

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
  const isLong = comment.content.length > 280;
  const [gradient, textColor] = getAvatarGradient(comment.name);

  return (
    <div className={`relative ${!isReply ? "ml-0" : "ml-6"} mt-1`}>
      {/* Thread connector line */}
      {!isReply && (
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
      )}

      <div
        className={`relative flex gap-3 ${isReply ? "bg-gray-50 dark:bg-gray-850 rounded-xl p-3" : "p-0"}`}
      >
        {/* Avatar with deterministic gradient */}
        <div className="flex-shrink-0 relative z-10">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white dark:ring-gray-900`}
          >
            <span className={textColor}>{getInitials(comment.name)}</span>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {comment.name}
            </span>
            <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
          </div>

          {/* Content */}
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {isLong && !expanded ? (
              <>
                {comment.content.slice(0, 280)}...
                <button
                  onClick={() => setExpanded(true)}
                  className="ml-1 text-blue-600 dark:text-blue-400 font-medium hover:underline text-xs"
                >
                  Read more
                </button>
              </>
            ) : (
              comment.content
            )}
            {isLong && expanded && (
              <button
                onClick={() => setExpanded(false)}
                className="ml-1 text-blue-600 dark:text-blue-400 font-medium hover:underline text-xs"
              >
                Show less
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <button
              onClick={() => {
                setLiked(!liked);
                setLikes((prev) => (liked ? prev - 1 : prev + 1));
              }}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${liked
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <ThumbsUp size={12} />
              <span>{likes || ""}</span>
            </button>
            <button
              onClick={() => setShowReply(!showReply)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <MessageSquareReply size={12} />
              Reply
            </button>

            {/* ⋮ dropdown (edit/delete/copy) */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MoreHorizontal size={12} />
              </button>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 bottom-full mb-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1"
                >
                  {["Edit", "Delete", "Copy link", "Report"].map((action) => {
                    const icons = {
                      Edit: <Edit3 size={12} />,
                      Delete: <Trash2 size={12} />,
                      "Copy link": <Link size={12} />,
                      Report: <Flag size={12} />,
                    };
                    return (
                      <button
                        key={action}
                        onClick={() => setShowActions(false)}
                        className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        {icons[action as keyof typeof icons]}
                        {action}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Reply count badge */}
            {replyCount > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {showReplies ? "Hide" : `${replyCount} repl${replyCount > 1 ? "ies" : "y"}`}
              </button>
            )}
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
                <div className="mt-4">
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
      </div>

      {/* Nested replies */}
      <AnimatePresence>
        {showReplies && replyCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="ml-4 mt-2 space-y-2"
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
      </AnimatePresence>
    </div>
  );
}