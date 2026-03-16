// src/app/Land.tsx
<<<<<<< Updated upstream
// StoreFront / Landing Page — matches Section 7 Figma prototype
=======
>>>>>>> Stashed changes

import Image from "next/image";
import Link from "next/link";

// ── Static placeholder data (swap with Supabase fetch later) ──────────────────
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Lorem ipsum",
    tagline: "hello goodbye hello",
    image: "/images/product1.jpg",
    alt: "Crochet pig amigurumi",
  },
  {
    id: 2,
    name: "Lorem ipsum",
    tagline: "hello goodbye hello",
    image: "/images/product2.png",
    alt: "Crochet tulip bouquet",
  },
  {
    id: 3,
    name: "Lorem ipsum",
    tagline: "hello goodbye hello",
    image: "/images/product3.png",
    alt: "Crochet bunny with heart",
  },
];

// ── Scallop SVG border (bottom of navbar card) ────────────────────────────────
function ScallopBottom() {
  return (
    <div className="w-full overflow-hidden leading-none -mb-1">
      <svg
        viewBox="0 0 400 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 
             C10,0 10,20 20,20 C30,20 30,0 40,0 
             C50,0 50,20 60,20 C70,20 70,0 80,0 
             C90,0 90,20 100,20 C110,20 110,0 120,0 
             C130,0 130,20 140,20 C150,20 150,0 160,0 
             C170,0 170,20 180,20 C190,20 190,0 200,0 
             C210,0 210,20 220,20 C230,20 230,0 240,0 
             C250,0 250,20 260,20 C270,20 270,0 280,0 
             C290,0 290,20 300,20 C310,20 310,0 320,0 
             C330,0 330,20 340,20 C350,20 350,0 360,0 
             C370,0 370,20 380,20 C390,20 390,0 400,0 
             L400,24 L0,24 Z"
          fill="#C0395A"
        />
      </svg>
    </div>
  );
}

// ── Scallop border variant for white card ─────────────────────────────────────
function ScallopBottomLight() {
  return (
    <div className="w-full overflow-hidden leading-none -mb-1">
      <svg
        viewBox="0 0 400 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 
             C10,0 10,20 20,20 C30,20 30,0 40,0 
             C50,0 50,20 60,20 C70,20 70,0 80,0 
             C90,0 90,20 100,20 C110,20 110,0 120,0 
             C130,0 130,20 140,20 C150,20 150,0 160,0 
             C170,0 170,20 180,20 C190,20 190,0 200,0 
             C210,0 210,20 220,20 C230,20 230,0 240,0 
             C250,0 250,20 260,20 C270,20 270,0 280,0 
             C290,0 290,20 300,20 C310,20 310,0 320,0 
             C330,0 330,20 340,20 C350,20 350,0 360,0 
             C370,0 370,20 380,20 C390,20 390,0 400,0 
             L400,24 L0,24 Z"
          fill="#FFF0F6"
        />
      </svg>
    </div>
  );
}

