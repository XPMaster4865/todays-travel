const driverQuotes: { name: string; text: string }[] = [
  // Add driver testimonials here, e.g. { name: "Driver Name", text: "Their message..." },
];

const generalMessage = "For nearly 3 years, Todays Travel has been serving the streets of Croydon, and in that time we've built something we're really proud of. Our team is experienced and knows what it takes to run a smooth operation, but more than that, we're a kind and welcoming community that's always willing to listen. Whether you've been driving for years or you're just starting out, Todays Travel is open to anyone who wants to join us on the road.";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 overflow-hidden">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
        About <span className="text-[#c084fc]">Todays Travel</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-20 text-center">
        Get to know the people and the story behind our community.
      </p>

      <div className="flex flex-col gap-24">
        {/* Owner message — circle bursting in from the side */}
        <div className="relative pl-16 md:pl-28 pr-6 py-10 md:py-12">
          <div className="rounded-3xl rounded-l-[4rem] border border-[#fbbf24]/30 bg-gradient-to-br from-[#fbbf24]/10 via-[#130d24] to-[#130d24] p-8 md:p-10 pl-16 md:pl-24">
            <span className="absolute top-6 left-24 md:left-40 text-6xl text-[#fbbf24]/20 font-serif leading-none select-none">“</span>
            <p className="text-lg font-bold text-[#f0eaff] mb-1">Lucas</p>
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border text-[#fbbf24] border-[#fbbf24]/40 bg-[#fbbf24]/10 mb-5">
              Owner
            </span>
            <p className="text-[#f0eaff]/80 text-lg leading-relaxed relative z-10">
              Hey there, my name is Lucas. Owner of this amazing company. We have grown so far within this community. We help eachother out, we always are kind and friendly towards our team. Our community has been around for nearly 3 years staying strong and growing stronger. Without this community, this company would not be this today. We welcome all of our new drivers here. Welcome them with a nice warm role of driver 👀 We also respect you within the company. We host daily events such as shifts, livestreams and more!! Why not join us today?!
            </p>
          </div>
          <img
            src="/staff/lucas.png"
            alt="Lucas"
            className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-[#fbbf24]/50 shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)]"
          />
        </div>

        {/* Driver testimonials — staggered blobs */}
        {driverQuotes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-10">
              What Our <span className="text-[#2dd4bf]">Drivers</span> Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {driverQuotes.map((d, i) => (
                <div
                  key={d.name}
                  className={`rounded-[2.5rem] ${i % 2 === 0 ? "rounded-tl-lg md:translate-y-6" : "rounded-br-lg md:-translate-y-6"} border border-purple-900/40 bg-[#130d24] p-7 hover:border-[#2dd4bf]/60 transition-colors`}
                >
                  <p className="text-[#f0eaff]/70 leading-relaxed mb-4">{d.text}</p>
                  <p className="text-sm font-bold text-[#2dd4bf]">— {d.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General message — tall vertical rectangle, offset to the side */}
        {generalMessage && (
          <div className="flex justify-center md:justify-end">
            <div className="flex w-full md:w-[26rem] rounded-3xl border border-[#2dd4bf]/30 bg-[#130d24] overflow-hidden md:-rotate-1 shadow-[0_0_50px_-20px_rgba(45,212,191,0.4)]">
              <div className="w-3 md:w-4 bg-gradient-to-b from-[#2dd4bf] to-[#8b3cf7] shrink-0" />
              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-4 text-[#2dd4bf]">Our Story</h2>
                <p className="text-[#f0eaff]/70 leading-relaxed">{generalMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
