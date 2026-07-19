"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { Lightbox } from "./Lightbox";
import { ZoomIn } from "lucide-react";
import { CodeModal } from "./CodeModal";
import Image from "next/image";

type ImageInfo = {
  src: string;
  alt: string;
};

type CodeRendererProps = {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
};

// ── Responsive table wrapper ──
function ResponsiveTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
        {children}
      </table>
    </div>
  );
}

export function ProjectImagesRenderer({
  content,
  images,
}: {
  content: string;
  images: ImageInfo[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [codeModal, setCodeModal] = useState<{ code: string; language?: string } | null>(null);

  const openLightbox = (src: string) => {
    const idx = images.findIndex((img) => img.src === src);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const handleClose = () => setLightboxIndex(null);
  const handlePrev = () =>
    setLightboxIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
  const handleNext = () =>
    setLightboxIndex((prev) =>
      prev !== null ? Math.min(images.length - 1, prev + 1) : null
    );

  // ── Code block renderer with expandable modal ──
  const CodeRenderer = ({ className, children, inline, ...props }: CodeRendererProps) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : undefined;
    const codeString = String(children).replace(/\n$/, "");

    if (!inline && language) {
      return (
        <div className="relative group">
          <button
            onClick={() => setCodeModal({ code: codeString, language })}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            aria-label="Expand code"
          >
            Expand
          </button>
          <pre className={className} {...props}>
            <code className={className}>{children}</code>
          </pre>
        </div>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  // ── Inline image renderer with lightbox trigger ──
  const ImageRenderer = ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src) return null;
    return (
      <span className="relative inline-block max-w-full">
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={450}
          className="cursor-zoom-in rounded-lg hover:opacity-90 transition-opacity"
          style={{ maxWidth: "100%", height: "auto" }}
          onClick={() => openLightbox(src)}
          priority={false}
        />
      </span>
    );
  };

  const showGallery = images.length > 1;

  return (
    <>
      {/* ── Markdown content ── */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeHighlight,
            rehypeSlug,
            rehypeRaw,
          ]}
          components={{
            code: CodeRenderer,
            img: ImageRenderer,
            // ── Table overrides ──
            table: ({ children }) => <ResponsiveTable>{children}</ResponsiveTable>,
            thead: ({ children }) => (
              <thead className="bg-gray-50 dark:bg-gray-800/50">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* ── Gallery section ── */}
      {showGallery && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Project Gallery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 h-64 cursor-pointer"
                onClick={() => {
                  const foundIdx = images.findIndex((i) => i.src === img.src);
                  if (foundIdx !== -1) setLightboxIndex(foundIdx);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const foundIdx = images.findIndex((i) => i.src === img.src);
                    if (foundIdx !== -1) setLightboxIndex(foundIdx);
                  }
                }}
                aria-label={`View ${img.alt || `image ${idx + 1}`} in lightbox`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || `Gallery image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                {img.alt && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-sm text-white bg-gradient-to-t from-black/70 to-transparent">
                    {img.alt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {/* ── Code modal ── */}
      {codeModal && (
        <CodeModal
          code={codeModal.code}
          language={codeModal.language}
          onClose={() => setCodeModal(null)}
        />
      )}
    </>
  );
}