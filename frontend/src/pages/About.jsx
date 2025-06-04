export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Decorative Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2)' }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-red-400 mb-4">Welcome to Tiny Concerts <span className="text-red-500"></span></h1>
          <p className="text-gray-300 text-lg">
            Your platform to discover, save, and relive the best musical moments.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <Feature icon="🎥" title="Explore" text="Discover unique concert videos from artists across all genres." />
          <Feature icon={<span className="text-red-500">❤️</span>} title="Save" text="Add to your favorites and organize your music collection." />
          <Feature icon="🔥" title="Engage" text="Like top moments, create playlists, and share what inspires you." />
        </div>

        {/* Mission and Vision */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-red-300 text-center mb-6">Our Mission</h2>
          <p className="text-center text-gray-400 max-w-3xl mx-auto leading-relaxed">
            At <span className="font-semibold text-red-200">Tiny Concerts</span>, we believe music is more than sound —
            it's connection, emotion, and memory. Our mission is to make concerts accessible to everyone, anywhere,
            through an immersive and engaging digital experience.
          </p>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-red-300 text-center mb-10">What Our Users Say</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial name="Joana M." text="I discovered amazing bands here. It's like going to a concert from your couch!" />
            <Testimonial name="Carlos T." text="The interface is beautiful and I love saving my favorite videos." />
            <Testimonial name="Ana B." text="Finally, a music app that gets me. Simple, fast, and full of talent!" />
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold mb-4">Ready to discover your next favorite concert?</h3>
          <a
            href="/videos"
            className="inline-block mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition"
          >
            Explore Videos Now
          </a>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-red-500/40 transition">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-xl font-semibold text-red-300 mb-2">{title}</h3>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}

function Testimonial({ name, text }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-red-500/30 transition text-sm">
      <p className="text-gray-300 italic mb-4">"{text}"</p>
      <p className="text-red-400 font-semibold">– {name}</p>
    </div>
  );
}
