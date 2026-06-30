import fs from "fs";
import path from "path";
import FleetCarousel from "@/components/FleetCarousel";

function getVehicleName(filename: string): string {
  return filename
    .replace(/\.\w+$/, "")          // remove extension
    .replace(/\s*\(?\d+\)?$/, "")  // remove trailing (1), (2), 3) etc
    .replace(/^Todays Travel\s*/i, "") // strip "Todays Travel" prefix
    .trim();
}

export default function Fleet() {
  const liveriesDir = path.join(process.cwd(), "public", "liveries");
  const files = fs
    .readdirSync(liveriesDir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort();

  // Group by vehicle name
  const groupMap = new Map<string, string[]>();
  for (const f of files) {
    const name = getVehicleName(f);
    if (!groupMap.has(name)) groupMap.set(name, []);
    groupMap.get(name)!.push(`/liveries/${f}`);
  }

  const groups = Array.from(groupMap.entries()).map(([name, images]) => ({ name, images }));

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
