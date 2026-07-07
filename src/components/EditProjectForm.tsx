"use client";

import { useState } from "react";
import { MarkdownEditorWithPreview } from "./MarkdownEditorWithPreview";
import { ImageUploader } from "./ImageUploader";
import { updateProject, generatePreviewToken } from "@/lib/actions/projects";
import toast from "react-hot-toast";

type ProjectWithImages = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string;
  techStack: string;
  dependencies: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  status: string;
  displayOrder: number;
  previewToken: string | null;
  problem: string | null;
  approach: string | null;
  result: string | null;
  metrics: string | null;
  frameworkRationale?: string | null;
  beforeImageId: number | null;
  afterImageId: number | null;
  images: { id: number; filename: string; alt: string | null }[];
};

export function EditProjectForm({ project }: { project: ProjectWithImages }) {
  const [body, setBody] = useState(project.body);
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState(project.problem || "");
  const [approach, setApproach] = useState(project.approach || "");
  const [result, setResult] = useState(project.result || "");
  const [metrics, setMetrics] = useState(project.metrics || "");
  const [frameworkRationale, setFrameworkRationale] = useState(project.frameworkRationale || "");
  const [beforeImageId, setBeforeImageId] = useState(project.beforeImageId?.toString() || "");
  const [afterImageId, setAfterImageId] = useState(project.afterImageId?.toString() || "");

  const handleInsertShortcode = (shortcode: string) => {
    setBody((prev) => prev + shortcode);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.append("body", body);
    formData.append("problem", problem);
    formData.append("approach", approach);
    formData.append("result", result);
    formData.append("metrics", metrics);
    formData.append("frameworkRationale", frameworkRationale);

    formData.append("beforeImageId", beforeImageId === "none" ? "" : beforeImageId);
    formData.append("afterImageId", afterImageId === "none" ? "" : afterImageId);

    try {
      await updateProject(project.slug, formData);
      // No router.refresh() – the server action already redirects
    } catch (error) {
      console.error(error);
      toast.error("Failed to save project. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePreview = async () => {
    const token = await generatePreviewToken(project.slug);
    const url = `${window.location.origin}/projects/${project.slug}?preview=${token}`;
    await navigator.clipboard.writeText(url);
    toast.success("Preview URL copied! Share this secret link.");
  };

  const imageOptions = [
    { value: "none", label: "— No image —" },
    ...project.images.map((img) => ({
      value: img.id.toString(),
      label: `Image #${img.id} (${img.filename})`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* fields unchanged */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input type="text" name="title" defaultValue={project.title} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input type="text" name="slug" defaultValue={project.slug} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Summary</label>
        <textarea name="summary" defaultValue={project.summary} rows={3} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
        <input type="text" name="techStack" defaultValue={project.techStack} className="w-full border p-2 rounded" placeholder="React, TypeScript, Tailwind" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Dependencies (one per line)</label>
        <textarea name="dependencies" defaultValue={project.dependencies ?? ""} rows={5} className="w-full border p-2 rounded font-mono text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Live URL</label>
        <input type="url" name="liveUrl" defaultValue={project.liveUrl ?? ""} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">GitHub URL</label>
        <input type="url" name="githubUrl" defaultValue={project.githubUrl ?? ""} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" defaultValue={project.status} className="w-full border p-2 rounded">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Display Order</label>
        <input type="number" name="displayOrder" defaultValue={project.displayOrder} className="w-full border p-2 rounded" />
      </div>

      {/* Framework Rationale */}
      <div>
        <label className="block text-sm font-medium mb-1">Framework Rationale</label>
        <textarea
          value={frameworkRationale}
          onChange={(e) => setFrameworkRationale(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded"
          placeholder="Explain why you chose the specific frameworks/tech stack for this project…"
        />
      </div>

      <MarkdownEditorWithPreview value={body} onChange={setBody} />
      <input type="hidden" name="body" value={body} />
      <ImageUploader
        projectId={project.id}
        existingImages={project.images.map(img => ({ id: img.id, filename: img.filename }))}
        onInsertShortcode={handleInsertShortcode}
      />

      {/* Case Study */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Case Study (optional)</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Problem</label>
          <textarea value={problem} onChange={e => setProblem(e.target.value)} rows={3} className="w-full border p-2 rounded" />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Approach</label>
          <textarea value={approach} onChange={e => setApproach(e.target.value)} rows={3} className="w-full border p-2 rounded" />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Result</label>
          <textarea value={result} onChange={e => setResult(e.target.value)} rows={3} className="w-full border p-2 rounded" />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Metrics</label>
          <textarea value={metrics} onChange={e => setMetrics(e.target.value)} rows={2} className="w-full border p-2 rounded" />
        </div>

        {/* Before / After Image Selection */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-sm font-medium mb-1">Before Image</label>
            <select
              value={beforeImageId}
              onChange={(e) => setBeforeImageId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {imageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">After Image</label>
            <select
              value={afterImageId}
              onChange={(e) => setAfterImageId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {imageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Project"}
        </button>
        <button
          type="button"
          onClick={handleGeneratePreview}
          className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Generate Preview Link
        </button>
      </div>
    </form>
  );
}