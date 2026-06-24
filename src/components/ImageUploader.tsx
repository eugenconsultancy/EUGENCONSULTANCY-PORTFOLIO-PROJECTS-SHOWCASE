"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { deleteProjectImage } from "@/lib/actions/projects";
import toast from "react-hot-toast";

type ImageData = {
  id: number;
  filename: string;
  url?: string;
};

type Props = {
  projectId: number;
  existingImages?: ImageData[];
  onInsertShortcode: (shortcode: string) => void;
};

export function ImageUploader({
  projectId,
  existingImages = [],
  onInsertShortcode,
}: Props) {
  const [images, setImages] = useState<ImageData[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId.toString());

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.id) {
        setImages((prev) => [
          ...prev,
          { id: data.id, filename: data.filename, url: data.url },
        ]);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    try {
      await deleteProjectImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete image");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium block">Project Images</label>
      <div className="flex flex-wrap gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative border rounded overflow-hidden w-32 h-32 group"
          >
            <Image
              src={img.url || `/uploads/projects/${img.filename}`}
              alt=""
              fill
              className="object-cover"
            />
            {/* Insert button (existing) */}
            <button
              type="button"
              onClick={() => onInsertShortcode(`[img:${img.id}]`)}
              className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Insert
            </button>

            {/* Delete button (top-right) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(img.id);
              }}
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete image"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center">
          <label className="cursor-pointer p-4 text-center text-gray-500 text-sm">
            {uploading ? "Uploading..." : "Upload Image"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
