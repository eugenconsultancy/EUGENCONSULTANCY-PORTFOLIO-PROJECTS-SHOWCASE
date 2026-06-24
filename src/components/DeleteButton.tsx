"use client";

import { useTransition } from "react";
import { deleteProjectByForm } from "@/lib/actions/projects";

export function DeleteButton({ slug }: { slug: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }
        const formData = new FormData();
        formData.append("slug", slug);
        startTransition(() => {
            deleteProjectByForm(formData);
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? "Deleting..." : "Delete"}
        </button>
    );
}