// src/app/product/[id]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import { getProductById, submitReview, getUserReview, type ProductWithRating } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { toggleLike, isLiked } from "@/lib/likes";
import { getSession } from "@/lib/auth";
import type { CrishetteUser } from "@/lib/types";

// ── Quantity +/- control (unchanged from your original) ────────
function QuantityControl({
    quantity,
    onDecrease,
    onIncrease,
}: {
    quantity: number;
    onDecrease: () => void;
    onIncrease: () => void;
}) {
    return (
        <div className="flex h-11 items-center overflow-hidden rounded-[10px] border-2 border-[#e4b8c2] bg-white text-[#7a5d67] shadow-sm">
            <button
                type="button"
                onClick={onDecrease}
                className="px-4 text-xl font-bold transition hover:bg-[#fbe8ee]"
            >
                −
            </button>
            <span className="min-w-[42px] text-center text-lg font-bold">
                {quantity}
            </span>
            <button
                type="button"
                onClick={onIncrease}
                className="px-4 text-xl font-bold transition hover:bg-[#fbe8ee]"
            >
                +
            </button>
        </div>
    );
}

// ── Star rating display (read-only, for showing avg) ───────────
function StarDisplay({ value, count }: { value: number; count: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-2xl ${star <= Math.round(value) ? "text-[#c93b57]" : "text-pink-200"}`}
                    >
                        ★
                    </span>
                ))}
            </div>
            <span className="text-sm font-semibold text-[#c93b57]">
                {value > 0 ? `${value.toFixed(1)} (${count} review${count !== 1 ? "s" : ""})` : "No reviews yet"}
            </span>
        </div>
    );
}

// ── Star rating input (clickable, for submitting a review) ─────
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className={`text-2xl transition-colors ${star <= (hovered || value) ? "text-[#c93b57]" : "text-pink-200"
                        }`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

// ── Toast notification ─────────────────────────────────────────
function Toast({ message, visible }: { message: string; visible: boolean }) {
    return (
        <div
            className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#c93b57] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
        >
            {message}
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────
export default function ProductDetailsPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    // ── Data state ─────────────────────────────────────────────
    const [product, setProduct] = useState<ProductWithRating | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<CrishetteUser | null>(null);

    // ── UI selection state ─────────────────────────────────────
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    // ── Like state ─────────────────────────────────────────────
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    // ── Review state ───────────────────────────────────────────
    const [userRating, setUserRating] = useState(0);       // what the user picked
    const [existingRating, setExistingRating] = useState<number | null>(null); // what they already submitted
    const [reviewLoading, setReviewLoading] = useState(false);

    // ── Cart state ─────────────────────────────────────────────
    const [addingToCart, setAddingToCart] = useState(false);

    // ── Toast ──────────────────────────────────────────────────
    const [toast, setToast] = useState({ message: "", visible: false });

    function showToast(message: string) {
        setToast({ message, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
    }

    // ── Fetch product + session + like status on load ──────────
    useEffect(() => {
        async function load() {
            setLoading(true);

            // 1. Get current logged-in user from localStorage
            const session = getSession();
            setUser(session);

            // 2. Fetch product from Supabase by URL param ID
            //    This replaces: PRODUCTS.find((item) => item.id === params.id)
            const data = await getProductById(params.id);
            setProduct(data);

            if (data) {
                // Set default selected color and size
                setSelectedColor(data.colors?.[0] ?? "");
                setSelectedSize(data.sizes?.[0] ?? "");
            }

            // 3. Check if this user has already liked this product
            if (session && data) {
                const [likedStatus, existingUserRating] = await Promise.all([
                    isLiked(session.id, data.id),
                    getUserReview(session.id, data.id),
                ]);
                setLiked(likedStatus);
                if (existingUserRating !== null) {
                    setExistingRating(existingUserRating);
                    setUserRating(existingUserRating);
                }
            }

            setLoading(false);
        }
        load();
    }, [params.id]);

    // ── Handle Add to Cart ─────────────────────────────────────
    // Replaces the localStorage approach with a real Supabase insert
    const handleAddToCart = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (!product) return;

        setAddingToCart(true);
        const result = await addToCart(
            user.id,
            product.id,
            quantity,
            selectedColor,
            selectedSize
        );
        setAddingToCart(false);

        if (result.success) {
            showToast("Added to cart! 🛍️");
            setTimeout(() => router.push("/shopping-cart"), 1000);
        } else {
            showToast("Failed to add to cart. Try again.");
        }
    };

    // ── Handle Like Toggle ─────────────────────────────────────
    const handleLike = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (!product) return;

        setLikeLoading(true);
        const result = await toggleLike(user.id, product.id);
        setLikeLoading(false);

        if (result.success) {
            setLiked(result.liked);
            showToast(result.liked ? "Added to likes! 🩷" : "Removed from likes");
        }
    };

    // ── Handle Review Submit ───────────────────────────────────
    const handleReviewSubmit = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (!product || userRating === 0) return;

        setReviewLoading(true);
        const result = await submitReview(user.id, product.id, userRating);
        setReviewLoading(false);

        if (result.success) {
            setExistingRating(userRating);
            showToast("Review submitted! ★");
            // Refresh product to show updated avg rating
            const updated = await getProductById(product.id);
            if (updated) setProduct(updated);
        } else {
            showToast("Failed to submit review.");
        }
    };

    // ── Loading state ──────────────────────────────────────────
    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7edf1] font-['Fredoka']">
                <div className="mx-auto w-full max-w-[1400px] bg-[#c93b57] p-4 md:p-6">
                    <div className="min-h-[calc(100vh-96px)] animate-pulse rounded-[34px] bg-[#f9f6f7] p-10">
                        <div className="grid gap-10 md:grid-cols-2">
                            <div className="aspect-square rounded-[22px] bg-pink-100" />
                            <div className="flex flex-col gap-4">
                                <div className="h-16 rounded-full bg-pink-100" />
                                <div className="h-10 w-1/3 rounded-full bg-pink-100" />
                                <div className="h-8 w-1/2 rounded-full bg-pink-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // ── Product not found ──────────────────────────────────────
    if (!product) {
        return (
            <main className="min-h-screen bg-[#f7edf1] px-4 py-6 font-['Fredoka'] md:px-8 md:py-8">
                <div className="mx-auto w-full max-w-[1400px] bg-[#c93b57] p-4 md:p-6">
                    <section className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center rounded-[34px] bg-[#f9f6f7] px-6 py-10 text-center">
                        <h1 className="text-[34px] font-extrabold text-[#c93b57]">
                            Product not found 🧶
                        </h1>
                        <Link
                            href="/product-catalog"
                            className="mt-6 rounded-full bg-[#c93b57] px-8 py-3 text-[22px] font-extrabold text-white hover:opacity-90 transition-opacity"
                        >
                            back to catalog
                        </Link>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#c93b57] font-['Fredoka']">
            {/* Shared Navbar — no search props needed on this page */}
            <HeroBanner />
            <Navbar />

            <div className="px-4 pb-8 pt-4 md:px-8">
                <section className="min-h-[calc(100vh-96px)] rounded-[34px] bg-[#f9f6f7] px-5 pb-8 pt-6 md:px-10 md:pb-10">

                    <div className="pt-2 text-[#c93b57]">
                        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">

                            {/* ── Product Image ── */}
                            <div>
                                <div className="overflow-hidden rounded-[22px] border-[8px] border-[#d34563] bg-white">
                                    <Image
                                        src={`/images/${product.image}.png`}
                                        alt={product.name}
                                        width={700}
                                        height={700}
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* ── Product Info ── */}
                            <div className="flex flex-col gap-5">
                                <div>
                                    <h1 className="text-[44px] font-extrabold uppercase leading-none text-[#c93b57] drop-shadow-[3px_3px_0_#fff] md:text-[64px]">
                                        {product.name}
                                    </h1>

                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="text-[32px] font-extrabold md:text-[44px]">
                                            ₱{product.price.toFixed(2)}
                                        </span>
                                        <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-bold text-[#c93b57]">
                                            {product.stock} in stock
                                        </span>
                                    </div>

                                    {/* Average rating display */}
                                    <div className="mt-2">
                                        <StarDisplay value={product.avg_rating} count={product.review_count} />
                                    </div>
                                </div>

                                {/* ── Color selector ── */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="flex items-start gap-4">
                                        <span className="min-w-[80px] pt-1 text-[22px] font-extrabold">
                                            Color
                                        </span>
                                        <div className="flex flex-wrap gap-3">
                                            {product.colors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`min-w-[110px] rounded-[12px] border-2 px-6 py-2 text-[18px] font-bold capitalize transition-colors ${selectedColor === color
                                                            ? "border-[#c93b57] bg-[#fbe8ee] text-[#c93b57]"
                                                            : "border-[#d6c0c6] bg-white text-[#c93b57] hover:border-[#c93b57]"
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── Size selector ── */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="flex items-start gap-4">
                                        <span className="min-w-[80px] pt-1 text-[22px] font-extrabold">
                                            Size
                                        </span>
                                        <div className="flex flex-wrap gap-3">
                                            {product.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`min-w-[110px] rounded-[12px] border-2 px-6 py-2 text-[18px] font-bold capitalize transition-colors ${selectedSize === size
                                                            ? "border-[#c93b57] bg-[#fbe8ee] text-[#c93b57]"
                                                            : "border-[#d6c0c6] bg-white text-[#c93b57] hover:border-[#c93b57]"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── Quantity ── */}
                                <div className="flex items-center gap-4">
                                    <span className="min-w-[120px] text-[22px] font-extrabold">
                                        Quantity
                                    </span>
                                    <QuantityControl
                                        quantity={quantity}
                                        onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                        onIncrease={() =>
                                            setQuantity((prev) =>
                                                Math.min(product.stock, prev + 1) // can't exceed stock
                                            )
                                        }
                                    />
                                </div>

                                {/* ── Add to Cart + Like ── */}
                                <div className="mt-2 flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={addingToCart || product.stock === 0}
                                        className="rounded-full bg-[#c93b57] px-8 py-4 text-[24px] font-extrabold leading-none text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed md:text-[32px]"
                                    >
                                        {product.stock === 0
                                            ? "Out of Stock"
                                            : addingToCart
                                                ? "Adding..."
                                                : "🛒 Add to Cart"}
                                    </button>

                                    {/* Like button — filled heart if liked, outline if not */}
                                    <button
                                        type="button"
                                        onClick={handleLike}
                                        disabled={likeLoading}
                                        className={`text-[44px] leading-none transition-transform hover:scale-110 disabled:opacity-50 ${liked ? "text-[#c93b57]" : "text-pink-200"
                                            }`}
                                        title={liked ? "Remove from likes" : "Add to likes"}
                                    >
                                        {liked ? "♥" : "♡"}
                                    </button>
                                </div>

                                {/* ── Guest nudge — shown when not logged in ── */}
                                {!user && (
                                    <p className="text-sm text-[#c93b57] opacity-70">
                                        <Link href="/login" className="underline font-bold">Sign in</Link>
                                        {" "}to save items to your cart and likes 🌸
                                    </p>
                                )}

                                {/* ── Leave a rating ── */}
                                <div className="mt-4 rounded-2xl border-2 border-pink-100 bg-white p-4">
                                    <p className="mb-2 text-sm font-extrabold text-[#c93b57]">
                                        {existingRating !== null ? "Update your rating" : "Leave a rating"}
                                    </p>
                                    {existingRating !== null && (
                                        <p className="mb-2 text-xs text-gray-400">
                                            Your current rating: {"★".repeat(existingRating)}{"☆".repeat(5 - existingRating)}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <StarInput value={userRating} onChange={setUserRating} />
                                        <button
                                            type="button"
                                            onClick={handleReviewSubmit}
                                            disabled={reviewLoading || userRating === 0 || !user}
                                            className="rounded-full bg-[#c93b57] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                        >
                                            {reviewLoading ? "Saving..." : existingRating !== null ? "Update" : "Submit"}
                                        </button>
                                    </div>
                                    {!user && (
                                        <p className="mt-2 text-xs text-gray-400">
                                            <Link href="/login" className="underline text-[#c93b57]">Sign in</Link> to leave a rating
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Product Description ── */}
                        <div className="mt-10 border-t-[3px] border-[#e4b8c2] pt-8">
                            <h2 className="text-[34px] font-extrabold text-[#c93b57]">
                                Detail
                            </h2>
                            <p className="mt-3 max-w-[980px] text-[18px] font-semibold leading-relaxed text-[#c93b57]">
                                {product.description}
                            </p>

                            {/* Category badge */}
                            {product.category && (
                                <span className="mt-4 inline-block rounded-full bg-pink-100 px-4 py-1 text-sm font-bold text-[#c93b57]">
                                    🧶 {product.category}
                                </span>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* Toast notification */}
            <Toast message={toast.message} visible={toast.visible} />
        </main>
    );
}