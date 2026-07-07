import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopbar } from "@/components/AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {session && <AdminSidebar />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {session && <AdminTopbar />}

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-7 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}