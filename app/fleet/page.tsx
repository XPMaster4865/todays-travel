import fs from "fs";
import path from "path";
import FleetCarousel from "@/components/FleetCarousel";

export default function Fleet() {
  const liveriesDir = path.join(process.cwd(), "public", "liveries");
  const images = fs
    .readdirSync(liveriesDir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => `/liveries/${f}`);

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Our <span className="text-[#c084fc]">Fleet</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">
        Browse our full fleet of vehicles operating in Croydon Bus Simulator
      </p>

      <FleetCarousel images={images} />
    </div>
  );
}
