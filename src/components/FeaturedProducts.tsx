// src/components/FeaturedProducts.tsx


import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";

// ── Single product card ────────────────────────────────────────────────────────
function FeaturedCard({
  id,
  name,
  tagline,
  image,
}: {
  id: string;
  name: string;
  tagline: string;
  image: string;
}) {
  return (
    <Link
      href={`/product/${id}`}
      className="group flex w-full max-w-[260px] flex-col items-center gap-3 justify-self-center"
    >
      {/* Scalloped circle image */}
      <div
        className="relative h-52 w-52 md:h-60 md:w-60"
        style={{
          clipPath:
            "polygon(50% 0%, 56% 3%, 63% 2%, 68% 7%, 75% 8%, 79% 14%, 86% 16%, 89% 23%, 95% 27%, 97% 34%, 100% 40%, 100% 47%, 98% 53%, 100% 60%, 98% 67%, 95% 73%, 89% 77%, 87% 84%, 81% 88%, 75% 92%, 68% 93%, 62% 98%, 56% 97%, 50% 100%, 44% 97%, 38% 98%, 32% 93%, 25% 92%, 19% 88%, 13% 84%, 11% 77%, 5% 73%, 2% 67%, 0% 60%, 2% 53%, 0% 47%, 0% 40%, 3% 34%, 5% 27%, 11% 23%, 14% 16%, 21% 14%, 25% 8%, 32% 7%, 37% 2%, 44% 3%)",
        }}
      >
        <div className="absolute inset-0 scale-105 rounded-full bg-[#C0395A]" />
        <div className="absolute inset-0 scale-[1.02] rounded-full bg-pink-100" />
        <div className="relative h-full w-full overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
          <Image
            src={`/images/${image}.png`}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 208px, 240px"
          />
        </div>
      </div>

      {/* Name + tagline */}
      <div className="text-center">
        <h3 className="font-['Fredoka'] text-xl font-semibold text-white drop-shadow-sm">
          {name}
        </h3>
        <p className="font-['Fredoka'] text-sm text-pink-200">{tagline}</p>
      </div>
    </Link>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products || products.length === 0) {
    return (
      <section className="px-4 py-10 md:px-8">
        <div className="mb-10 flex justify-center">
          <h2 className="rounded-xl bg-[#FDE68A] px-8 py-2 text-2xl font-extrabold uppercase tracking-widest text-[#C0395A] shadow-md md:text-3xl">
            FEATURED PRODUCTS
          </h2>
        </div>
        <p className="text-center text-white font-['Fredoka']">
          No featured products yet. Check back soon! 🧶
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 md:px-8">
      {/* Section heading */}
      <div className="mb-10 flex justify-center">
        <h2 className="rounded-xl bg-[#FDE68A] px-8 py-2 text-2xl font-extrabold uppercase tracking-widest text-[#C0395A] shadow-md md:text-3xl">
          FEATURED PRODUCTS
        </h2>
      </div>

      {/* Product cards */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
        {products.map((product) => (
          <FeaturedCard
            key={product.id}
            id={product.id}
            name={product.name}
            tagline={product.description ?? "Handmade with love 🌸"}
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
}
