import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { CommandPalette } from "@/components/CommandPalette";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Footer } from "@/components/Footer";
import { db } from "@/lib/db";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    select: { title: true, slug: true, techStack: true },
  });

  const commandItems = projects.map((p) => ({
    label: p.title,
    href: `/projects/${p.slug}`,
    category: p.techStack.split(",")[0]?.trim() || "Project",
  }));
  commandItems.push(
    { label: "Home", href: "/", category: "Page" },
    { label: "Contact", href: "/contact", category: "Page" },
    { label: "Projects", href: "/projects", category: "Page" }
  );

  return (
    <>
      <ReadingProgress />
      <Navbar />
      <CommandPalette items={commandItems} />
      <PageTransition>
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
          {children}
        </main>
      </PageTransition>
      <MobileBottomNav />
      <ScrollToTop />
      <Footer />
    </>
  );
}
