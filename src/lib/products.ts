// src/lib/products.ts


import { supabase } from "./supabase";
import type { Product } from "./types";

// ── Internal types ─────────────────────────────────────────────
interface RawProductWithReviews extends Product {
    reviews: { rating: number; user_id?: string; created_at?: string }[];
}

export interface ProductWithRating extends Product {
    avg_rating: number;    
    review_count: number;  
    sales_count: number;   
}

// ── Shared helper: compute avg rating from raw reviews array ──
function computeAvgRating(reviews: { rating: number }[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
}

// ── Shared helper: fetch sales counts for a batch of product IDs ──
async function fetchSalesCountsByIds(productIds: string[]): Promise<Record<string, number>> {
    if (productIds.length === 0) return {};

    const { data, error } = await supabase
        .from("order_items")
        .select(`
            product_id,
            quantity,
            order:orders!inner ( status )
        `)
        .in("product_id", productIds)
        .eq("order.status", "Completed");

    if (error || !data) {
        console.error("fetchSalesCountsByIds:", error?.message);
        return {};
    }

    const counts: Record<string, number> = {};
    for (const row of data as { product_id: string; quantity: number }[]) {
        counts[row.product_id] = (counts[row.product_id] ?? 0) + row.quantity;
    }
    return counts;
}

// ── Get sales counts for ALL products (used by catalog page) ──
export async function getProductSalesCounts(): Promise<Record<string, number>> {
    const { data, error } = await supabase
        .from("order_items")
        .select(`
            product_id,
            quantity,
            order:orders!inner ( status )
        `)
        .eq("order.status", "Completed");

    if (error) { console.error("getProductSalesCounts:", error.message); return {}; }

    const counts: Record<string, number> = {};
    for (const row of data as { product_id: string; quantity: number }[]) {
        counts[row.product_id] = (counts[row.product_id] ?? 0) + row.quantity;
    }
    return counts;
}

// ── Get all published products (plain, no ratings/sales) ──────
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) { console.error("getAllProducts:", error.message); return []; }
    return data as Product[];
}

// ── Get all published products WITH avg rating ─────────────────
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

    return (data as RawProductWithReviews[]).map((p) => ({
        ...p,
        avg_rating: computeAvgRating(p.reviews ?? []),
        review_count: (p.reviews ?? []).length,
        sales_count: 0, 
    }));
}

// ── Get products by category WITH avg rating + sales count ────
export async function getProductsByCategory(category: string): Promise<ProductWithRating[]> {
    const { data, error } = await supabase
        .from("products")
        .select(`*, reviews ( rating )`)
        .eq("is_published", true)
        .eq("category", category)
        .order("created_at", { ascending: false });

    if (error) { console.error("getProductsByCategory:", error.message); return []; }

    const rawProducts = data as RawProductWithReviews[];
    const salesCounts = await fetchSalesCountsByIds(rawProducts.map((p) => p.id));

    return rawProducts.map((p) => ({
        ...p,
        avg_rating: computeAvgRating(p.reviews ?? []),
        review_count: (p.reviews ?? []).length,
        sales_count: salesCounts[p.id] ?? 0,
    }));
}

// ── Get all unique category names from published products ──────
export async function getCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from("products")
        .select("category")
        .eq("is_published", true)
        .not("category", "is", null);

    if (error) { console.error("getCategories:", error.message); return []; }

    const unique = [...new Set((data as { category: string }[]).map((p) => p.category))];
    return unique.sort();
}

// ── Get featured products (for landing page, plain Product) ───
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

// ── Get a single product by ID WITH avg rating + sales count ──
export async function getProductById(id: string): Promise<ProductWithRating | null> {
    const { data, error } = await supabase
        .from("products")
        .select(`*, reviews ( rating, user_id, created_at )`)
        .eq("id", id)
        .eq("is_published", true)
        .single();

    if (error) { console.error("getProductById:", error.message); return null; }

    const p = data as RawProductWithReviews;
    const salesCounts = await fetchSalesCountsByIds([id]);

    return {
        ...p,
        avg_rating: computeAvgRating(p.reviews ?? []),
        review_count: (p.reviews ?? []).length,
        sales_count: salesCounts[id] ?? 0,
    };
}

// ── Submit a review ────────────────────────────────────────────
export async function submitReview(
    userId: string,
    productId: string,
    rating: number
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from("reviews")
        .upsert(
            { user_id: userId, product_id: productId, rating },
            { onConflict: "user_id,product_id" }
        );

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Get a user's existing review for a product ─────────────────
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

// ── ADMIN: Get ALL products (including unpublished) ────────────
export async function adminGetAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) { console.error("adminGetAllProducts:", error.message); return []; }
    return data as Product[];
}

// ── ADMIN: Create a new product ────────────────────────────────
export async function adminCreateProduct(
    product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; product?: Product; error?: string }> {
    const { data, error } = await supabase
        .from("products").insert(product).select("*").single();
    if (error || !data) return { success: false, error: error?.message ?? "Failed." };
    return { success: true, product: data as Product };
}

// ── ADMIN: Update an existing product ─────────────────────────
export async function adminUpdateProduct(
    id: string,
    updates: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
): Promise<{ success: boolean; product?: Product; error?: string }> {
    const { data, error } = await supabase
        .from("products").update(updates).eq("id", id).select("*").single();
    if (error || !data) return { success: false, error: error?.message ?? "Failed." };
    return { success: true, product: data as Product };
}

// ── ADMIN: Delete a product ────────────────────────────────────
export async function adminDeleteProduct(
    id: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── ADMIN: Toggle published status ────────────────────────────
export async function adminTogglePublished(
    id: string,
    is_published: boolean
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("products").update({ is_published }).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── ADMIN: Toggle featured status ─────────────────────────────
export async function adminToggleFeatured(
    id: string,
    is_featured: boolean
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("products").update({ is_featured }).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}