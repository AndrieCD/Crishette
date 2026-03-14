"use client";
// src/app/admin/page.tsx
// Admin Dashboard — Product List
// Only accessible when logged in as admin (username: "admin", password: "admin")
// Shows:
//   - Header with logo + "product / list" breadcrumb + LOGOUT button
//   - PRODUCTS (count) + search + NEW PRODUCTS button
//   - Table with product name, published toggle, and calendar/delete actions
// 'use client' needed for useState (auth check, toggle states, modal)

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ── Wavy yarn background ──────────────────────────────────────────────────────
function YarnBackground() {
  return (
    <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <svg
          key={i}
          className="absolute"
          style={{ top: `${i * 10}%`, left: "-10%", width: "120%" }}
          viewBox="0 0 500 40"
          preserveAspectRatio="none"
        >
          <path
            d={`M0,20 C30,${5 + i * 2} 60,${35 - i * 2} 100,20 C140,${5 + i} 170,${35 - i} 200,20 C240,${5 + i * 2} 270,${35 - i * 2} 300,20 C340,${5 + i} 370,${35 - i} 400,20 C430,${5 + i * 2} 460,${35 - i * 2} 500,20`}
            stroke="#C0395A"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Product = {
  id: number;
  name: string;
  published: boolean;
};

// ── Placeholder products (swap with Supabase fetch later) ─────────────────────
const INITIAL_PRODUCTS: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  published: i === 0, // only first one published by default
}));

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
        checked ? "bg-[#C0395A]" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
}

// ── Calendar Icon ─────────────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ── Trash Icon ────────────────────────────────────────────────────────────────
function TrashIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

