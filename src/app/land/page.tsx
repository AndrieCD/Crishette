// src/app/Land.tsx
// StoreFront / Landing Page — matches Section 7 Figma prototype

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/Navbar"

// ── Static placeholder data (swap with Supabase fetch later) ──────────────────
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Pig Amigurumi",
    tagline: "Perfect for attaching to bags, keys, or pouches.",
    image: "/images/product1.png",
    alt: "Crochet pig amigurumi",
  },
  {
    id: 2,
    name: "Tulip Bouquet",
    tagline: "A beautiful and lasting flower gift perfect for any occasion.",
    image: "/images/product2.png",
    alt: "Crochet tulip bouquet",
  },
  {
    id: 3,
    name: "Bunny with Heart",
    tagline: "Soft, charming, and perfect as a small gift",
    image: "/images/product3.png",
    alt: "Crochet bunny with heart",
  },
];

// ── Product card ──────────────────────────────────────────────────────────────
function FeaturedCard({
  name,
  tagline,
  image,
  alt,
}: {
  name: string;
  tagline: string;
  image: string;
  alt: string;
}) {
  return (
    <Link
      href="/product-catalog"
      className="group flex w-full max-w-[260px] flex-col items-center gap-3 justify-self-center"
    >
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
            src={image}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 208px, 240px"
          />
        </div>
      </div>
      <div className="text-center">
        <h3 className="font-['Fredoka'] text-xl font-semibold text-white drop-shadow-sm">
          {name}
        </h3>
        <p className="font-['Fredoka'] text-sm text-pink-200">{tagline}</p>
      </div>
    </Link>
  );
}



// ── Main StoreFront Page ──────────────────────────────────────────────────────
export default function Land() {
  return (
    <main className="min-h-screen bg-[#C0395A] font-['Fredoka']">
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute inset-0 flex select-none items-center overflow-hidden opacity-30">
          <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="mx-4 text-4xl font-bold uppercase tracking-widest text-[#A02845]"
              >
                YOUR WISH IS MY CROCHET &nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center py-2">
          <Image
            src="/assets/CrishetteLogo.png"
            alt="Crishette Logo"
            width={150}
            height={150}
            className="drop-shadow-lg"
          />
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar/>
      

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="px-4 py-10 md:px-8">
        <div className="mb-10 flex justify-center">
          <h2 className="rounded-xl bg-[#FDE68A] px-8 py-2 text-2xl font-extrabold uppercase tracking-widest text-[#C0395A] shadow-md md:text-3xl">
            FEATURED PRODUCTS
          </h2>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-3 place-items-center gap-6 md:gap-10">
          {FEATURED_PRODUCTS.map((product) => (
            <FeaturedCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* ── About Crishette ───────────────────────────────────────────────── */}
      <section className="mt-6 rounded-t-3xl bg-[#FFF0F6] px-8 py-8">
        <h3 className="mb-2 font-['Fredoka'] text-xl font-bold text-[#C0395A]">
          About Crishette
        </h3>
        <p className="max-w-3xl font-['Fredoka'] text-sm leading-relaxed text-[#4B2E39]">
        Your Wish is My Crochet — Handmade crochet creations made with love. <br />
        <br />
        Email: crishette@email.com <br />
        Instagram: @crishette<br /> <br />
        Based in Caloocan, Philippines
        <br />
        © 2026 Crishette. All rights reserved.
        </p>
      </section>
    </main>
  );
}
