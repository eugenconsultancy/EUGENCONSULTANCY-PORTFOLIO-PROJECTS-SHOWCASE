"use client";

import { useState, useRef } from "react";
import { MarkdownEditorWithPreview } from "./MarkdownEditorWithPreview";
import { updateProject, generatePreviewToken, deleteProjectImage } from "@/lib/actions/projects";
import { Upload, X, Star, Copy, ExternalLink, ImagePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type ProjectImage = {
  id: number;
  filename: string;
  alt: string | null;
};

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
  images: ProjectImage[];
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
  const [images, setImages] = useState<ProjectImage[]>(project.images);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mainImageId, setMainImageId] = useState<number | null>(
    // Assume the first image is main if none marked – you can adjust
    project.images[0]?.id ?? null
  );

  const handleInsertShortcode = (shortcode: string) => {
    setBody((prev) => prev + shortcode);
  };

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("projectId", String(project.id));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const uploaded: { id: number; filename: string }[] = await res.json();
      const newImages = uploaded.map((img) => ({ id: img.id, filename: img.filename, alt: null }));
      setImages((prev) => [...prev, ...newImages]);
      if (!mainImageId && newImages.length > 0) setMainImageId(newImages[0].id);
      toast.success(`${files.length} image(s) uploaded`);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteProjectImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      if (mainImageId === imageId) {
        setMainImageId(images.length > 1 ? images.find((img) => img.id !== imageId)?.id ?? null : null);
      }
      toast.success("Image deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete image");
    }
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
      toast.success("Project saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePreview = async () => {
    const token = await generatePreviewToken(project.slug);
    const url = `${window.location.origin}/projects/${project.slug}?preview=${token}`;
    await navigator.clipboard.writeText(url);
    toast.success("Preview URL copied to clipboard");
  };

  const imageOptions = [
    { value: "none", label: "— No image —" },
    ...images.map((img) => ({
      value: img.id.toString(),
      label: `Image #${img.id}${img.alt ? ` (${img.alt})` : ""}`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
          <input
            type="text" name="title" defaultValue={project.title} required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Slug *</label>
          <input
            type="text" name="slug" defaultValue={project.slug} required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Summary *</label>
        <textarea
          name="summary" defaultValue={project.summary} rows={3} required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tech Stack (comma separated) *</label>
          <input
            type="text" name="techStack" defaultValue={project.techStack} required
            placeholder="React, TypeScript, Tailwind"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Display Order</label>
          <input
            type="number" name="displayOrder" defaultValue={project.displayOrder}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Live URL</label>
          <input
            type="url" name="liveUrl" defaultValue={project.liveUrl ?? ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">GitHub URL</label>
          <input
            type="url" name="githubUrl" defaultValue={project.githubUrl ?? ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Dependencies (one per line)</label>
        <textarea
          name="dependencies" defaultValue={project.dependencies ?? ""} rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
        <select
          name="status" defaultValue={project.status}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Framework Rationale</label>
        <textarea
          value={frameworkRationale} onChange={(e) => setFrameworkRationale(e.target.value)} rows={4}
          placeholder="Explain your tech choices…"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
      </div>

      {/* Markdown Editor */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Body (Markdown)</label>
        <MarkdownEditorWithPreview value={body} onChange={setBody} />
        <input type="hidden" name="body" value={body} />
      </div>

      {/* Image Gallery & Upload */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Images</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleImageUpload(e.target.files);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        {images.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
            No images uploaded yet.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <img
                src={img.filename}
                alt={img.alt || "Project image"}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setMainImageId(img.id)}
                  className={`p-1.5 rounded-full ${mainImageId === img.id ? "bg-yellow-400 text-white" : "bg-white text-gray-700"} hover:scale-110 transition`}
                  title="Set as main image"
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="p-1.5 rounded-full bg-red-500 text-white hover:scale-110 transition"
                  title="Delete image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {mainImageId === img.id && (
                <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Case Study (optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Problem</label>
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Approach</label>
            <textarea value={approach} onChange={(e) => setApproach(e.target.value)} rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Result</label>
            <textarea value={result} onChange={(e) => setResult(e.target.value)} rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Metrics</label>
            <textarea value={metrics} onChange={(e) => setMetrics(e.target.value)} rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Before Image</label>
            <select value={beforeImageId} onChange={(e) => setBeforeImageId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {imageOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">After Image</label>
            <select value={afterImageId} onChange={(e) => setAfterImageId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {imageOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit" disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleGeneratePreview}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" /> Generate Preview Link
        </button>
      </div>
    </form>
  );
}