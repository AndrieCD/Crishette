"use client";
// src/app/product-catalog/page.tsx
// Product Catalog page — matches the Figma screenshot with:
//   - Left sidebar: Search Filter, Price Range, Star Rating, Clear All + Apply
//   - Categories horizontal scroll row
//   - Sort by bar (Relevance, Latest, Top Sales)
//   - 4-column product grid with scallop-bordered cards
//   - Scallop bottom on main content
//   - About Crishette footer
// 'use client' needed for useState (filters, sort, search)

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Static placeholder data (swap with Supabase fetch later) ──────────────────
const CATEGORIES = [
  { id: 1, name: "category 1", image: "/images/product1.png" },
  { id: 2, name: "category 1", image: "/images/product1.png" },
  { id: 3, name: "category 1", image: "/images/product1.png" },
  { id: 4, name: "category 1", image: "/images/product1.png" },
  { id: 5, name: "category 1", image: "/images/product1.png" },
  { id: 6, name: "category 1", image: "/images/product1.png" },
];

const PRODUCTS = [
  { id: 1, name: "product 1", price: 4.44, image: "/images/product1.png" },
  { id: 2, name: "product 1", price: 4.44, image: "/images/product2.png" },
  { id: 3, name: "product 1", price: 4.44, image: "/images/product1.png" },
  { id: 4, name: "product 1", price: 4.44, image: "/images/product2.png" },
  { id: 5, name: "product 1", price: 4.44, image: "/images/product3.png" },
  { id: 6, name: "product 1", price: 4.44, image: "/images/product1.png" },
  { id: 7, name: "product 1", price: 4.44, image: "/images/product2.png" },
  { id: 8, name: "product 1", price: 4.44, image: "/images/product3.png" },
];

// ── Scallop bottom border (white version — for main content card) ─────────────
function ScallopBottomLight() {
  return (
    <div className="w-full overflow-hidden leading-none mt-auto">
      <svg
        viewBox="0 0 400 28"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 
             C10,0 10,24 20,24 C30,24 30,0 40,0 
             C50,0 50,24 60,24 C70,24 70,0 80,0 
             C90,0 90,24 100,24 C110,24 110,0 120,0 
             C130,0 130,24 140,24 C150,24 150,0 160,0 
             C170,0 170,24 180,24 C190,24 190,0 200,0 
             C210,0 210,24 220,24 C230,24 230,0 240,0 
             C250,0 250,24 260,24 C270,24 270,0 280,0 
             C290,0 290,24 300,24 C310,24 310,0 320,0 
             C330,0 330,24 340,24 C350,24 350,0 360,0 
             C370,0 370,24 380,24 C390,24 390,0 400,0 
             L400,28 L0,28 Z"
          fill="#FFF0F6"
        />
      </svg>
    </div>
  );
}

// ── Wavy yarn background ──────────────────────────────────────────────────────
function YarnBackground() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <svg
          key={i}
          className="absolute"
          style={{ top: `${i * 13}%`, left: "-10%", width: "120%" }}
          viewBox="0 0 500 40"
          preserveAspectRatio="none"
        >
          <path
            d={`M0,20 C30,${5 + i * 2} 60,${35 - i * 2} 100,20 C140,${5 + i} 170,${35 - i} 200,20 C240,${5 + i * 2} 270,${35 - i * 2} 300,20 C340,${5 + i} 370,${35 - i} 400,20 C430,${5 + i * 2} 460,${35 - i * 2} 500,20`}
            stroke="#A02845"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}

// ── Star Rating component ─────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-xl transition-colors ${
            star <= value ? "text-[#C0395A]" : "text-pink-200"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Filter Sidebar ────────────────────────────────────────────────────────────
