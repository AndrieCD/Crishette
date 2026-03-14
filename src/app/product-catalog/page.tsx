"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import Navbar from "@/app/Navbar"


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
    <aside className="h-fit w-44 shrink-0 rounded-2xl bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <svg
          className="h-4 w-4 text-[#C0395A]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4 6h16v2l-6 6v6l-4-2v-4L4 8V6z" />
        </svg>
        <span className="text-sm font-bold text-[#C0395A]">Search Filter</span>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold text-[#4B2E39]">Price Range</p>
        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="$ MIN"
            value={minPrice}
            onChange={(e) => onMinPrice(e.target.value)}
            className="w-full rounded-lg border-2 border-pink-200 px-2 py-1 text-xs text-[#4B2E39] outline-none"
          />
          <span className="text-xs text-pink-300">—</span>
          <input
            type="number"
            placeholder="$ MAX"
            value={maxPrice}
            onChange={(e) => onMaxPrice(e.target.value)}
            className="w-full rounded-lg border-2 border-pink-200 px-2 py-1 text-xs text-[#4B2E39] outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold text-[#4B2E39]">Rating</p>
        <StarRating value={rating} onChange={onRating} />
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mb-3 w-full rounded-full bg-[#C0395A] py-1.5 text-xs font-bold text-white"
      >
        Apply
      </button>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-full border-2 border-[#C0395A] bg-white py-1.5 text-xs font-bold text-[#C0395A]"
      >
        Clear All
      </button>
    </aside>
  );
}

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
      className="shrink-0 transition-transform hover:scale-105"
    >
      <div
        className={`relative h-20 w-20 overflow-hidden rounded-2xl border-4 ${
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
        className={`mt-1 block text-xs font-semibold ${
          active ? "text-[#C0395A]" : "text-[#4B2E39]"
        }`}
      >
        {name}
      </span>
    </button>
  );
}

function ProductCard({
  id,
  name,
  price,
  image,
}: {
  id: string;
  name: string;
  price: number;
  image: string;
}) {
  return (
    <Link
      href={`/product/${id}`}
      className="group overflow-hidden rounded-2xl border-2 border-pink-100 bg-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-pink-200"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <div className="px-2 pb-3 pt-2 text-center">
        <p className="text-sm font-semibold text-[#4B2E39]">{name}</p>
        <p className="text-sm font-bold text-[#C0395A]">$ {price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

export default function ProductCatalogPage() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState<"Relevance" | "Latest" | "Top Sales">(
    "Relevance"
  );
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minPrice) {
      result = result.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    if (sortBy === "Latest") {
      result = [...result].reverse();
    }

    if (sortBy === "Top Sales") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, minPrice, maxPrice, sortBy]);

  const handleApply = () => {
    console.log("Filter applied:", { minPrice, maxPrice, rating });
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setRating(0);
  };

  return (
    <div className="min-h-screen bg-[#C0395A] font-['Fredoka']">
      <div className="px-4 pb-0 pt-4 md:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#FFF0F6] shadow-lg">
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="flex shrink-0 items-center gap-2">
              <Image
                src="/assets/CrishetteLogo.png"
                alt="Crishette"
                width={36}
                height={36}
              />
              <span className="text-lg font-bold text-[#C0395A]">crishette</span>
            </div>

            <div className="relative max-w-lg flex-1">
              <input
                type="text"
                placeholder="Hinted search text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-pink-200 bg-white px-4 py-2 text-sm text-gray-500 outline-none"
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

            <div className="flex shrink-0 items-center gap-4">
              <Link
                href="/product-catalog"
                className="flex flex-col items-center text-[#C0395A]"
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
                <span className="text-xs">shop</span>
              </Link>

              <Link
                href="/shopping-cart"
                className="flex flex-col items-center text-[#C0395A]"
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
                <span className="text-xs">cart</span>
              </Link>

              <Link
                href="/profile"
                className="flex flex-col items-center text-[#C0395A]"
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
                <span className="text-xs">profile</span>
              </Link>
            </div>
          </div>

          <div className="-mb-1 w-full overflow-hidden leading-none">
            <svg
              viewBox="0 0 400 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C10,0 10,20 20,20 C30,20 30,0 40,0 C50,0 50,20 60,20 C70,20 70,0 80,0 C90,0 90,20 100,20 C110,20 110,0 120,0 C130,0 130,20 140,20 C150,20 150,0 160,0 C170,0 170,20 180,20 C190,20 190,0 200,0 C210,0 210,20 220,20 C230,20 230,0 240,0 C250,0 250,20 260,20 C270,20 270,0 280,0 C290,0 290,20 300,20 C310,20 310,0 320,0 C330,0 330,20 340,20 C350,20 350,0 360,0 C370,0 370,20 380,20 C390,20 390,0 400,0 L400,24 L0,24 Z"
                fill="#FFF0F6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 px-4 pb-0 md:px-8">
        <div className="flex flex-col overflow-hidden rounded-3xl bg-[#FFF0F6] shadow-lg">
          <div className="flex gap-5 p-5">
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

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <h2 className="text-xl font-bold uppercase tracking-wide text-[#C0395A]">
                Categories
              </h2>

              <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
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

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[#4B2E39]">
                  Sort by
                </span>
                {(["Relevance", "Latest", "Top Sales"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSortBy(option)}
                    className={`rounded-full border-2 px-4 py-1 text-sm font-semibold transition-colors ${
                      sortBy === option
                        ? "border-[#C0395A] bg-[#C0395A] text-white"
                        : "border-pink-200 bg-white text-[#4B2E39]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                  />
                ))}
              </div>
            </div>
          </div>

          <ScallopBottomLight />
        </div>
      </div>

      <section className="mx-0 mt-0 rounded-t-none bg-[#FFF0F6] px-8 py-8">
        <h3 className="mb-2 text-xl font-bold text-[#C0395A]">
          About Crishette
        </h3>
        <p className="max-w-3xl text-sm leading-relaxed text-[#4B2E39]">
          Handmade crochet creations made with love.
          Email: crishette@email.com
          Instagram: @crishette
          Based in Caloocan, Philippines

          © 2026 Crishette. All rights reserved.
        </p>
      </section>
    </div>
  );
}