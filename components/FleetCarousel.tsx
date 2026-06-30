"use client";
import { useState } from "react";

export default function FleetCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  if (images.length === 0) return <p className="text-[#f0eaff]/40">No fleet images found.</p>;

  const label = images[current]
    .replace("/liveries/", "")
    .replace(/\.\w+$/, "");

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Main image */}
      <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-purple-900/40 bg-[#130d24]">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={label}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}

        {/* Arrow buttons */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0f0a1e]/80 border border-purple-900/40 hover:bg-[#8b3cf7]/60 flex items-center justify-center transition-colors"
          aria-label="Previous"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0f0a1e]/80 border border-purple-900/40 hover:bg-[#8b3cf7]/60 flex items-center justify-center transition-colors"
          aria-label="Next"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-[#0f0a1e]/80 text-xs text-[#f0eaff]/60 px-3 py-1 rounded-full border border-purple-900/30">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Vehicle name */}
      <p className="text-lg font-semibold text-[#c084fc]">{label}</p>

      {/* Dot indicators */}
      <div className="flex gap-2 flex-wrap justify-center max-w-sm">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-[#8b3cf7]" : "bg-[#f0eaff]/20 hover:bg-[#f0eaff]/40"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
