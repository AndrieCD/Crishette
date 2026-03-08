// src/app/admin/products/page.tsx
"use client";

// Admin Products List Page
// Converted from plain HTML/CSS to Next.js + TypeScript + Tailwind CSS

import { useState } from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  published: boolean;
};

const initialProducts: Product[] = [
  { id: 1, name: "Strawberry Shortcake", published: true },
  { id: 2, name: "Caramel Almond Bar", published: false },
  { id: 3, name: "Matcha Cookie Sandwich", published: false },
  { id: 4, name: "Vanilla Bean Cupcake", published: false },
  { id: 5, name: "Ube Cheesecake Slice", published: false },
];

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-pink-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <div
      className="relative h-6 w-6 rounded-md border-2 border-pink-500 bg-white"
      aria-label="Schedule"
      role="img"
    >
      <div className="absolute -top-1 left-1 h-2 w-2 rounded-t-sm border-2 border-b-0 border-pink-500 bg-white" />
      <div className="absolute -top-1 right-1 h-2 w-2 rounded-t-sm border-2 border-b-0 border-pink-500 bg-white" />

      <div className="absolute inset-[4px] grid grid-cols-3 gap-[2px]">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className="block rounded-[1px] bg-pink-500 opacity-90"
          />
        ))}
      </div>
    </div>
  );
}

function PublishToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className="peer sr-only"
      />
      <div className="h-6 w-12 rounded-full border border-gray-300 bg-gray-200 transition-colors peer-checked:border-pink-500 peer-checked:bg-pink-500" />
      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-6" />
    </label>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const togglePublished = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, published: !product.published }
          : product,
      ),
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4CDD5] text-[#7A3A45]">
      {/* Soft decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[14%] h-24 w-48 rounded-full bg-[#F0BAC6]/70 blur-sm" />
        <div className="absolute right-[10%] top-[10%] h-28 w-56 rounded-full bg-[#F0BAC6]/70 blur-sm" />
        <div className="absolute bottom-[16%] left-[14%] h-32 w-60 rounded-full bg-[#F0BAC6]/70 blur-sm" />
        <div className="absolute bottom-[18%] right-[12%] h-24 w-52 rounded-full bg-[#F0BAC6]/70 blur-sm" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* Top-right logout */}
        <div className="mb-2 flex justify-end px-1">
          <button className="text-sm font-extrabold uppercase tracking-wide text-pink-600 transition hover:text-pink-700">
            Logout
          </button>
        </div>

        {/* Header card */}
        <section className="grid items-center gap-4 rounded-2xl border-2 border-pink-300 border-b-4 bg-white px-4 py-4 shadow-[0_6px_18px_rgba(172,55,83,0.15)] md:grid-cols-[auto_auto_1fr] md:px-5">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/CrishetteLogo.png"
              alt="Crishette Logo"
              width={64}
              height={64}
              className="h-14 w-14 object-contain"
            />
            <div>
              <h1 className="font-['Fredoka'] text-lg font-bold text-pink-600 md:text-xl">
                Crishette Admin
              </h1>
              <p className="text-sm text-[#9B6670]">Manage your shop items</p>
            </div>
          </div>

          <div className="hidden h-6 w-[2px] bg-pink-100 md:block" />

          <div className="font-['Fredoka'] text-base font-bold capitalize text-[#B43A4F] md:text-lg">
            product / list
          </div>
        </section>

        {/* Toolbar */}
        <nav className="mt-3 flex flex-col gap-3 px-2 pt-2 md:flex-row md:items-center">
          <div className="flex items-center gap-3 font-['Fredoka'] text-lg font-extrabold text-[#B43A4F]">
            <span>PRODUCTS ({products.length})</span>

            <div className="flex items-center gap-2">
              <span className="h-1 w-4 rounded-full bg-pink-300" />
              <span className="h-1 w-4 rounded-full bg-pink-300" />
              <span className="h-1 w-4 rounded-full bg-pink-300" />
            </div>
          </div>

          <div className="flex items-center gap-4 md:ml-auto">
            <button
              type="button"
              aria-label="Search"
              className="rounded-full p-2 transition hover:bg-pink-100"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              className="rounded-full border border-pink-300 bg-white px-4 py-2 font-['Fredoka'] text-sm font-bold text-pink-600 shadow-sm transition hover:bg-pink-50"
            >
              + NEW PRODUCTS
            </button>
          </div>
        </nav>

        {/* Table card */}
        <section className="mt-3 overflow-hidden rounded-xl border border-pink-100 bg-white shadow-[0_6px_18px_rgba(172,55,83,0.15)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="w-[68%] border-b border-pink-100 bg-[#F7E7EB] px-4 py-3 text-left font-['Fredoka'] text-sm font-extrabold text-[#8B4A58]">
                    PRODUCT NAME
                  </th>
                  <th className="w-[32%] border-b border-pink-100 bg-[#F7E7EB] px-4 py-3 text-left font-['Fredoka'] text-sm font-extrabold text-[#8B4A58]">
                    PUBLISHED
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td
                      className={`border-b border-pink-100 px-4 py-3 text-[#9B6670] ${
                        index % 2 === 1 ? "bg-[#FFF7F9]" : "bg-white"
                      }`}
                    >
                      {product.name}
                    </td>

                    <td
                      className={`border-b border-pink-100 px-4 py-3 ${
                        index % 2 === 1 ? "bg-[#FFF7F9]" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <PublishToggle
                          checked={product.published}
                          onChange={() => togglePublished(product.id)}
                          label={`Published: ${product.name}`}
                        />
                        <CalendarIcon />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
