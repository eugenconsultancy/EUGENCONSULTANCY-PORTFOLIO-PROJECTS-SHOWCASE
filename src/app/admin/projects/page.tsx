"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createDraftProject, updateProjectsOrder } from "@/lib/actions/projects";

type ProjectListItem = {
  id: number;
  title: string;
  slug: string;
  status: string;
  displayOrder: number;
};

export default function AdminProjectsPageClient() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data);
    })();
  }, []);

  const handleDragStart = (index: number) => setDraggingIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    const items = [...projects];
    const draggedItem = items[draggingIndex];
    items.splice(draggingIndex, 1);
    items.splice(index, 0, draggedItem);
    setProjects(items);
    setDraggingIndex(index);
  };
  const handleDragEnd = () => setDraggingIndex(null);

  const saveOrder = async () => {
    const slugs = projects.map((p) => p.slug);
    await updateProjectsOrder(slugs);
    // The server action already redirects to /admin/projects – no client refresh needed
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -top-8 h-72 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 40px)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
              Admin
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Manage Projects
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveOrder}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Save Order
            </button>
            <form action={createDraftProject}>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors shadow-sm"
              >
                New Project
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={project.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`border-t border-gray-50 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${draggingIndex === index ? "opacity-50" : ""
                  }`}
              >
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white cursor-move">
                  {project.title}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === "PUBLISHED"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                      }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/projects/${project.slug}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}