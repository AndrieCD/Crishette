// src/app/shopping-cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCartItems, updateCartQuantity, removeFromCart } from "@/lib/cart";
import { getSession } from "@/lib/auth";
import type { CartItem, CrishetteUser } from "@/lib/types";

// ── CartItem extended with client-only `selected` flag ────────
// The DB has no `selected` column — this is purely UI state,
// like a transient ViewModel property in C# MVC.
type CartItemWithSelection = CartItem & { selected: boolean };

// ── Sub-components ─────────────────────────────────────────────

function CartCheckbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
    return (
        <button type="button" onClick={onToggle} aria-pressed={checked}
            className={`flex h-10 w-10 items-center justify-center rounded-[10px] border-2 transition ${checked ? "border-[#c93b57] bg-[#fbe8ee]" : "border-[#e4b8c2] bg-white"
                }`}
        >
            {checked && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c93b57]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.261a1 1 0 0 1-1.42.005L3.29 9.17a1 1 0 1 1 1.414-1.414l4.09 4.09 6.493-6.55a1 1 0 0 1 1.417-.006Z" clipRule="evenodd" />
                </svg>
            )}
        </button>
    );
}

function QuantityControl({ quantity, onDecrease, onIncrease }: {
    quantity: number; onDecrease: () => void; onIncrease: () => void;
}) {
    return (
        <div className="flex h-10 items-center overflow-hidden rounded-[10px] border-2 border-[#e4b8c2] bg-white text-[#7a5d67] shadow-sm">
            <button type="button" onClick={onDecrease} className="px-4 text-xl font-bold transition hover:bg-[#fbe8ee]">−</button>
            <span className="min-w-[38px] text-center text-base font-bold">{quantity}</span>
            <button type="button" onClick={onIncrease} className="px-4 text-xl font-bold transition hover:bg-[#fbe8ee]">+</button>
        </div>
    );
}

