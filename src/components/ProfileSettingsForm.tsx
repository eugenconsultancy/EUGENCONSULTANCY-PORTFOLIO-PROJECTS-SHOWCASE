"use client";

import { useState } from "react";
import {
  updateProfile,
  addExperience,
  deleteExperience,
  addCertification,
  deleteCertification,
} from "@/lib/actions/profile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

type ProfileData = {
  id: number;
  name: string;
  bio: string;
  picture: string | null;
  status: string | null;
  skills: string | null;
  certifications: string | null;
  availability: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  radarJson: string | null;
};

type Exp = {
  id: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

type Cert = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  verificationUrl: string | null;
  logo: string | null;
};

export function ProfileSettingsForm({
  profile,
  experiences = [],
  certifications = [],
}: {
  profile: ProfileData | null;
  experiences?: Exp[];
  certifications?: Cert[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "experience" | "certs">("profile");

  const inputClass =
    "w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-950 shadow-sm transition-all duration-300 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:border-blue-500 focus:outline-none";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expDesc, setExpDesc] = useState("");

  const handleAddExp = async () => {
    const formData = new FormData();
    formData.append("title", expTitle);
    formData.append("company", expCompany);
    formData.append("startDate", expStart);
    formData.append("endDate", expEnd);
    formData.append("description", expDesc);
    await addExperience(formData);
    toast.success("Experience added");
    setExpTitle(""); setExpCompany(""); setExpStart(""); setExpEnd(""); setExpDesc("");
    router.refresh();
  };

  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certUrl, setCertUrl] = useState("");
  const [certLogo, setCertLogo] = useState<File | null>(null);

  const handleAddCert = async () => {
    const formData = new FormData();
    formData.append("title", certTitle);
    formData.append("issuer", certIssuer);
    formData.append("date", certDate);
    formData.append("verificationUrl", certUrl);
    if (certLogo) formData.append("logo", certLogo);
    await addCertification(formData);
    toast.success("Certification added");
    setCertTitle(""); setCertIssuer(""); setCertDate(""); setCertUrl(""); setCertLogo(null);
    router.refresh();
  };

  const skillsArray = profile?.skills ? profile.skills.split(",").map(s => s.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Statistics row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{skillsArray.length}</p>
          <p className="text-sm text-gray-500">Skills</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{certifications.length}</p>
          <p className="text-sm text-gray-500">Certifications</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{experiences.length}</p>
          <p className="text-sm text-gray-500">Jobs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
        {(["profile", "experience", "certs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab === "profile" ? "Profile" : tab === "experience" ? "Experience" : "Certifications"}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: picture card */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 text-center border border-blue-100 dark:border-blue-900/30">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-xl">
                {profile?.picture ? (
                  <Image src={profile.picture} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl text-gray-400">
                    👤
                  </div>
                )}
              </div>
              <p className="mt-4 font-medium text-gray-900 dark:text-white">Profile Photo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended size: 400×400</p>
            </div>
          </div>

          {/* Right: profile form */}
          <form id="profileForm" onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8 space-y-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" name="name" defaultValue={profile?.name ?? ""} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Professional Summary (Bio)</label>
                <textarea name="bio" rows={4} defaultValue={profile?.bio ?? ""} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
                <input type="text" name="status" defaultValue={profile?.status ?? ""} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Skills (comma‑separated)</label>
                <input type="text" name="skills" defaultValue={profile?.skills ?? ""} className={inputClass} placeholder="React, TypeScript, Python" />
                <div className="flex flex-wrap gap-1 mt-2">
                  {skillsArray.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Availability & Engagement</h2>
              <textarea name="availability" rows={3} defaultValue={profile?.availability ?? ""} className={inputClass} />
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Social Profiles</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Website</label>
                  <input type="url" name="website" defaultValue={profile?.website ?? ""} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">GitHub</label>
                  <input type="url" name="github" defaultValue={profile?.github ?? ""} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">LinkedIn</label>
                  <input type="url" name="linkedin" defaultValue={profile?.linkedin ?? ""} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Twitter</label>
                  <input type="url" name="twitter" defaultValue={profile?.twitter ?? ""} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills Radar (JSON)</h2>
              <textarea
                name="radarJson"
                rows={6}
                defaultValue={profile?.radarJson ?? ""}
                className={`${inputClass} font-mono text-sm`}
                placeholder='{"labels":["React","Node.js","CSS"],"datasets":[{"label":"Proficiency","data":[90,80,85]}]}'
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Change Picture</label>
              <input type="file" name="picture" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </form>
        </div>
      )}

      {/* Experience tab */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Experience</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" value={expTitle} onChange={e => setExpTitle(e.target.value)} className={inputClass} />
              <input type="text" placeholder="Company" value={expCompany} onChange={e => setExpCompany(e.target.value)} className={inputClass} />
              <input type="text" placeholder="Start Date" value={expStart} onChange={e => setExpStart(e.target.value)} className={inputClass} />
              <input type="text" placeholder="End Date (optional)" value={expEnd} onChange={e => setExpEnd(e.target.value)} className={inputClass} />
            </div>
            <textarea placeholder="Description" value={expDesc} onChange={e => setExpDesc(e.target.value)} className={`${inputClass} mt-4`} rows={3} />
            <button
              onClick={handleAddExp}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md"
            >
              Add Experience
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Experience</h2>
            {experiences.length === 0 && <p className="text-gray-500">No experiences added yet.</p>}
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company} — {exp.startDate} - {exp.endDate || "Present"}</p>
                    {exp.description && <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{exp.description}</p>}
                  </div>
                  <button onClick={() => { deleteExperience(exp.id); toast.success("Experience deleted"); router.refresh(); }} className="text-red-600 hover:text-red-800 text-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications tab */}
      {activeTab === "certs" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Certification</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" value={certTitle} onChange={e => setCertTitle(e.target.value)} className={inputClass} />
              <input type="text" placeholder="Issuer" value={certIssuer} onChange={e => setCertIssuer(e.target.value)} className={inputClass} />
              <input type="text" placeholder="Date" value={certDate} onChange={e => setCertDate(e.target.value)} className={inputClass} />
              <input type="url" placeholder="Verification URL" value={certUrl} onChange={e => setCertUrl(e.target.value)} className={inputClass} />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Logo (optional)</label>
              <input type="file" accept="image/*" onChange={e => setCertLogo(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
            </div>
            <button
              onClick={handleAddCert}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md"
            >
              Add Certification
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Certifications</h2>
            {certifications.length === 0 && <p className="text-gray-500">No certifications added yet.</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.map(cert => (
                <div key={cert.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4 flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-xl">
                    {cert.logo ? <Image src={cert.logo} alt={cert.title} width={32} height={32} className="object-contain" /> : "🏆"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{cert.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cert.issuer} · {cert.date}</p>
                    {cert.verificationUrl && (
                      <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                        Verify →
                      </a>
                    )}
                  </div>
                  <button onClick={() => { deleteCertification(cert.id); toast.success("Certification deleted"); router.refresh(); }} className="text-red-600 hover:text-red-800 text-sm flex-shrink-0">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky save bar */}
      {activeTab === "profile" && (
        <div className="sticky bottom-4 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">You have unsaved changes</p>
          <button
            type="submit"
            form="profileForm"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}
    </div>
  );
}
