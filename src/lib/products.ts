// src/lib/products.ts
// ============================================================
// All Supabase queries related to products.
// Now includes: category filtering, reviews, and average ratings.
// ============================================================

import { supabase } from "./supabase";
import type { Product } from "./types";

// ── Get all published products ────────────────────────────────
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) { console.error("getAllProducts:", error.message); return []; }
    return data as Product[];
}

// ── Get all published products WITH their average rating ──────
// This joins the reviews table and computes avg(rating) per product.
// Think of it like a SQL LEFT JOIN + GROUP BY in one call.
export async function getAllProductsWithRatings(): Promise<ProductWithRating[]> {
    const { data, error } = await supabase
        .from("products")
        .select(`
      *,
      reviews ( rating )
    `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) { console.error("getAllProductsWithRatings:", error.message); return []; }

    // Calculate the average rating for each product from its reviews array
    return (data as RawProductWithReviews[]).map((p) => {
        const reviews = p.reviews ?? [];
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
        return {
            ...p,
            avg_rating: Math.round(avgRating * 10) / 10, // e.g. 3.7
            review_count: reviews.length,
        };
    });
}

// ── Get products by category ───────────────────────────────────
export async function getProductsByCategory(category: string): Promise<ProductWithRating[]> {
    const { data, error } = await supabase
        .from("products")
        .select(`*, reviews ( rating )`)
        .eq("is_published", true)
        .eq("category", category)
        .order("created_at", { ascending: false });

    if (error) { console.error("getProductsByCategory:", error.message); return []; }

    return (data as RawProductWithReviews[]).map((p) => {
        const reviews = p.reviews ?? [];
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
        return { ...p, avg_rating: Math.round(avgRating * 10) / 10, review_count: reviews.length };
    });
}

// ── Get all unique categories from products table ─────────────
// Used to build the Categories row dynamically from real DB data.
export async function getCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from("products")
        .select("category")
        .eq("is_published", true)
        .not("category", "is", null);

    if (error) { console.error("getCategories:", error.message); return []; }

    // De-duplicate: like using a Set in Java/C#
    const unique = [...new Set((data as { category: string }[]).map((p) => p.category))];
    return unique.sort();
}

// ── Get featured products (for landing page) ──────────────────
export async function getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) { console.error("getFeaturedProducts:", error.message); return []; }
    return data as Product[];
}

// ── Get a single product by ID ─────────────────────────────────
export async function getProductById(id: string): Promise<ProductWithRating | null> {
    const { data, error } = await supabase
        .from("products")
        .select(`*, reviews ( rating, user_id, created_at )`)
        .eq("id", id)
        .eq("is_published", true)
        .single();

    if (error) { console.error("getProductById:", error.message); return null; }

    const p = data as RawProductWithReviews;
    const reviews = p.reviews ?? [];
    const avgRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    return { ...p, avg_rating: Math.round(avgRating * 10) / 10, review_count: reviews.length };
}

// ── Submit a review ────────────────────────────────────────────
// A user can only review a product once (enforced by DB UNIQUE constraint).
export async function submitReview(
    userId: string,
    productId: string,
    rating: number
): Promise<{ success: boolean; error?: string }> {
    // Upsert = insert if not exists, update if it does
    // This handles editing an existing review gracefully
    const { error } = await supabase
        .from("reviews")
        .upsert(
            { user_id: userId, product_id: productId, rating },
            { onConflict: "user_id,product_id" }
        );

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Get a user's review for a specific product ─────────────────
export async function getUserReview(
    userId: string,
    productId: string
): Promise<number | null> {
    const { data } = await supabase
        .from("reviews")
        .select("rating")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();

    return data?.rating ?? null;
}

// ── ADMIN queries (unchanged) ──────────────────────────────────
export async function adminGetAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) { console.error("adminGetAllProducts:", error.message); return []; }
    return data as Product[];
}

export async function adminCreateProduct(
    product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; product?: Product; error?: string }> {
    const { data, error } = await supabase
        .from("products").insert(product).select("*").single();
    if (error || !data) return { success: false, error: error?.message ?? "Failed." };
    return { success: true, product: data as Product };
}

export async function adminUpdateProduct(
    id: string,
    updates: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
): Promise<{ success: boolean; product?: Product; error?: string }> {
    const { data, error } = await supabase
        .from("products").update(updates).eq("id", id).select("*").single();
    if (error || !data) return { success: false, error: error?.message ?? "Failed." };
    return { success: true, product: data as Product };
}

export async function adminDeleteProduct(
    id: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function adminTogglePublished(
    id: string, is_published: boolean
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("products").update({ is_published }).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function adminToggleFeatured(
    id: string, is_featured: boolean
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("products").update({ is_featured }).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Internal types (only used inside this file + catalog page) ─

interface RawProductWithReviews extends Product {
    reviews: { rating: number; user_id?: string; created_at?: string }[];
}

export interface ProductWithRating extends Product {
    avg_rating: number;    // e.g. 3.7
    review_count: number;  // e.g. 12
}