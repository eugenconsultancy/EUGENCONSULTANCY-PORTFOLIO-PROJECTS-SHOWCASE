"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";

type Cert = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  verificationUrl: string | null;
  logo: string | null;
  status: string;
};

export function CertificationsManager() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form fields
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    date: "",
    verificationUrl: "",
    logo: "",
    status: "Active",
  });

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/certifications");
    if (res.ok) {
      const data = await res.json();
      setCerts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCerts();
  }, [fetchCerts]);

  const resetForm = () => {
    setForm({ title: "", issuer: "", date: "", verificationUrl: "", logo: "", status: "Active" });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId
      ? `/api/admin/certifications/${editingId}`
      : "/api/admin/certifications";
    const method = editingId ? "PUT" : "POST";

    const payload = {
      title: form.title,
      issuer: form.issuer,
      date: form.date,
      verificationUrl: form.verificationUrl || null,
      logo: form.logo || null,
      status: form.status,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchCerts();
      resetForm();
    }
  };

  const handleEdit = (cert: Cert) => {
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      verificationUrl: cert.verificationUrl || "",
      logo: cert.logo || "",
      status: cert.status,
    });
    setEditingId(cert.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this certification?")) return;
    const res = await fetch(`/api/admin/certifications/${id}`, { method: "DELETE" });
    if (res.ok) await fetchCerts();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Certifications & Badges</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"
      >
        <input
          required
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        />
        <input
          required
          placeholder="Issuer *"
          value={form.issuer}
          onChange={(e) => setForm({ ...form, issuer: e.target.value })}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        />
        <input
          required
          placeholder="Date (e.g. 2024-06)"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        />
        <input
          placeholder="Verification URL"
          value={form.verificationUrl}
          onChange={(e) => setForm({ ...form, verificationUrl: e.target.value })}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        />
        <input
          placeholder="Logo URL (optional)"
          value={form.logo}
          onChange={(e) => setForm({ ...form, logo: e.target.value })}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="flex items-center gap-2 md:col-span-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
          >
            {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? "Update" : "Add Certification"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : certs.length === 0 ? (
        <p className="text-gray-500 text-sm">No certifications yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{cert.title}</p>
                <p className="text-xs text-gray-500">{cert.issuer} · {cert.date}</p>
                {cert.verificationUrl && (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline mt-1 block"
                  >
                    Verify
                  </a>
                )}
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    cert.status === "Active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                  }`}
                >
                  {cert.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(cert)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
