"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { markInquiryRead, deleteInquiry } from "@/lib/actions/inquiries";
import toast from "react-hot-toast";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function InquiryList({ inquiries }: { inquiries: Inquiry[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const unreadCount = inquiries.filter((i) => !i.isRead).length;
  const readCount = inquiries.length - unreadCount;

  const filtered = inquiries.filter((inq) => {
    if (filter === "unread" && inq.isRead) return false;
    if (filter === "read" && !inq.isRead) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

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

  return (
    <div>
      {/* Statistics header */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{inquiries.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
          <p className="text-xs text-gray-500">Unread</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-500">{readCount}</p>
          <p className="text-xs text-gray-500">Read</p>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search inquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-950 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === f
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries list */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((inquiry) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                !inquiry.isRead ? "ring-1 ring-blue-500/50" : ""
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {getInitials(inquiry.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {inquiry.subject}
                        </h3>
                        {!inquiry.isRead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {inquiry.name} · {inquiry.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(inquiry.createdAt)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                      className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      {expandedId === inquiry.id ? "Hide" : "View"}
                    </button>
                    <button
                      onClick={async () => {
                        await markInquiryRead(inquiry.id);
                        toast.success("Marked as read");
                      }}
                      className="px-3 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/40 transition"
                    >
                      Read
                    </button>
                    <button
                      onClick={async () => {
                        await deleteInquiry(inquiry.id);
                        toast.success("Inquiry deleted");
                      }}
                      className="px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded message */}
                <AnimatePresence>
                  {expandedId === inquiry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                          {inquiry.message}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-16">No inquiries found.</p>
        )}
      </div>
    </div>
  );
}
