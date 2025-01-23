import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900 text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Woman holding fork and enjoying meal - Photo by Pablo Merchán"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          fill={true}
          quality={90}
          className="opacity-60"
          priority
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-5xl font-extrabold sm:text-6xl">
          Preserve Your Family&apos;s{" "}
          <span className="text-red-500">Culinary Legacy</span>
        </h1>
        <p className="mt-6 text-lg max-w-3xl">
          Secure, organize, and share your cherished family recipes with ease.
          Keep traditions alive for generations to come.
        </p>
        <div className="mt-8">
          <a
            href="/signup"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}
