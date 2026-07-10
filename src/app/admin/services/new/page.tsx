"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewServicePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "Data Analytics",
        summary: "",
        description: "",
        icon: "📊",
        features: "[]",
        tools: "[]",
        benefits: "[]",
        process: "[]",
        pricing: "",
        status: "DRAFT",
        displayOrder: "0",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "title") {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const form = new FormData();
            // Append all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    form.append(key, value);
                }
            });
            // Append image if selected
            if (selectedImage) {
                form.append("image", selectedImage);
            }

            const res = await fetch("/api/admin/services", {
                method: "POST",
                // ✅ DO NOT set Content-Type – browser will use multipart/form-data with boundary
                body: form,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to create service");
            }

            router.push("/admin/services");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create service");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/services" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">New Service</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new service offering</p>
                    </div>
                </div>
                <button type="submit" form="service-form" disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                    <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Service"}
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form id="service-form" onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., SPSS Data Analysis" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Slug *</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="spss-data-analysis" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="Data Analytics">Data Analytics</option>
                                <option value="SEO">SEO</option>
                                <option value="Security">Security</option>
                                <option value="Content">Content</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Icon (Emoji)</label>
                            <input type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="📊" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Summary *</label>
                        <textarea name="summary" value={formData.summary} onChange={handleChange} required rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Brief description..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows={6} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Detailed description..." />
                    </div>
                    {/* ✅ NEW: Image upload field */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Service Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300"
                        />
                        {selectedImage && (
                            <p className="mt-2 text-xs text-green-600 dark:text-green-400">Selected: {selectedImage.name}</p>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Features, Tools & Benefits (JSON format)</h2>
                    {["features", "tools", "benefits"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 capitalize">{field} (JSON array)</label>
                            <textarea name={field} value={(formData as any)[field]} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm" placeholder='["Item 1", "Item 2"]' />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Process (JSON array of steps)</label>
                        <textarea name="process" value={formData.process} onChange={handleChange} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm" placeholder='[{"step": "Step 1", "description": "Description"}]' />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Pricing (JSON object, optional)</label>
                        <textarea name="pricing" value={formData.pricing} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm" placeholder='{"basic": {"name": "Basic", "price": "$100", "features": ["Feature 1"]}}' />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Display Order</label>
                        <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
            </form>
        </div>
    );
}