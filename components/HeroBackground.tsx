"use client";
import { useEffect, useState } from "react";

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function HeroBackground({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
          style={{ opacity: i === current ? 0.4 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1e]/50 via-[#0f0a1e]/30 to-[#0f0a1e]" />
    </div>
  );
}
