"use client";

import { useState } from "react";
import { moderateComments } from "@/lib/actions/comments";

type CommentWithProject = {
    id: number;
    name: string;
    content: string;
    status: string;
    createdAt: Date;
    project: { title: string; slug: string };
};

export function CommentModeration({
    comments,
}: {
    comments: CommentWithProject[];
}) {
    const [selected, setSelected] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleAction = async (action: "APPROVE" | "SPAM" | "DELETE") => {
        await moderateComments(selected, action);
        setSelected([]);
    };

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleAction("APPROVE")}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                    Approve Selected
                </button>
                <button
                    onClick={() => handleAction("SPAM")}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm"
                >
                    Mark Spam
                </button>
                <button
                    onClick={() => handleAction("DELETE")}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                    Delete Selected
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 text-left">
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setSelected(e.target.checked ? comments.map((c) => c.id) : [])
                                    }
                                    checked={selected.length === comments.length && comments.length > 0}
                                />
                            </th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Content</th>
                            <th className="p-2 text-left">Project</th>
                            <th className="p-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((comment) => (
                            <tr key={comment.id} className="border-t hover:bg-gray-50">
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(comment.id)}
                                        onChange={() => toggleSelect(comment.id)}
                                    />
                                </td>
                                <td className="p-2">{comment.name}</td>
                                <td className="p-2 max-w-xs truncate">{comment.content}</td>
                                <td className="p-2">{comment.project.title}</td>
                                <td className="p-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${comment.status === "APPROVED"
                                                ? "bg-green-100 text-green-800"
                                                : comment.status === "SPAM"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {comment.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}