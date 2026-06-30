"use client";
import { useState } from "react";

export default function GalleryGrid({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((i) => (i! - 1 + images.length) % images.length);
  const next = () => setLightbox((i) => (i! + 1) % images.length);

  return (
    <>
      {/* Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightbox(i)}
            className="block w-full rounded-xl overflow-hidden border border-purple-900/30 hover:border-[#8b3cf7]/60 transition-all hover:scale-[1.02] focus:outline-none"
          >
            <img src={src} alt="" className="w-full h-auto object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Image */}
          <img
            src={images[lightbox]}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0f0a1e]/80 border border-purple-900/40 hover:bg-[#8b3cf7]/60 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0f0a1e]/80 border border-purple-900/40 hover:bg-[#8b3cf7]/60 flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0f0a1e]/80 border border-purple-900/40 hover:bg-[#8b3cf7]/60 flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0f0a1e]/80 text-xs text-[#f0eaff]/60 px-4 py-1.5 rounded-full border border-purple-900/30">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
