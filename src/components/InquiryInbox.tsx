"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { markInquiryRead, deleteInquiry } from "@/lib/actions/inquiries";
import toast from "react-hot-toast";
import { Mail, MailOpen, Trash2, X, Search } from "lucide-react";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function InquiryInbox({ inquiries }: { inquiries: Inquiry[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");

  const unreadCount = inquiries.filter((i) => !i.isRead).length;

  const filtered = inquiries.filter((inq) => {
    if (filter === "unread" && inq.isRead) return false;
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

  const selectedInquiry = selectedId ? inquiries.find((i) => i.id === selectedId) : null;

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
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 hidden md:block">
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
          <button
            onClick={() => setFilter("all")}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
              filter === "all" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
              filter === "unread" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Main list */}
      <div className="flex-1">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((inq) => (
            <motion.div
              key={inq.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-2xl border ${
                !inq.isRead ? "border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/10" : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
              } p-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
              onClick={() => {
                setSelectedId(inq.id);
                if (!inq.isRead) markInquiryRead(inq.id);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {getInitials(inq.name)}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${!inq.isRead ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                      {inq.subject}
                    </h3>
                    <p className="text-xs text-gray-500">{inq.name} · {inq.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(inq.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteInquiry(inq.id);
                      toast.success("Deleted");
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto border-l border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Message</h2>
              <button
                onClick={() => setSelectedId(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {getInitials(selectedInquiry.name)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedInquiry.name}</p>
                <p className="text-sm text-gray-500">{selectedInquiry.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-2">{selectedInquiry.subject}</p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{selectedInquiry.message}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  markInquiryRead(selectedInquiry.id);
                  setSelectedId(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Mark as Read
              </button>
              <button
                onClick={() => {
                  deleteInquiry(selectedInquiry.id);
                  setSelectedId(null);
                  toast.success("Deleted");
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
