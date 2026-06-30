import fs from "fs";
import path from "path";
import GalleryGrid from "@/components/GalleryGrid";

export default function Gallery() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");
  const images = fs
    .readdirSync(galleryDir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort()
    .map((f) => `/gallery/${f}`);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        <span className="text-[#2dd4bf]">Gallery</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">
        Photos from Todays Travel in Croydon Bus Simulator
      </p>

      {images.length === 0 ? (
        <p className="text-[#f0eaff]/30">No images uploaded yet.</p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </div>
  );
}
