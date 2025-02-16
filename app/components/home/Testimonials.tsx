export default function Testimonials() {
  const testimonials = [
    {
      name: "Emily R.",
      quote: "This app has brought our family closer together through cooking!",
    },
    {
      name: "Michael T.",
      quote: "I love how easy it is to organize and share recipes!",
    },
    {
      name: "Sarah L.",
      quote: "A must-have for every family that loves food traditions.",
    },
  ];

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-5xl font-bold text-[var(--color-accent)] mb-8">
        What Our Users Say
      </h2>
      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {testimonials.map(({ name, quote }) => (
          <div
            key={name}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
          >
            <p className="italic text-gray-600 h-32">&quot;{quote}&quot;</p>
            <h3 className="mt-4 text-2xl font-bold text-[var(--color-dark)]">- {name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}