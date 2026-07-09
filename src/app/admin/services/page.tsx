import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Briefcase, Eye, Edit, MessageSquare, Star } from "lucide-react";

export default async function AdminServicesPage() {
  const services = await db.service.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { inquiries: true, testimonials: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Services</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your service offerings</p>
        </div>
        <Link href="/admin/services/new" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" /> New Service
        </Link>
      </div>
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/80">
          <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" /> All Services ({services.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800/80">
          {services.map((service) => (
            <div key={service.id} className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center text-xl">{service.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{service.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${service.status === "PUBLISHED" ? "bg-green-100 dark:bg-green-900/30 text-green-700" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>{service.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-medium">{service.category}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{service._count.inquiries}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" />{service._count.testimonials}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/services/${service.slug}`} target="_blank" className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"><Eye className="w-4 h-4" /></Link>
                <Link href={`/admin/services/${service.id}`} className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50"><Edit className="w-4 h-4" /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