function FilterSidebar({
  minPrice,
  maxPrice,
  rating,
  onMinPrice,
  onMaxPrice,
  onRating,
  onApply,
  onClear,
}: {
  minPrice: string;
  maxPrice: string;
  rating: number;
  onMinPrice: (v: string) => void;
  onMaxPrice: (v: string) => void;
  onRating: (v: number) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <aside className="w-44 shrink-0 bg-white rounded-2xl shadow-md p-4 flex flex-col gap-4 h-fit">
      {/* Heading */}
      <div className="flex items-center gap-2">
        {/* Filter funnel icon */}
        <svg className="w-4 h-4 text-[#C0395A]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6h16v2l-6 6v6l-4-2v-4L4 8V6z" />
        </svg>
        <span className="font-['Fredoka'] font-bold text-[#C0395A] text-sm">
          Search Filter
        </span>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-2">
        <p className="font-['Fredoka'] font-semibold text-[#4B2E39] text-xs">
          Price Range
        </p>
        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="$ MIN"
            value={minPrice}
            onChange={(e) => onMinPrice(e.target.value)}
            className="w-full rounded-lg border-2 border-pink-200 px-2 py-1 text-xs font-['Fredoka'] text-[#4B2E39] outline-none focus:ring-1 focus:ring-pink-300"
          />
          <span className="text-pink-300 text-xs">—</span>
          <input
            type="number"
            placeholder="$ MAX"
            value={maxPrice}
            onChange={(e) => onMaxPrice(e.target.value)}
            className="w-full rounded-lg border-2 border-pink-200 px-2 py-1 text-xs font-['Fredoka'] text-[#4B2E39] outline-none focus:ring-1 focus:ring-pink-300"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <p className="font-['Fredoka'] font-semibold text-[#4B2E39] text-xs">
          Rating
        </p>
        <StarRating value={rating} onChange={onRating} />
      </div>

      {/* Buttons */}
      <button
        type="button"
        onClick={onApply}
        className="w-full bg-[#C0395A] text-white font-['Fredoka'] font-bold rounded-full py-1.5 text-xs hover:bg-[#a02845] transition-colors"
      >
        Apply
      </button>
      <button
        type="button"
        onClick={onClear}
        className="w-full bg-white border-2 border-[#C0395A] text-[#C0395A] font-['Fredoka'] font-bold rounded-full py-1.5 text-xs hover:bg-pink-50 transition-colors"
      >
        Clear All
      </button>
    </aside>
  );
}

