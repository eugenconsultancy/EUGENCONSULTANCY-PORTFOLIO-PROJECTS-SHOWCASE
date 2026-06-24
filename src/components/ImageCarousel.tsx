"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";

type ImageInfo = {
  src: string;
  alt: string;
};

export function ImageCarousel({ images }: { images: ImageInfo[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Auto‑advance every 4 seconds
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [paused, images.length]);

  if (!images.length) return null;

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main image */}
      <div
        className="relative h-64 sm:h-80 md:h-96 cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[current].src}
          alt={images[current].alt}
          fill
          className="object-cover transition-opacity duration-500"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <span className="text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/40 backdrop-blur-sm">
            View Gallery
          </span>
        </div>
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                idx === current
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current ? "bg-white w-5" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={current}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
