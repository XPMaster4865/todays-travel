"use client";
import { useEffect, useState } from "react";
import GalleryGrid from "@/components/GalleryGrid";

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery/list")
      .then((res) => res.json())
      .then((data: { images: string[] }) => {
        setImages((data.images ?? []).map((key) => `/api/gallery/image?key=${encodeURIComponent(key)}`));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        <span className="text-[#2dd4bf]">Gallery</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">
        Photos from Todays Travel in Croydon Bus Simulator
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 rounded-full border-2 border-[#8b3cf7] border-t-transparent animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <p className="text-[#f0eaff]/30">No images uploaded yet.</p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </div>
  );
}
