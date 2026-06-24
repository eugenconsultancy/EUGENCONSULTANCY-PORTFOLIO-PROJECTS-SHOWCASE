import "@/styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Developer Portfolio",
  description: "Showcase of my work — full-stack developer crafting elegant, performant web experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-all duration-500 antialiased"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        suppressHydrationWarning
      >
        <Providers>
          <ThemeProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  fontSize: "0.875rem",
                  padding: "12px 16px",
                  color: "#1e293b",
                },
              }}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
