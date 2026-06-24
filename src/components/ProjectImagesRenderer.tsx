"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { Lightbox } from "./Lightbox";
import { ZoomIn } from "lucide-react";
import { CodeModal } from "./CodeModal";

type ImageInfo = {
  src: string;
  alt: string;
};

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

  // Code block renderer – inline blocks just render as code,
  // fenced blocks get an "Expand" button to open the modal.
  const CodeRenderer: React.FC<{
    className?: string;
    children?: React.ReactNode;
    inline?: boolean;
  }> = ({ className, children, inline, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : undefined;
    const codeString = String(children).replace(/\n$/, "");

    if (!inline && language) {
      return (
        <div className="relative group cursor-pointer">
          <button
            onClick={() => setCodeModal({ code: codeString, language })}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
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

  const ImageRenderer = ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src) return null;
    return (
      <img
        src={src}
        alt={alt || ""}
        className="cursor-zoom-in rounded-lg hover:opacity-90 transition"
        onClick={() => openLightbox(src)}
        style={{ maxWidth: "100%" }}
      />
    );
  };

  const showGallery = images.length > 1;

  return (
    <>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            code: CodeRenderer,
            img: ImageRenderer,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {showGallery && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Project Gallery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  onClick={() => {
                    const foundIdx = images.findIndex((i) => i.src === img.src);
                    if (foundIdx !== -1) setLightboxIndex(foundIdx);
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-white" />
                </div>
                {img.alt && (
                  <div className="p-3 text-sm text-gray-600 dark:text-gray-400">
                    {img.alt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

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