// ── Add/Edit Product Modal ────────────────────────────────────────────────────
function ProductModal({
  onClose,
  onSave,
  initial,
}: {
  onClose: () => void;
  onSave: (name: string, published: boolean) => void;
  initial?: { name: string; published: boolean };
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#FFF0F6] rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-4">
        <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">
          {initial ? "Edit Product" : "New Product"} 🧶
        </h2>

        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label className="font-['Fredoka'] text-sm font-semibold text-[#4B2E39]">
            Product Name
          </label>
          <input
            type="text"
            placeholder="e.g. Crochet Bunny"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-full border-2 border-pink-200 px-4 py-2 text-sm font-['Fredoka'] text-[#4B2E39] outline-none focus:ring-2 focus:ring-pink-300 bg-white"
          />
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <span className="font-['Fredoka'] text-sm font-semibold text-[#4B2E39]">
            Published
          </span>
          <Toggle checked={published} onChange={() => setPublished(!published)} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-pink-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (name.trim()) onSave(name.trim(), published);
            }}
            className="flex-1 bg-[#C0395A] text-white font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-[#a02845] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({
  productName,
  onCancel,
  onConfirm,
}: {
  productName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#FFF0F6] rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-4 text-center">
        <p className="text-4xl">🗑️</p>
        <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">
          Delete Product?
        </h2>
        <p className="font-['Fredoka'] text-sm text-[#4B2E39]">
          Are you sure you want to delete{" "}
          <span className="font-bold">{productName}</span>? This cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-pink-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#C0395A] text-white font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-[#a02845] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN GATE — shown if not authenticated as admin ──────────────────────────
function AdminLoginGate({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded admin check
    // TODO: replace with Supabase role-based auth check
    if (username === "admin" && password === "admin") {
      onLogin();
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#C0395A" }}
    >
      <YarnBackground />

      <div className="relative z-10 bg-[#FFF0F6] rounded-3xl shadow-2xl p-10 w-full max-w-sm flex flex-col gap-5">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/assets/CrishetteLogo.png"
            alt="Crishette"
            width={64}
            height={64}
            className="drop-shadow-md"
          />
          <h1 className="font-['Fredoka'] font-bold text-2xl text-[#C0395A]">
            Admin Login
          </h1>
          <p className="font-['Fredoka'] text-xs text-[#4B2E39] text-center">
            This area is for Crishette admins only 🔒
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
          />
          {error && (
            <p className="text-red-500 text-xs font-['Fredoka'] ml-2">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#C0395A] text-white font-['Fredoka'] font-bold rounded-full py-2.5 text-base hover:bg-[#a02845] transition-colors shadow-md"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

// ── MAIN ADMIN PAGE ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();

  // Auth state — in a real app this would use Supabase session
  const [isAdmin, setIsAdmin] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // ── If not logged in, show the login gate ──────────────────────────────────
  if (!isAdmin) {
    return <AdminLoginGate onLogin={() => setIsAdmin(true)} />;
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleTogglePublished = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  const handleAddProduct = (name: string, published: boolean) => {
    const newProduct: Product = {
      id: Date.now(),
      name,
      published,
    };
    setProducts((prev) => [...prev, newProduct]);
    setShowAddModal(false);
    // TODO: insert into Supabase products table
  };

  const handleEditProduct = (name: string, published: boolean) => {
    if (!editProduct) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProduct.id ? { ...p, name, published } : p
      )
    );
    setEditProduct(null);
    // TODO: update Supabase products table
  };

  const handleDeleteProduct = () => {
    if (!deleteProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    setDeleteProduct(null);
    // TODO: delete from Supabase products table
  };

  // Filter products by search
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#FDE8EF" }}>
      <YarnBackground />

      {/* Modals */}
      {showAddModal && (
        <ProductModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
        />
      )}
      {editProduct && (
        <ProductModal
          onClose={() => setEditProduct(null)}
          onSave={handleEditProduct}
          initial={{ name: editProduct.name, published: editProduct.published }}
        />
      )}
      {deleteProduct && (
        <DeleteModal
          productName={deleteProduct.name}
          onCancel={() => setDeleteProduct(null)}
          onConfirm={handleDeleteProduct}
        />
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── HEADER CARD ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-between border-b-4 border-[#C0395A]">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/CrishetteLogo.png"
              alt="Crishette"
              width={48}
              height={48}
              className="drop-shadow"
            />
            <div className="w-px h-8 bg-[#C0395A]" />
            <span className="font-['Fredoka'] font-semibold text-[#C0395A] text-lg">
              product / list
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              setIsAdmin(false);
              router.push("/login");
            }}
            className="font-['Fredoka'] font-bold text-[#C0395A] text-sm hover:underline tracking-wide uppercase"
          >
            Logout
          </button>
        </div>

        {/* ── PRODUCTS TABLE CARD ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          {/* Table toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
            <div className="flex items-center gap-3">
              <span className="font-['Fredoka'] font-bold text-[#C0395A] text-lg">
                PRODUCTS ({filtered.length})
              </span>
              <span className="text-[#C0395A] text-lg">···</span>
              {/* Search icon + input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-full border-2 border-pink-200 pl-8 pr-3 py-1 text-xs font-['Fredoka'] text-[#4B2E39] outline-none focus:ring-2 focus:ring-pink-300 bg-[#FFF0F6] w-36"
                />
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C0395A]"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            {/* New product button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#C0395A] text-white font-['Fredoka'] font-semibold text-sm rounded-full px-4 py-1.5 hover:bg-[#a02845] transition-colors shadow-sm"
            >
              <span className="text-lg leading-none">+</span>
              NEW PRODUCTS
            </button>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="bg-pink-50 border-b border-pink-100">
                <th className="text-left px-6 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm w-full">
                  PRODUCT NAME
                </th>
                <th className="px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm text-center whitespace-nowrap">
                  PUBLISHED
                </th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-b border-pink-50 hover:bg-pink-50 transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-[#FFF8FA]"
                  }`}
                >
                  {/* Product name — click to edit */}
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setEditProduct(product)}
                      className="font-['Fredoka'] text-sm text-[#4B2E39] hover:text-[#C0395A] hover:underline text-left transition-colors"
                    >
                      {product.name}
                    </button>
                  </td>

                  {/* Published toggle + calendar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Toggle
                        checked={product.published}
                        onChange={() => handleTogglePublished(product.id)}
                      />
                      <button className="text-[#C0395A] hover:text-[#a02845] transition-colors">
                        <CalendarIcon />
                      </button>
                    </div>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeleteProduct(product)}
                      className="text-pink-300 hover:text-[#C0395A] transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-10 font-['Fredoka'] text-pink-300 text-sm">
                    No products found 🧶
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
