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
    <div className="min-h-screen flex">
      {session && <AdminSidebar />}
      <div className="flex-1 flex flex-col">
        {session && <AdminTopbar />}
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
