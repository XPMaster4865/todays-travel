import Link from "next/link";
import fs from "fs";
import path from "path";
import HeroBackground from "@/components/HeroBackground";
import FundsBar from "@/components/FundsBar";

export default function Home() {
  const liveriesDir = path.join(process.cwd(), "public", "liveries");
  const images = fs
    .readdirSync(liveriesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      fs.readdirSync(path.join(liveriesDir, d.name))
        .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
        .map((f) => `/liveries/${d.name}/${f}`)
    );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[90vh] px-4 py-24">
        <HeroBackground images={images} />

        <div className="inline-flex items-center gap-2 bg-[#8b3cf7]/20 border border-[#8b3cf7]/40 rounded-full px-4 py-1.5 text-sm text-[#c084fc] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
          Now operating in Croydon
        </div>

        <FundsBar />

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="text-[#c084fc]">Todays</span>{" "}
          <span className="text-[#2dd4bf]">Travel</span>
        </h1>

        <p className="max-w-xl text-lg text-[#f0eaff]/60 mb-10">
          Croydon&apos;s premier bus operator on Roblox. Hop on board and explore the streets of Croydon with our
          growing fleet of buses.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://discord.gg/zubDeVEUt6"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#8b3cf7] hover:bg-[#7c3aed] text-white font-semibold transition-colors"
          >
            Join Us
          </a>
          <Link
            href="/fleet"
            className="px-6 py-3 rounded-xl border border-[#2dd4bf]/40 hover:bg-[#2dd4bf]/10 text-[#2dd4bf] font-semibold transition-colors"
          >
            View Fleet
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-purple-900/30 bg-[#130d24] py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "20+", label: "Custom Routes" },
            { value: "4", label: "Liveries" },
            { value: "Croydon", label: "Operating Area" },
            { value: "80+", label: "Community Members" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-[#c084fc]">{s.value}</p>
              <p className="text-sm text-[#f0eaff]/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why ride with us?</h2>
          <p className="text-center text-[#f0eaff]/50 mb-14 max-w-lg mx-auto">
            We bring the authentic Croydon bus experience to Roblox.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🤝",
                title: "Our Community",
                desc: "With over 80 members and growing, Todays Travel is built on a foundation of warmth and inclusion. Everyone is welcome — whether you're a seasoned driver or just starting out.",
              },
              {
                icon: "🎉",
                title: "Fun Initiatives",
                desc: "From our Driver of the Week programme to organised driving lessons, there's always something going on. We make sure every member has something to look forward to.",
              },
              {
                icon: "🏛️",
                title: "Clear Structure",
                desc: "Our hierarchy is simple and transparent — Driver, Moderator, Co-owner, and Owner. Our moderation team acts quickly and fairly, so you can always expect a well-run experience.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6 hover:border-[#8b3cf7]/60 transition-colors"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-[#c084fc] mb-2">{f.title}</h3>
                <p className="text-sm text-[#f0eaff]/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-[#8b3cf7]/30 to-[#2dd4bf]/10 border border-[#8b3cf7]/30 p-12 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Join the community</h2>
          <p className="text-[#f0eaff]/60 mb-8">
            Connect with other drivers, get route updates, and stay in the loop on new fleet additions.
          </p>
          <a
            href="https://discord.gg/zubDeVEUt6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold transition-colors"
          >
            Join our Discord
          </a>
        </div>
      </section>
    </>
  );
}