function CartSkeleton() {
    return (
        <div className="space-y-4 pt-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-[24px] border-2 border-[#ecd3d9] bg-white/70 p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-[10px] bg-pink-100" />
                        <div className="h-[110px] w-[110px] rounded-[8px] bg-pink-100" />
                        <div className="flex-1 space-y-2">
                            <div className="h-5 w-48 rounded-full bg-pink-100" />
                            <div className="h-4 w-32 rounded-full bg-pink-100" />
                        </div>
                        <div className="h-8 w-20 rounded-full bg-pink-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────
export default function ShoppingCartPage() {
    const router = useRouter();
    const [user, setUser] = useState<CrishetteUser | null>(null);
    const [cartItems, setCartItems] = useState<CartItemWithSelection[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function load() {
            const session = getSession();
            setUser(session);
            if (!session) { router.push("/login"); return; }

            setLoading(true);
            // getCartItems joins the products table → item.product has name, price, image
            const data = await getCartItems(session.id);
            // Add client-only `selected: false` to every row
            setCartItems(data.map((item) => ({ ...item, selected: false })));
            setLoading(false);
        }
        load();
    }, []);

    // ── Derived totals ─────────────────────────────────────────
    const total = useMemo(
        () => cartItems.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0),
        [cartItems]
    );
    const totalItems = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );
    const selectedItems = useMemo(
        () => cartItems.filter((item) => item.selected),
        [cartItems]
    );

    // ── Handlers ───────────────────────────────────────────────

    // Checkbox toggle — pure UI state, no DB call
    const toggleSelected = (id: string) => {
        setCartItems((prev) =>
            prev.map((item) => item.id === id ? { ...item, selected: !item.selected } : item)
        );
    };

    // Quantity change — optimistic UI update, then sync to Supabase
    const changeQuantity = async (id: string, newQty: number) => {
        if (newQty < 1) return;
        setUpdatingIds((prev) => new Set(prev).add(id));
        setCartItems((prev) =>
            prev.map((item) => item.id === id ? { ...item, quantity: newQty } : item)
        );
        await updateCartQuantity(id, newQty);
        setUpdatingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    };

    // Delete — remove from UI immediately, then delete from Supabase
    const deleteItem = async (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        await removeFromCart(id);
    };

    // Checkout — serialize selected items into sessionStorage and navigate
    // sessionStorage is like localStorage but auto-clears when the tab closes.
    // Shipping and Checkout pages read from it.
    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert("Please select at least one item before checking out.");
            return;
        }
        sessionStorage.setItem("checkoutItems", JSON.stringify(
            selectedItems.map((item) => ({
                cart_item_id: item.id,
                product_id: item.product_id,
                product_name: item.product?.name ?? "Unknown",
                product_image: item.product?.image ?? "",
                price: item.product?.price ?? 0,
                quantity: item.quantity,
                color: item.color ?? "",
                size: item.size ?? "",
            }))
        ));
        router.push("/shipping-method");
    };

    if (!user && !loading) return null;

    return (
        <main className="min-h-screen bg-[#c93b57] font-['Fredoka']">
            <Navbar />

            <div className="px-4 pb-8 pt-4 md:px-8">
                <section className="min-h-[calc(100vh-200px)] rounded-[34px] bg-[#f9f6f7] px-5 pb-8 pt-6 md:px-10 md:pb-10">

                    {loading && <CartSkeleton />}

                    {!loading && cartItems.length === 0 && (
                        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                            <p className="text-6xl">🛒</p>
                            <h2 className="mt-4 text-[34px] font-extrabold text-[#c93b57]">Your cart is empty</h2>
                            <p className="mt-3 text-[18px] font-semibold text-[#c93b57]">Add a product first to continue shopping.</p>
                            <Link href="/product-catalog" className="mt-6 rounded-full bg-[#c93b57] px-8 py-3 text-[22px] font-extrabold text-white transition hover:opacity-90">
                                go to catalog
                            </Link>
                        </div>
                    )}

                    {!loading && cartItems.length > 0 && (
                        <div className="pt-2 text-[#c93b57]">
                            <div className="mb-5 border-t-[3px] border-[#e4b8c2] pt-5">

                                {/* Desktop column headers */}
                                <div className="hidden grid-cols-[70px_2.5fr_1fr_1fr_120px] gap-4 md:grid">
                                    <div />
                                    <div className="text-left text-[20px] font-extrabold uppercase">Product</div>
                                    <div className="text-center text-[20px] font-extrabold uppercase">Unit Price</div>
                                    <div className="text-center text-[20px] font-extrabold uppercase">Quantity</div>
                                    <div className="text-center text-[20px] font-extrabold uppercase">Actions</div>
                                </div>

                                <div className="space-y-4 md:space-y-5">
                                    {cartItems.map((item) => {
                                        const isUpdating = updatingIds.has(item.id);
                                        const imageSrc = `/images/${item.product?.image ?? "product1"}.png`;

                                        return (
                                            <div key={`${item.id}-${item.color}-${item.size}`}
                                                className={`rounded-[24px] border-2 border-[#ecd3d9] bg-white/70 p-4 transition-opacity md:rounded-none md:border-0 md:bg-transparent md:p-0 ${isUpdating ? "opacity-60" : "opacity-100"}`}
                                            >
                                                {/* Desktop */}
                                                <div className="hidden items-center gap-4 md:grid md:grid-cols-[70px_2.5fr_1fr_1fr_120px]">
                                                    <div className="flex justify-center">
                                                        <CartCheckbox checked={item.selected} onToggle={() => toggleSelected(item.id)} />
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="overflow-hidden rounded-[8px] border-[4px] border-[#e7748f]">
                                                            <Image src={imageSrc} alt={item.product?.name ?? "Product"} width={110} height={110} className="h-[110px] w-[110px] object-cover" />
                                                        </div>
                                                        <div className="max-w-[260px]">
                                                            <h2 className="text-[22px] font-bold leading-[1] text-[#c93b57]">{item.product?.name ?? "Unknown"}</h2>
                                                            {item.color && <p className="mt-2 text-[16px] font-semibold text-[#c93b57]">Color: <span className="capitalize">{item.color}</span></p>}
                                                            {item.size && <p className="text-[16px] font-semibold text-[#c93b57]">Size: <span className="capitalize">{item.size}</span></p>}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[28px] font-extrabold text-[#c93b57]">₱{(item.product?.price ?? 0).toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <QuantityControl
                                                            quantity={item.quantity}
                                                            onDecrease={() => changeQuantity(item.id, item.quantity - 1)}
                                                            onIncrease={() => changeQuantity(item.id, item.quantity + 1)}
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <button type="button" onClick={() => deleteItem(item.id)} disabled={isUpdating}
                                                            className="text-[20px] font-bold text-[#c93b57] transition hover:opacity-70 disabled:opacity-40">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Mobile */}
                                                <div className="md:hidden">
                                                    <div className="mb-4 flex items-start gap-3">
                                                        <CartCheckbox checked={item.selected} onToggle={() => toggleSelected(item.id)} />
                                                        <div className="overflow-hidden rounded-[8px] border-[4px] border-[#e7748f]">
                                                            <Image src={imageSrc} alt={item.product?.name ?? "Product"} width={92} height={92} className="h-[92px] w-[92px] object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h2 className="text-[20px] font-bold leading-[1] text-[#c93b57]">{item.product?.name ?? "Unknown"}</h2>
                                                            {item.color && <p className="mt-2 text-[14px] font-semibold text-[#c93b57]">Color: <span className="capitalize">{item.color}</span></p>}
                                                            {item.size && <p className="text-[14px] font-semibold text-[#c93b57]">Size: <span className="capitalize">{item.size}</span></p>}
                                                            <p className="mt-2 text-[24px] font-extrabold text-[#c93b57]">₱{(item.product?.price ?? 0).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <QuantityControl
                                                            quantity={item.quantity}
                                                            onDecrease={() => changeQuantity(item.id, item.quantity - 1)}
                                                            onIncrease={() => changeQuantity(item.id, item.quantity + 1)}
                                                        />
                                                        <button type="button" onClick={() => deleteItem(item.id)} className="text-[18px] font-bold text-[#c93b57] transition hover:opacity-70">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col items-end gap-4">
                                <p className="text-[22px] font-extrabold text-[#c93b57]">
                                    Total ({totalItems} {totalItems === 1 ? "Item" : "Items"}): <span>₱{total.toFixed(2)}</span>
                                </p>
                                <button type="button" onClick={handleCheckout}
                                    className="rounded-full bg-[#c93b57] px-10 py-3 text-[28px] font-extrabold leading-none text-white transition hover:opacity-90 md:text-[32px]">
                                    check out
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}