// ── Category pill ─────────────────────────────────────────────────────────────
function CategoryCard({
  name,
  image,
  active,
  onClick,
}: {
  name: string;
  image: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 shrink-0 group transition-transform hover:scale-105`}
    >
      {/* Scallop-edged image */}
      <div
        className={`relative w-20 h-20 rounded-2xl overflow-hidden border-4 transition-colors ${
          active ? "border-[#C0395A]" : "border-pink-200"
        }`}
        style={{
          clipPath:
            "polygon(50% 0%,56% 3%,63% 2%,68% 7%,75% 8%,79% 14%,86% 16%,89% 23%,95% 27%,97% 34%,100% 40%,100% 47%,98% 53%,100% 60%,98% 67%,95% 73%,89% 77%,87% 84%,81% 88%,75% 92%,68% 93%,62% 98%,56% 97%,50% 100%,44% 97%,38% 98%,32% 93%,25% 92%,19% 88%,13% 84%,11% 77%,5% 73%,2% 67%,0% 60%,2% 53%,0% 47%,0% 40%,3% 34%,5% 27%,11% 23%,14% 16%,21% 14%,25% 8%,32% 7%,37% 2%,44% 3%)",
        }}
      >
        <Image src={image} alt={name} fill className="object-cover" sizes="80px" />
      </div>
      <span
        className={`font-['Fredoka'] text-xs font-semibold ${
          active ? "text-[#C0395A]" : "text-[#4B2E39]"
        }`}
      >
        {name}
      </span>
    </button>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  name,
  price,
  image,
}: {
  name: string;
  price: number;
  image: string;
}) {
  return (
    <Link
      href="#"
      className="flex flex-col items-center gap-2 bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-pink-200 hover:scale-105 transition-all duration-200 border-2 border-pink-100"
    >
      {/* Product image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* Info */}
      <div className="text-center pb-3 px-2">
        <p className="font-['Fredoka'] font-semibold text-[#4B2E39] text-sm">
          {name}
        </p>
        <p className="font-['Fredoka'] font-bold text-[#C0395A] text-sm">
          $ {price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

// ── Main Catalog Page ─────────────────────────────────────────────────────────
export default function ProductCatalogPage() {
  // Filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);

  // Sort state
  const [sortBy, setSortBy] = useState<"Relevance" | "Latest" | "Top Sales">("Relevance");

  // Active category
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Search
  const [search, setSearch] = useState("");

  const handleApply = () => {
    // TODO: wire up Supabase filtered query here
    console.log("Filter applied:", { minPrice, maxPrice, rating });
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setRating(0);
  };

  return (
    <div className="min-h-screen font-['Fredoka']" style={{ backgroundColor: "#C0395A" }}>

      {/* ── HERO BANNER ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-4">
        <div className="absolute inset-0 flex items-center overflow-hidden opacity-30 pointer-events-none select-none">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="text-4xl font-bold text-[#A02845] tracking-widest mx-4 uppercase">
                YOUR WISH IS MY CROCHET &nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col items-center z-10 py-2">
          <Image src="/assets/CrishetteLogo.png" alt="Crishette Logo" width={90} height={90} className="drop-shadow-lg" />
          <span className="text-white font-bold tracking-wide mt-1 text-3xl font-['Fredoka']">
            Crishette
          </span>
        </div>
      </div>

      {/* ── NAVBAR CARD ───────────────────────────────────────────────── */}
      <div className="px-4 md:px-8">
        <div className="bg-[#FFF0F6] rounded-3xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 gap-3">
            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <Image src="/assets/CrishetteLogo.png" alt="Crishette" width={36} height={36} />
              <span className="font-bold text-[#C0395A] text-lg font-['Fredoka']">crishette</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg relative">
              <input
                type="text"
                placeholder="Hinted search text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-pink-200 bg-white px-4 py-2 text-sm text-gray-500 shadow-inner outline-none focus:ring-2 focus:ring-pink-300 font-['Fredoka']"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C0395A]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>

            {/* Nav icons */}
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/product-catalog" className="flex flex-col items-center text-[#C0395A] hover:text-pink-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-['Fredoka']">shop</span>
              </Link>
              <Link href="/shopping-cart" className="flex flex-col items-center text-[#C0395A] hover:text-pink-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5h12.8M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
                <span className="text-xs font-['Fredoka']">cart</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center text-[#C0395A] hover:text-pink-400 transition-colors">
                <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-[#C0395A]">
                  <Image src="/images/profile-placeholder.jpg" alt="Profile" width={28} height={28} className="object-cover" />
                </div>
                <span className="text-xs font-['Fredoka']">profile</span>
              </Link>
            </div>
          </div>

          {/* Scallop bottom of navbar */}
          <div className="w-full overflow-hidden leading-none -mb-1">
            <svg viewBox="0 0 400 24" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
              <path d="M0,0 C10,0 10,20 20,20 C30,20 30,0 40,0 C50,0 50,20 60,20 C70,20 70,0 80,0 C90,0 90,20 100,20 C110,20 110,0 120,0 C130,0 130,20 140,20 C150,20 150,0 160,0 C170,0 170,20 180,20 C190,20 190,0 200,0 C210,0 210,20 220,20 C230,20 230,0 240,0 C250,0 250,20 260,20 C270,20 270,0 280,0 C290,0 290,20 300,20 C310,20 310,0 320,0 C330,0 330,20 340,20 C350,20 350,0 360,0 C370,0 370,20 380,20 C390,20 390,0 400,0 L400,24 L0,24 Z" fill="#FFF0F6" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <div className="px-4 md:px-8 mt-4 pb-0">
        <div className="bg-[#FFF0F6] rounded-3xl shadow-lg flex flex-col overflow-hidden">
          <div className="flex gap-5 p-5">

            {/* Left: Filter Sidebar */}
            <FilterSidebar
              minPrice={minPrice}
              maxPrice={maxPrice}
              rating={rating}
              onMinPrice={setMinPrice}
              onMaxPrice={setMaxPrice}
              onRating={setRating}
              onApply={handleApply}
              onClear={handleClear}
            />

            {/* Right: Main catalog area */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">

              {/* CATEGORIES heading */}
              <h2 className="font-['Fredoka'] font-bold text-[#C0395A] text-xl tracking-wide uppercase">
                Categories
              </h2>

              {/* Categories horizontal scroll */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    name={cat.name}
                    image={cat.image}
                    active={activeCategory === cat.id}
                    onClick={() =>
                      setActiveCategory(activeCategory === cat.id ? null : cat.id)
                    }
                  />
                ))}
              </div>

              {/* Sort by bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">
                  Sort by
                </span>
                {(["Relevance", "Latest", "Top Sales"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSortBy(option)}
                    className={`rounded-full px-4 py-1 text-sm font-['Fredoka'] font-semibold border-2 transition-colors ${
                      sortBy === option
                        ? "bg-[#C0395A] text-white border-[#C0395A]"
                        : "bg-white text-[#4B2E39] border-pink-200 hover:border-[#C0395A] hover:text-[#C0395A]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Product grid — 4 columns */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {PRODUCTS.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          </div>

          {/* Scallop bottom of main content card */}
          <ScallopBottomLight />
        </div>
      </div>

      {/* ── ABOUT CRISHETTE FOOTER ────────────────────────────────────── */}
      <section className="bg-[#FFF0F6] mx-0 mt-0 px-8 py-8 rounded-t-none">
        <h3 className="font-bold text-[#C0395A] text-xl mb-2 font-['Fredoka']">
          About Crishette
        </h3>
        <p className="text-[#4B2E39] text-sm leading-relaxed max-w-3xl font-['Fredoka']">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>

    </div>
  );
}
