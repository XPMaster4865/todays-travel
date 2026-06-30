"use client";
import { useEffect, useState } from "react";

const images = [
  "/Todays Travel Streetdeck (1).png",
  "/Todays Travel Streetdeck (2).png",
  "/Todays Travel Streetdeck (3).png",
];

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function HeroBackground() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % images.length;
      });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Previous image fading out */}
      {prev !== null && (
        <img
          key={`prev-${prev}`}
          src={images[prev]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-1000"
        />
      )}
      {/* Current image */}
      <img
        key={`curr-${current}`}
        src={images[current]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 transition-opacity duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1e]/50 via-[#0f0a1e]/30 to-[#0f0a1e]" />
    </div>
  );
}
