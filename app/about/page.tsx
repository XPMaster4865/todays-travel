export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        About <span className="text-[#c084fc]">Todays Travel</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">Who we are and what we do</p>

      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <div>
          <h2 className="text-xl font-bold text-[#2dd4bf] mb-3">Our Story</h2>
          <p className="text-[#f0eaff]/70 leading-relaxed">
            Todays Travel started as a passion project to bring an authentic London bus experience to Roblox.
            Based in the Croydon Bus Simulator, we operate a growing fleet of double-decker buses across routes
            that mirror the real streets of Croydon.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2dd4bf] mb-3">Our Mission</h2>
          <p className="text-[#f0eaff]/70 leading-relaxed">
            We aim to create the most realistic and enjoyable bus simulation experience on Roblox. From
            accurate route maps to custom-painted liveries, every detail matters to us.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-[#c084fc]">Our Liveries</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Standard Purple", colour: "#8b3cf7", desc: "Our iconic deep purple and lavender livery — the face of Todays Travel." },
            { name: "Silver Edition", colour: "#9ca3af", desc: "A sleek silver finish for our premium fleet vehicles." },
            { name: "Purple & Teal", colour: "#2dd4bf", desc: "A vibrant two-tone design combining purple with teal accent stripes." },
          ].map((l) => (
            <div key={l.name} className="rounded-xl border border-purple-900/30 p-4">
              <div className="w-full h-3 rounded-full mb-3" style={{ background: l.colour }} />
              <h3 className="font-bold text-sm mb-1">{l.name}</h3>
              <p className="text-xs text-[#f0eaff]/50">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-[#8b3cf7]/20 to-[#2dd4bf]/10 border border-[#8b3cf7]/30 p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Want to get involved?</h2>
        <p className="text-[#f0eaff]/60 mb-6">Join our Discord to become part of the Todays Travel family.</p>
        <a
          href="https://discord.gg/placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold transition-colors"
        >
          Join Discord
        </a>
      </div>
    </div>
  );
}