// ── Product card with scallop image border ────────────────────────────────────
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
      {/* Scalloped image container */}
      <div
        className="relative h-52 w-52 md:h-60 md:w-60"
        style={{
          clipPath:
            "polygon(50% 0%, 56% 3%, 63% 2%, 68% 7%, 75% 8%, 79% 14%, 86% 16%, 89% 23%, 95% 27%, 97% 34%, 100% 40%, 100% 47%, 98% 53%, 100% 60%, 98% 67%, 95% 73%, 89% 77%, 87% 84%, 81% 88%, 75% 92%, 68% 93%, 62% 98%, 56% 97%, 50% 100%, 44% 97%, 38% 98%, 32% 93%, 25% 92%, 19% 88%, 13% 84%, 11% 77%, 5% 73%, 2% 67%, 0% 60%, 2% 53%, 0% 47%, 0% 40%, 3% 34%, 5% 27%, 11% 23%, 14% 16%, 21% 14%, 25% 8%, 32% 7%, 37% 2%, 44% 3%)",
        }}
      >
        {/* Scallop border ring */}
        <div className="absolute inset-0 rounded-full bg-[#C0395A] scale-105" />
        <div className="absolute inset-0 rounded-full bg-pink-100 scale-[1.02]" />

        {/* Product image */}
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

      {/* Product info */}
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
      {/* ── Hero Banner with scrolling text ──────────────────────────────── */}
      <div className="relative overflow-hidden py-4">
        {/* Scrolling marquee text behind logo */}
        <div className="pointer-events-none absolute inset-0 flex select-none items-center overflow-hidden opacity-30">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
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

        {/* Logo centered over marquee */}
        <div className="relative z-10 flex flex-col items-center py-2">
          <Image
            src="/assets/CrishetteLogo.png"
            alt="Crishette Logo"
            width={90}
            height={90}
            className="drop-shadow-lg"
          />
          <span className="mt-1 text-3xl font-bold tracking-wide text-white md:text-4xl">
            Crishette
          </span>
        </div>
      </div>

      {/* ── Navbar card ──────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#FFF0F6] shadow-lg">
          {/* Nav bar inner row */}
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            {/* Brand mark */}
            <div className="flex shrink-0 items-center gap-2">
              <Image
                src="/assets/CrishetteLogo.png"
                alt="Crishette"
                width={36}
                height={36}
              />
              <span className="font-['Fredoka'] text-lg font-bold text-[#C0395A]">
                crishette
              </span>
            </div>

            {/* Search bar */}
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Hinted search text"
                className="w-full rounded-full border border-pink-200 bg-white px-4 py-2 text-sm text-gray-500 shadow-inner outline-none focus:ring-2 focus:ring-pink-300 font-['Fredoka']"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C0395A]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Nav icons */}
            <div className="flex shrink-0 items-center gap-4">
              <Link
                href="/product-catalog"
                className="flex flex-col items-center text-[#C0395A] transition-colors hover:text-pink-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="font-['Fredoka'] text-xs">shop</span>
              </Link>

              <Link
                href="/shopping-cart"
                className="flex flex-col items-center text-[#C0395A] transition-colors hover:text-pink-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5h12.8M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  />
                </svg>
                <span className="font-['Fredoka'] text-xs">cart</span>
              </Link>

              <Link
                href="/login"
                className="flex flex-col items-center text-[#C0395A] transition-colors hover:text-pink-400"
              >
                <div className="h-7 w-7 overflow-hidden rounded-full border-2 border-[#C0395A]">
                  <Image
                    src="/images/profile-placeholder.jpg"
                    alt="Profile"
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
                <span className="font-['Fredoka'] text-xs">profile</span>
              </Link>
            </div>
          </div>

          {/* Scallop bottom edge of navbar card */}
          <ScallopBottomLight />
        </div>
      </div>

      {/* ── Featured Products section ─────────────────────────────────────── */}
      <section className="px-4 py-10 md:px-8">
        {/* Section heading */}
        <div className="mb-10 flex justify-center">
          <h2 className="rounded-xl bg-[#FDE68A] px-8 py-2 text-2xl font-extrabold uppercase tracking-widest text-[#C0395A] shadow-md md:text-3xl">
            FEATURED PRODUCTS
          </h2>
        </div>

      {/* Cards row */}
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-6 md:gap-10 place-items-center">
        {FEATURED_PRODUCTS.map((product) => (
          <FeaturedCard key={product.id} {...product} />
        ))}
      </div>
      </section>

      {/* ── About Crishette footer band ───────────────────────────────────── */}
      <section className="mt-6 rounded-t-3xl bg-[#FFF0F6] px-8 py-8">
        <h3 className="mb-2 font-['Fredoka'] text-xl font-bold text-[#C0395A]">
          About Crishette
        </h3>
        <p className="max-w-3xl font-['Fredoka'] text-sm leading-relaxed text-[#4B2E39]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>
    </main>
  );
}