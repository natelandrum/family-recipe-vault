import Image from "next/image";

export default function FeaturedRecipes() {
  const recipes = [
    {
      name: "Grandma's Apple Pie",
      image: "/apple-pie.jpg",
      description: "A delicious family favorite.",
      alt: "Apple Pie - Photo by Priscilla Du Preez",
    },
    {
      name: "Classic Lasagna",
      image: "/lasagna.jpg",
      description: "Perfect for gatherings.",
      alt: "Photo by Karolina Kołodziejczak",
    },
    {
      name: "Homemade Tacos",
      image: "/tacos.jpg",
      description: "A taste of home.",
      alt: "Photo by Evan Wise",
    },
  ];

  return (
    <section className="py-16 bg-[var(--color-primary)] text-center">
      <h2 className="text-5xl text-[var(--color-accent)] font-bold mb-8">
        Featured Recipes
      </h2>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {recipes.map(({ name, image, description, alt }) => (
          <div
            key={name}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
          >
            <div className="relative w-40 h-40 mx-auto">
              <Image
                src={image}
                alt={alt}
                fill={true}
                className="rounded-full object-cover"
              />
            </div>

            <div className="p-6">
              <h3 className="text-3xl text-[var(--color-dark)] font-bold">{name}</h3>
              <p className="text-gray-600 mt-2">{description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
          <a
            href="/recipes"
            className="bg-[var(--color-dark)] hover:bg-[var(--color-accent)] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
          >
            See More
          </a>
        </div>
    </section>
  );
}
