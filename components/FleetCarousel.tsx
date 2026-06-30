"use client";
import { useState } from "react";

type BusGroup = { name: string; images: string[] };

export default function FleetCarousel({ groups }: { groups: BusGroup[] }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);

  if (groups.length === 0) return <p className="text-[#f0eaff]/40">No fleet images found.</p>;

  const group = groups[groupIndex];

  const prevGroup = () => {
    setGroupIndex((g) => (g - 1 + groups.length) % groups.length);
    setImgIndex(0);
  };
  const nextGroup = () => {
    setGroupIndex((g) => (g + 1) % groups.length);
    setImgIndex(0);
  };

  return (
    <div className="flex flex-col items-center gap-8">

      {/* Vehicle type navigation */}
      <div className="flex items-center gap-6 w-full max-w-3xl justify-between">
        <button
          onClick={prevGroup}
          className="w-10 h-10 rounded-full bg-[#130d24] border border-purple-900/40 hover:bg-[#8b3cf7]/60 flex items-center justify-center transition-colors shrink-0"
          aria-label="Previous vehicle"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <p className="text-2xl font-extrabold text-[#c084fc]">{group.name}</p>
          <p className="text-xs text-[#f0eaff]/40 mt-1">{groupIndex + 1} of {groups.length} vehicles</p>
        </div>
        <button
          onClick={nextGroup}
          className="w-10 h-10 rounded-full bg-[#130d24] border border-purple-900/40 hover:bg-[#8b3cf7]/60 flex items-center justify-center transition-colors shrink-0"
          aria-label="Next vehicle"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Main image with livery arrows overlaid */}
      <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-purple-900/40 bg-[#130d24]">
        {group.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={group.name}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-400"
            style={{ opacity: i === imgIndex ? 1 : 0 }}
          />
        ))}

        {/* Livery arrows — only show if multiple images */}
        {group.images.length > 1 && (
          <>
            <button
              onClick={() => setImgIndex((c) => (c - 1 + group.images.length) % group.images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0f0a1e]/80 border border-[#2dd4bf]/40 hover:bg-[#2dd4bf]/30 flex items-center justify-center transition-colors"
              aria-label="Previous livery"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setImgIndex((c) => (c + 1) % group.images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0f0a1e]/80 border border-[#2dd4bf]/40 hover:bg-[#2dd4bf]/30 flex items-center justify-center transition-colors"
              aria-label="Next livery"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3 bg-[#0f0a1e]/80 text-xs text-[#f0eaff]/60 px-3 py-1 rounded-full border border-purple-900/30">
              {imgIndex + 1} / {group.images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip (if multiple images for this bus) */}
      {group.images.length > 1 && (
        <div className="flex gap-3 flex-wrap justify-center">
          {group.images.map((src, i) => (
            <button
              key={src}
              onClick={() => setImgIndex(i)}
              className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                i === imgIndex ? "border-[#8b3cf7]" : "border-purple-900/30 hover:border-[#8b3cf7]/50"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Vehicle dot nav */}
      <div className="flex gap-2 flex-wrap justify-center max-w-lg">
        {groups.map((g, i) => (
          <button
            key={g.name}
            onClick={() => { setGroupIndex(i); setImgIndex(0); }}
            title={g.name}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === groupIndex ? "bg-[#8b3cf7]" : "bg-[#f0eaff]/20 hover:bg-[#f0eaff]/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
