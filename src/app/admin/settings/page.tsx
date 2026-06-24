import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import Image from "next/image";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const profile = await db.profile.findFirst();

  return (
    <div className="space-y-10">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -top-8 h-72 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 40px)",
          }}
        />
        <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">Admin</p>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Settings</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage your public profile and portfolio content.</p>
        </div>
      </div>

      {profile && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 shadow-sm flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 relative">
            {profile.picture ? (
              <Image src={profile.picture} alt={profile.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-500">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.status || "No status set"}</p>
            <p className="text-xs text-gray-400 mt-1">{profile.website || "No website"}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <ProfileSettingsForm profile={profile} />
      </div>
    </div>
  );
}
