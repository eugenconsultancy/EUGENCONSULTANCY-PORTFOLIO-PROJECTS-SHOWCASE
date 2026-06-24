import { db } from "@/lib/db";
import { InquiryInbox } from "@/components/InquiryInbox";

export default async function InquiriesAdminPage() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      {/* Header */}
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
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Inquiries</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage contact form submissions.</p>
        </div>
      </div>

      <InquiryInbox inquiries={inquiries} />
    </div>
  );
}
