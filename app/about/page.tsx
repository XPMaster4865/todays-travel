const driverQuotes: { name: string; text: string }[] = [
  // Add driver testimonials here, e.g. { name: "Driver Name", text: "Their message..." },
];

const generalMessage = "";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        About <span className="text-[#c084fc]">Todays Travel</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-14">
        Get to know the people and the story behind our community.
      </p>

      <div className="flex flex-col gap-10">
        {/* Owner message */}
        <div className="relative rounded-3xl border border-[#fbbf24]/30 bg-gradient-to-br from-[#fbbf24]/10 via-[#130d24] to-[#130d24] p-8 md:p-10">
          <span className="absolute top-6 left-8 text-6xl text-[#fbbf24]/20 font-serif leading-none select-none">“</span>
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/staff/lucas.png"
              alt="Lucas"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#fbbf24]/40"
            />
            <div>
              <p className="text-lg font-bold text-[#f0eaff]">Lucas</p>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border text-[#fbbf24] border-[#fbbf24]/40 bg-[#fbbf24]/10">
                Owner
              </span>
            </div>
          </div>
          <p className="text-[#f0eaff]/80 text-lg leading-relaxed relative z-10">
            Hey there, my name is Lucas. Owner of this amazing company. We have grown so far within this community. We help eachother out, we always are kind and friendly towards our team. Our community has been around for nearly 3 years staying strong and growing stronger. Without this community, this company would not be this today. We welcome all of our new drivers here. Welcome them with a nice warm role of driver 👀 We also respect you within the company. We host daily events such as shifts, livestreams and more!! Why not join us today?!
          </p>
        </div>

        {/* Driver testimonials */}
        {driverQuotes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">
              What Our <span className="text-[#2dd4bf]">Drivers</span> Say
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {driverQuotes.map((d) => (
                <div
                  key={d.name}
                  className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6 hover:border-[#8b3cf7]/60 transition-colors"
                >
                  <p className="text-[#f0eaff]/70 leading-relaxed mb-4">{d.text}</p>
                  <p className="text-sm font-bold text-[#c084fc]">— {d.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General message */}
        {generalMessage && (
          <div className="rounded-3xl border border-purple-900/40 bg-[#130d24] p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-4 text-[#c084fc]">Our Story</h2>
            <p className="text-[#f0eaff]/70 text-lg leading-relaxed">{generalMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
