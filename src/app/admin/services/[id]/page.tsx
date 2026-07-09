"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";

export default function EditServicePage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

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

    useEffect(() => {
        fetchService();
    }, [params.id]);

    const fetchService = async () => {
        try {
            const res = await fetch(`/api/admin/services/${params.id}`);
            if (!res.ok) throw new Error("Failed to fetch service");
            const service = await res.json();
            setFormData({
                title: service.title || "",
                slug: service.slug || "",
                category: service.category || "Data Analytics",
                summary: service.summary || "",
                description: service.description || "",
                icon: service.icon || "📊",
                features: service.features || "[]",
                tools: service.tools || "[]",
                benefits: service.benefits || "[]",
                process: service.process || "[]",
                pricing: service.pricing || "",
                status: service.status || "DRAFT",
                displayOrder: String(service.displayOrder || 0),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load service");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "title") {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            // Parse displayOrder as integer before sending
            const data = {
                ...formData,
                displayOrder: parseInt(formData.displayOrder) || 0,
                pricing: formData.pricing || null,
            };

            const res = await fetch(`/api/admin/services/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to update service");
            }

            router.push("/admin/services");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update service");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/services/${params.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete service");
            router.push("/admin/services");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete service");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/services" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Edit Service</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formData.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleDelete} disabled={deleting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />{deleting ? "Deleting..." : "Delete"}
                    </button>
                    <button type="submit" form="service-form" disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50">
                        <Save className="w-4 h-4" />{saving ? "Saving..." : "Update Service"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 text-sm">{error}</div>
            )}

            <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold mb-1.5">Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border" /></div>
                        <div><label className="block text-sm font-bold mb-1.5">Slug *</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border" /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-sm font-bold mb-1.5">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border"><option>Data Analytics</option><option>SEO</option><option>Security</option><option>Content</option></select></div>
                        <div><label className="block text-sm font-bold mb-1.5">Icon</label><input type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border" /></div>
                        <div><label className="block text-sm font-bold mb-1.5">Status</label><select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
                    </div>
                    <div><label className="block text-sm font-bold mb-1.5">Summary *</label><textarea name="summary" value={formData.summary} onChange={handleChange} required rows={2} className="w-full px-4 py-2.5 rounded-xl border resize-none" /></div>
                    <div><label className="block text-sm font-bold mb-1.5">Full Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={6} className="w-full px-4 py-2.5 rounded-xl border" /></div>
                </div>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
                    <h2 className="text-lg font-black">JSON Fields</h2>
                    <div><label className="block text-sm font-bold mb-1.5">Features</label><textarea name="features" value={formData.features} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-xl border font-mono text-sm" /></div>
                    <div><label className="block text-sm font-bold mb-1.5">Tools</label><textarea name="tools" value={formData.tools} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-xl border font-mono text-sm" /></div>
                    <div><label className="block text-sm font-bold mb-1.5">Benefits</label><textarea name="benefits" value={formData.benefits} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-xl border font-mono text-sm" /></div>
                    <div><label className="block text-sm font-bold mb-1.5">Process</label><textarea name="process" value={formData.process} onChange={handleChange} rows={6} className="w-full px-4 py-2.5 rounded-xl border font-mono text-sm" /></div>
                    <div><label className="block text-sm font-bold mb-1.5">Pricing</label><textarea name="pricing" value={formData.pricing} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-xl border font-mono text-sm" /></div>
                    <div><label className="block text-sm font-bold mb-1.5">Display Order</label><input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border" /></div>
                </div>
            </form>
        </div>
    );
}