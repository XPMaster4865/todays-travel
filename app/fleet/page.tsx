import fs from "fs";
import path from "path";
import FleetCarousel from "@/components/FleetCarousel";

export default function Fleet() {
  const liveriesDir = path.join(process.cwd(), "public", "liveries");

  const groups = fs
    .readdirSync(liveriesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((d) => ({
      name: d.name,
      images: fs
        .readdirSync(path.join(liveriesDir, d.name))
        .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
        .sort()
        .map((f) => `/liveries/${d.name}/${f}`),
    }))
    .filter((g) => g.images.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Our <span className="text-[#c084fc]">Fleet</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">
        Browse our full fleet — use the arrows to switch between vehicle types
      </p>

      <FleetCarousel groups={groups} />
    </div>
  );
}
