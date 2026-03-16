"use client";
// src/app/product-catalog/page.tsx

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
    getAllProductsWithRatings,
    getCategories,
    getProductSalesCounts,
    type ProductWithRating,
} from "@/lib/products";
import HeroBanner from "@/components/HeroBanner";



// ── Star display (read-only) ──────────────────────────────────────────────────
function StarDisplay({ value }: { value: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-sm ${star <= Math.round(value) ? "text-[#C0395A]" : "text-pink-200"}`}>★</span>
            ))}
        </div>
    );
}

// ── Star rating (clickable) ───────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => onChange(star === value ? 0 : star)}
                    className={`text-xl transition-colors ${star <= value ? "text-[#C0395A]" : "text-pink-200"}`}>★</button>
            ))}
        </div>
    );
}

// ── Filter Sidebar ────────────────────────────────────────────────────────────
function FilterSidebar({ minPrice, maxPrice, rating, onMinPrice, onMaxPrice, onRating, onApply, onClear }: {
    minPrice: string; maxPrice: string; rating: number;
    onMinPrice: (v: string) => void; onMaxPrice: (v: string) => void; onRating: (v: number) => void;
    onApply: () => void; onClear: () => void;
}) {
    return (
        <aside className="h-fit w-44 shrink-0 rounded-2xl bg-white p-4 shadow-md">
            <div className="mb-4 flex items-center gap-2">
                <svg className="h-4 w-4 text-[#C0395A]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6h16v2l-6 6v6l-4-2v-4L4 8V6z" />
                </svg>
                <span className="text-sm font-bold text-[#C0395A]">Search Filter</span>
            </div>
            <div className="mb-4">
                <p className="mb-2 text-xs font-semibold text-[#4B2E39]">Price Range</p>
                <div className="flex items-center gap-1">
                    <input type="number" placeholder="$ MIN" value={minPrice} onChange={(e) => onMinPrice(e.target.value)}
                        className="w-full rounded-lg border-2 border-pink-200 px-2 py-1 text-xs text-[#4B2E39] outline-none" />
                    <span className="text-xs text-pink-300">—</span>
                    <input type="number" placeholder="$ MAX" value={maxPrice} onChange={(e) => onMaxPrice(e.target.value)}
                        className="w-full rounded-lg border-2 border-pink-200 px-2 py-1 text-xs text-[#4B2E39] outline-none" />
                </div>
            </div>
            <div className="mb-4">
                <p className="mb-2 text-xs font-semibold text-[#4B2E39]">
                    Min Rating{rating > 0 && <span className="ml-1 text-[#C0395A]">({rating}★ & up)</span>}
                </p>
                <StarRating value={rating} onChange={onRating} />
            </div>
            <button type="button" onClick={onApply}
                className="mb-3 w-full rounded-full bg-[#C0395A] py-1.5 text-xs font-bold text-white hover:bg-pink-700 transition-colors">Apply</button>
            <button type="button" onClick={onClear}
                className="w-full rounded-full border-2 border-[#C0395A] bg-white py-1.5 text-xs font-bold text-[#C0395A] hover:bg-pink-50 transition-colors">Clear All</button>
        </aside>
    );
}

function CategoryCard({ name, active, onClick }: { name: string; active: boolean; onClick: () => void }) {
    const CATEGORY_EMOJI: Record<string, string> = {
        Keychains: "🔑",
        Amigurumi: "🐰",
        "Fan Made": "⭐",
    };

    return (
        <button type="button" onClick={onClick} className="shrink-0 flex flex-col items-center gap-1 transition-transform hover:scale-105">
            <div className={`h-20 w-20 rounded-2xl border-4 flex items-center justify-center ${active ? "border-[#C0395A]" : "border-pink-200"}`}
                style={{ clipPath: "polygon(50% 0%,56% 3%,63% 2%,68% 7%,75% 8%,79% 14%,86% 16%,89% 23%,95% 27%,97% 34%,100% 40%,100% 47%,98% 53%,100% 60%,98% 67%,95% 73%,89% 77%,87% 84%,81% 88%,75% 92%,68% 93%,62% 98%,56% 97%,50% 100%,44% 97%,38% 98%,32% 93%,25% 92%,19% 88%,13% 84%,11% 77%,5% 73%,2% 67%,0% 60%,2% 53%,0% 47%,0% 40%,3% 34%,5% 27%,11% 23%,14% 16%,21% 14%,25% 8%,32% 7%,37% 2%,44% 3%)" }}>
                <span className="text-2xl">{CATEGORY_EMOJI[name] ?? "🧶"}</span>
            </div>
            <span className={`text-xs font-semibold ${active ? "text-[#C0395A]" : "text-[#4B2E39]"}`}>{name}</span>
        </button>
    );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: ProductWithRating }) {
    return (
        <Link href={`/product/${product.id}`}
            className="group overflow-hidden rounded-2xl border-2 border-pink-100 bg-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-pink-200">
            <div className="relative aspect-square w-full overflow-hidden">
                <Image src={`/images/${product.image}.png`} alt={product.name} fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="px-2 pb-3 pt-2 text-center">
                <p className="text-sm font-semibold text-[#4B2E39] line-clamp-1">{product.name}</p>
                <p className="text-sm font-bold text-[#C0395A]">₱ {product.price.toFixed(2)}</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                    <StarDisplay value={product.avg_rating} />
                    <span className="text-[10px] text-gray-400">
                        {product.review_count > 0 ? `(${product.review_count})` : "No reviews"}
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────
function ProductSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border-2 border-pink-100 bg-white shadow-md animate-pulse">
            <div className="aspect-square w-full bg-pink-100" />
            <div className="px-2 pb-3 pt-2 space-y-2">
                <div className="h-3 bg-pink-100 rounded-full mx-2" />
                <div className="h-3 bg-pink-200 rounded-full mx-4" />
                <div className="h-2 bg-pink-100 rounded-full mx-6" />
            </div>
        </div>
    );
}

// ── Page loading fallback (shown while Suspense resolves) ─────────────────────
function CatalogSkeleton() {
    return (
        <div className="min-h-screen bg-[#C0395A] font-['Fredoka']">
            <div className="mt-4 px-4 md:px-8">
                <div className="flex flex-col overflow-hidden rounded-3xl bg-[#FFF0F6] shadow-lg p-5">
                    <div className="h-6 w-32 bg-pink-200 rounded-full animate-pulse mb-4" />
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── ✅ The actual catalog content — isolated so Suspense can wrap JUST this ───
// useSearchParams() MUST live inside a component that is wrapped by <Suspense>.
// Vercel's build pre-renders pages statically and throws if useSearchParams()
// is called outside a Suspense boundary — it can't know the URL at build time.
function CatalogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read search directly from URL — no useState needed
    const search = searchParams.get("q") ?? "";

    const [allProducts, setAllProducts] = useState<ProductWithRating[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [rating, setRating] = useState(0);
    const [appliedMin, setAppliedMin] = useState("");
    const [appliedMax, setAppliedMax] = useState("");
    const [appliedRating, setAppliedRating] = useState(0);
    const [sortBy, setSortBy] = useState<"Relevance" | "Latest" | "Top Sales">("Relevance");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const [productData, categoryData, salesCounts] = await Promise.all([
                getAllProductsWithRatings(),
                getCategories(),
                getProductSalesCounts(),   // ← add this
            ]);
            if (productData.length === 0)
                setError("No products found. Check your Supabase connection.");

            // Attach sales_count to each product
            const withSales = productData.map((p) => ({
                ...p,
                sales_count: salesCounts[p.id] ?? 0,
            }));

            setAllProducts(withSales);
            setCategories(categoryData);
            setLoading(false);
        }
        load();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...allProducts];
        if (search.trim())
            result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
        if (activeCategory)
            result = result.filter((p) => p.category === activeCategory);
        if (appliedMin)
            result = result.filter((p) => p.price >= Number(appliedMin));
        if (appliedMax)
            result = result.filter((p) => p.price <= Number(appliedMax));
        if (appliedRating > 0)
            result = result.filter((p) => p.avg_rating >= appliedRating);
        if (sortBy === "Latest")
            result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        if (sortBy === "Top Sales")
            result = [...result].sort((a, b) => (b.sales_count ?? 0) - (a.sales_count ?? 0));
        return result;
    }, [allProducts, search, activeCategory, appliedMin, appliedMax, appliedRating, sortBy]);

    const handleApply = () => { setAppliedMin(minPrice); setAppliedMax(maxPrice); setAppliedRating(rating); };
    const handleClear = () => {
        setMinPrice(""); setMaxPrice(""); setRating(0);
        setAppliedMin(""); setAppliedMax(""); setAppliedRating(0);
        setActiveCategory(null);
    };

    const handleSearchChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set("q", value);
        else params.delete("q");
        router.replace(`/product-catalog?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#C0395A] font-['Fredoka']">
            <HeroBanner />
            <Navbar searchValue={search} onSearchChange={handleSearchChange} />



            <div className="mt-4 px-4 pb-0 md:px-8">
                <div className="flex flex-col overflow-hidden rounded-3xl bg-[#FFF0F6] shadow-lg">
                    <div className="flex gap-5 p-5">
                        <FilterSidebar
                            minPrice={minPrice} maxPrice={maxPrice} rating={rating}
                            onMinPrice={setMinPrice} onMaxPrice={setMaxPrice} onRating={setRating}
                            onApply={handleApply} onClear={handleClear}
                        />

                        <div className="flex min-w-0 flex-1 flex-col gap-4">
                            <h2 className="text-xl font-bold uppercase tracking-wide text-[#C0395A]">Categories</h2>

                            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
                                <button type="button" onClick={() => setActiveCategory(null)}
                                    className="shrink-0 flex flex-col items-center gap-1 transition-transform hover:scale-105">
                                    <div className={`h-20 w-20 rounded-2xl border-4 flex items-center justify-center ${activeCategory === null ? "border-[#C0395A]" : "border-pink-200"}`}
                                        style={{ clipPath: "polygon(50% 0%,56% 3%,63% 2%,68% 7%,75% 8%,79% 14%,86% 16%,89% 23%,95% 27%,97% 34%,100% 40%,100% 47%,98% 53%,100% 60%,98% 67%,95% 73%,89% 77%,87% 84%,81% 88%,75% 92%,68% 93%,62% 98%,56% 97%,50% 100%,44% 97%,38% 98%,32% 93%,25% 92%,19% 88%,13% 84%,11% 77%,5% 73%,2% 67%,0% 60%,2% 53%,0% 47%,0% 40%,3% 34%,5% 27%,11% 23%,14% 16%,21% 14%,25% 8%,32% 7%,37% 2%,44% 3%)" }}>
                                        <span className="text-2xl">🌸</span>
                                    </div>
                                    <span className={`text-xs font-semibold ${activeCategory === null ? "text-[#C0395A]" : "text-[#4B2E39]"}`}>All</span>
                                </button>
                                {categories.map((cat) => (
                                    <CategoryCard key={cat} name={cat} active={activeCategory === cat}
                                        onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} />
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-[#4B2E39]">Sort by</span>
                                {(["Relevance", "Latest", "Top Sales"] as const).map((option) => (
                                    <button key={option} type="button" onClick={() => setSortBy(option)}
                                        className={`rounded-full border-2 px-4 py-1 text-sm font-semibold transition-colors ${sortBy === option ? "border-[#C0395A] bg-[#C0395A] text-white" : "border-pink-200 bg-white text-[#4B2E39]"}`}>
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {(activeCategory || appliedRating > 0 || appliedMin || appliedMax) && (
                                <div className="flex flex-wrap gap-2">
                                    {activeCategory && (
                                        <span className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-[#C0395A]">
                                            {activeCategory}
                                            <button onClick={() => setActiveCategory(null)}>✕</button>
                                        </span>
                                    )}
                                    {appliedRating > 0 && (
                                        <span className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-[#C0395A]">
                                            {appliedRating}★ & up
                                            <button onClick={() => { setRating(0); setAppliedRating(0); }}>✕</button>
                                        </span>
                                    )}
                                    {(appliedMin || appliedMax) && (
                                        <span className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-[#C0395A]">
                                            ₱{appliedMin || "0"} – ₱{appliedMax || "∞"}
                                            <button onClick={() => { setMinPrice(""); setMaxPrice(""); setAppliedMin(""); setAppliedMax(""); }}>✕</button>
                                        </span>
                                    )}
                                </div>
                            )}

                            {error && (
                                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-center text-sm text-red-500">⚠️ {error}</div>
                            )}
                            {loading && (
                                <div className="grid grid-cols-4 gap-3">
                                    {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
                                </div>
                            )}
                            {!loading && !error && (
                                filteredProducts.length === 0 ? (
                                    <div className="py-12 text-center text-sm text-[#4B2E39]">🧶 No products match your filters.</div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-3">
                                        {filteredProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <section className="mx-0 mt-0 rounded-t-none bg-[#FFF0F6] px-8 py-8">
                <h3 className="mb-2 text-xl font-bold text-[#C0395A]">About Crishette</h3>
                <p className="max-w-3xl text-sm leading-relaxed text-[#4B2E39]">
                    Handmade crochet creations made with love. Email: crishette@email.com · Instagram: @crishette · Based in Caloocan, Philippines
                    <br />© 2026 Crishette. All rights reserved.
                </p>
            </section>
        </div>
    );
}

// ── ✅ Default export wraps CatalogContent in Suspense ────────────────────────
// This is the ONLY change needed to fix the Vercel build error.
// Suspense tells Next.js: "this part of the page needs the URL at runtime,
// show a fallback while it loads instead of trying to pre-render it."
export default function ProductCatalogPage() {
    return (
        <Suspense fallback={<CatalogSkeleton />}>
            <CatalogContent />
        </Suspense>
    );
}