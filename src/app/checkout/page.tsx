// src/app/checkout/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/Navbar";
import { getSession } from "@/lib/auth";
import { placeOrder } from "@/lib/orders";
import { clearCart } from "@/lib/cart";
import type { CrishetteUser } from "@/lib/types";

// ── Types matching what cart page stored in sessionStorage ─────
type CheckoutItem = {
    cart_item_id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
};

type ShippingOption = {
    id: string;
    label: string;
    note: string;
    fee: number;
};

type PaymentMethod = "Cash On Delivery" | "GCash" | "Maya";

// ── Sub-components ─────────────────────────────────────────────

function ChangeButton({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" onClick={onClick}
            className="min-w-[120px] rounded-full bg-[#c93b57] px-6 py-2 text-[16px] font-bold text-white transition hover:opacity-90">
            change
        </button>
    );
}

function SectionModal({ title, children, onClose }: {
    title: string; children: React.ReactNode; onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
            <div className="w-full max-w-[520px] rounded-[28px] bg-[#fff7f9] p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[24px] font-extrabold text-[#c93b57]">{title}</h3>
                    <button type="button" onClick={onClose}
                        className="rounded-full bg-[#c93b57] px-4 py-1 text-sm font-bold text-white">
                        close
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ── Address type ───────────────────────────────────────────────
type Address = { fullName: string; phone: string; addressLine: string; };

// ── Main Page ──────────────────────────────────────────────────
export default function CheckoutPage() {
    const router = useRouter();

    const [user, setUser] = useState<CrishetteUser | null>(null);
    const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
    const [shipping, setShipping] = useState<ShippingOption>({
        id: "standard", label: "Standard Shipping",
        note: "Guaranteed to get by 12 Feb", fee: 50,
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash On Delivery");

    // Address prefilled from user profile, editable via modal
    const [address, setAddress] = useState<Address>({
        fullName: "", phone: "", addressLine: "",
    });
    const [draftAddress, setDraftAddress] = useState<Address>(address);

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [placing, setPlacing] = useState(false);   // true while calling Supabase
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    // ── Load session + sessionStorage data on mount ────────────
    useEffect(() => {
        const session = getSession();
        if (!session) { router.push("/login"); return; }
        setUser(session);

        // Pre-fill address from user profile
        setAddress({
            fullName: session.username ?? "",
            phone: session.phone ?? "",
            addressLine: session.address ?? "",
        });
        setDraftAddress({
            fullName: session.username ?? "",
            phone: session.phone ?? "",
            addressLine: session.address ?? "",
        });

        // Read items from sessionStorage (set by cart page)
        const rawItems = sessionStorage.getItem("checkoutItems");
        if (!rawItems) { router.push("/shopping-cart"); return; }
        try { setCheckoutItems(JSON.parse(rawItems)); } catch { router.push("/shopping-cart"); return; }

        // Read shipping choice from sessionStorage (set by shipping page)
        const rawShipping = sessionStorage.getItem("selectedShipping");
        if (rawShipping) {
            try { setShipping(JSON.parse(rawShipping)); } catch { /* use default */ }
        }
    }, []);

    // ── Derived totals ─────────────────────────────────────────
    const itemSubtotal = useMemo(
        () => checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [checkoutItems]
    );
    const totalPayment = itemSubtotal + shipping.fee;

    // ── Place order → Supabase ─────────────────────────────────
    // This is the most important function: it calls placeOrder()
    // from src/lib/orders.ts which:
    //   1. Creates a row in the `orders` table
    //   2. Creates rows in `order_items` (snapshot of what was bought)
    //   3. Then we clear the purchased items from `cart_items`
    const handlePlaceOrder = async () => {
        if (!user) return;
        setPlacing(true);
        setOrderError(null);

        // Build CartItem-compatible objects for placeOrder()
        // placeOrder() expects items with a `product` property
        const cartItemsForOrder = checkoutItems.map((item) => ({
            id: item.cart_item_id,
            user_id: user.id,
            product_id: item.product_id,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            added_at: new Date().toISOString(),
            product: {
                id: item.product_id,
                name: item.product_name,
                image: item.product_image,
                price: item.price,
                // Required Product fields — only price/name/image matter for order snapshot
                description: "", colors: [], sizes: [], stock: 0,
                is_featured: false, is_published: true,
                created_at: "", updated_at: "",
            },
        }));

        const deliveryAddress = `${address.fullName} | ${address.phone} | ${address.addressLine}`;

        const result = await placeOrder(
            user.id,
            cartItemsForOrder,
            shipping.fee,
            shipping.label,
            paymentMethod,
            deliveryAddress
        );

        if (!result.success) {
            setOrderError(result.error ?? "Failed to place order. Please try again.");
            setPlacing(false);
            return;
        }

        // Clear only the checked-out items from the cart (not the whole cart)
        const cartItemIds = checkoutItems.map((item) => item.cart_item_id);
        for (const id of cartItemIds) {
            await import("@/lib/cart").then(({ removeFromCart }) => removeFromCart(id));
        }

        // Clean up sessionStorage
        sessionStorage.removeItem("checkoutItems");
        sessionStorage.removeItem("selectedShipping");

        setPlacing(false);
        setOrderPlaced(true);
    };

    // ── Empty state (no items) ─────────────────────────────────
    if (!placing && checkoutItems.length === 0 && !orderPlaced) {
        return (
            <main className="min-h-screen bg-[#c93b57] font-['Fredoka']">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                    <h1 className="text-[34px] font-extrabold text-white">No items selected</h1>
                    <p className="mt-3 text-[18px] font-semibold text-pink-200">Please go back to your cart and choose at least one item.</p>
                    <Link href="/shopping-cart" className="mt-8 rounded-full bg-white px-8 py-3 text-[22px] font-extrabold text-[#c93b57]">
                        back to cart
                    </Link>
                </div>
            </main>
        );
    }

    // ── Order placed success screen ────────────────────────────
    if (orderPlaced) {
        return (
            <main className="min-h-screen bg-[#c93b57] font-['Fredoka']">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-10 text-center">
                    <p className="text-6xl">🎉</p>
                    <h1 className="mt-4 text-[34px] font-extrabold text-white md:text-[48px]">Order placed!</h1>
                    <p className="mt-3 max-w-[500px] text-[18px] font-semibold text-pink-200">
                        Your order has been saved. Each product is handmade — please allow 5–7 business days for production before shipping. 🧶
                    </p>
                    <div className="mt-8 w-full max-w-[380px] rounded-[24px] border-[3px] border-pink-300 bg-white/10 px-6 py-5 text-left text-white">
                        <p className="text-[18px] font-bold">Payment: {paymentMethod}</p>
                        <p className="text-[18px] font-bold">Shipping: {shipping.label}</p>
                        <p className="text-[18px] font-bold">Shipping fee: ₱{shipping.fee.toFixed(2)}</p>
                        <p className="mt-2 text-[22px] font-extrabold">Total paid: ₱{totalPayment.toFixed(2)}</p>
                    </div>
                    <div className="mt-6 flex gap-4">
                        <Link href="/profile" className="rounded-full bg-white px-6 py-3 text-[20px] font-extrabold text-[#c93b57]">
                            My Purchases
                        </Link>
                        <Link href="/product-catalog" className="rounded-full border-2 border-white px-6 py-3 text-[20px] font-extrabold text-white">
                            Keep Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // ── Main checkout view ─────────────────────────────────────
    return (
        <main className="min-h-screen bg-[#c93b57] font-['Fredoka']">
            <Navbar />

            <div className="px-4 pb-8 pt-4 md:px-8">
                <section className="rounded-[34px] bg-[#f9f6f7] px-5 pb-10 pt-6 md:px-10">
                    <div className="text-[#c93b57]">

                        {/* ── Delivery Address ── */}
                        <div className="border-t-[3px] border-[#e4b8c2] py-5">
                            <h2 className="mb-3 text-[20px] font-extrabold uppercase">Delivery Address</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1.6fr_auto] md:items-start">
                                <div className="text-[18px] font-semibold leading-tight">
                                    <p>{address.fullName || "—"}</p>
                                    <p className="mt-1">{address.phone || "—"}</p>
                                </div>
                                <div className="text-[18px] font-semibold leading-tight">
                                    {address.addressLine || <span className="italic text-pink-300">No address set</span>}
                                </div>
                                <div className="md:justify-self-end">
                                    <ChangeButton onClick={() => { setDraftAddress(address); setShowAddressModal(true); }} />
                                </div>
                            </div>
                        </div>

                        {/* ── Products Ordered ── */}
                        <div className="border-t-[3px] border-[#e4b8c2] py-5">
                            <div className="mb-5 grid grid-cols-[2fr_1fr_1fr_1fr] gap-3">
                                {["Product Ordered", "Unit Price", "Quantity", "Item Subtotal"].map((h) => (
                                    <h2 key={h} className="text-center text-[16px] font-extrabold uppercase first:text-left md:text-[20px]">{h}</h2>
                                ))}
                            </div>
                            <div className="space-y-5">
                                {checkoutItems.map((item) => (
                                    <div key={item.cart_item_id} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className="overflow-hidden rounded-[6px] border-[4px] border-[#e7748f]">
                                                <Image
                                                    src={`/images/${item.product_image || "product1"}.png`}
                                                    alt={item.product_name}
                                                    width={110} height={110}
                                                    className="h-[110px] w-[110px] object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="max-w-[180px] text-[18px] font-bold leading-tight md:text-[22px]">{item.product_name}</p>
                                                {item.color && <p className="mt-1 text-[14px] font-semibold capitalize text-pink-400">{item.color}</p>}
                                                {item.size && <p className="text-[14px] font-semibold capitalize text-pink-400">{item.size}</p>}
                                            </div>
                                        </div>
                                        <p className="text-center text-[28px] font-bold md:text-[38px]">₱{item.price.toFixed(2)}</p>
                                        <p className="text-center text-[28px] font-bold md:text-[38px]">{item.quantity}</p>
                                        <p className="text-center text-[28px] font-bold md:text-[38px]">₱{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Payment Method ── */}
                        <div className="border-t-[3px] border-[#e4b8c2] py-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                                <h2 className="text-[20px] font-extrabold uppercase">Payment Method</h2>
                                <p className="text-[18px] font-bold md:text-[20px]">{paymentMethod}</p>
                                <div className="md:justify-self-end">
                                    <ChangeButton onClick={() => setShowPaymentModal(true)} />
                                </div>
                            </div>
                        </div>

                        {/* ── Shipping Option ── */}
                        <div className="border-y-[3px] border-[#e4b8c2] py-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.3fr_auto_auto] md:items-center">
                                <h2 className="text-[20px] font-extrabold uppercase">Shipping Option</h2>
                                <div>
                                    <p className="text-[18px] font-bold md:text-[20px]">{shipping.label}</p>
                                    <p className="text-[16px] italic text-[#64865b] md:text-[18px]">{shipping.note}</p>
                                </div>
                                <p className="text-[20px] font-bold">₱{shipping.fee.toFixed(2)}</p>
                                <div className="md:justify-self-end">
                                    <ChangeButton onClick={() => router.push("/shipping-method")} />
                                </div>
                            </div>
                        </div>

                        {/* ── Order total summary ── */}
                        <div className="mt-7 flex justify-end">
                            <div className="w-full max-w-[320px]">
                                <div className="mb-1 flex items-center justify-between text-[18px] font-semibold">
                                    <span>Merchandise Subtotal</span>
                                    <span>₱{itemSubtotal.toFixed(2)}</span>
                                </div>
                                <div className="mb-1 flex items-center justify-between text-[18px] font-semibold">
                                    <span>Shipping Subtotal</span>
                                    <span>₱{shipping.fee.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-[22px] font-extrabold">
                                    <span>Total Payment:</span>
                                    <span className="text-[38px] leading-none">₱{totalPayment.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Error message ── */}
                        {orderError && (
                            <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 p-3 text-center text-sm font-semibold text-red-500">
                                ⚠️ {orderError}
                            </div>
                        )}

                        {/* ── Place order button ── */}
                        <div className="mt-7 flex flex-col items-end gap-4">
                            <button type="button" onClick={handlePlaceOrder} disabled={placing}
                                className="rounded-full bg-[#c93b57] px-8 py-3 text-[28px] font-extrabold leading-none text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:text-[32px]">
                                {placing ? "Placing order..." : "place order"}
                            </button>
                            <p className="max-w-[360px] text-right text-[16px] italic leading-tight text-[#64865b] md:text-[18px]">
                                Each product is carefully handmade. Please allow 5–7 business days (1 creation week) for production before shipping.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* ── Address modal ── */}
            {showAddressModal && (
                <SectionModal title="Change Delivery Address" onClose={() => setShowAddressModal(false)}>
                    <div className="space-y-4">
                        {[
                            { label: "Full Name", key: "fullName" as const, type: "text" },
                            { label: "Phone", key: "phone" as const, type: "text" },
                        ].map(({ label, key, type }) => (
                            <div key={key}>
                                <label className="mb-1 block text-sm font-bold text-[#c93b57]">{label}</label>
                                <input type={type} value={draftAddress[key]}
                                    onChange={(e) => setDraftAddress((prev) => ({ ...prev, [key]: e.target.value }))}
                                    className="w-full rounded-full border-2 border-[#e4b8c2] px-4 py-2 outline-none focus:border-[#c93b57]"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#c93b57]">Address</label>
                            <textarea value={draftAddress.addressLine}
                                onChange={(e) => setDraftAddress((prev) => ({ ...prev, addressLine: e.target.value }))}
                                rows={4}
                                className="w-full rounded-[18px] border-2 border-[#e4b8c2] px-4 py-3 outline-none focus:border-[#c93b57]"
                            />
                        </div>
                        <button type="button"
                            onClick={() => { setAddress(draftAddress); setShowAddressModal(false); }}
                            className="rounded-full bg-[#c93b57] px-6 py-2 text-lg font-bold text-white hover:opacity-90 transition-opacity">
                            save address
                        </button>
                    </div>
                </SectionModal>
            )}

            {/* ── Payment method modal ── */}
            {showPaymentModal && (
                <SectionModal title="Choose Payment Method" onClose={() => setShowPaymentModal(false)}>
                    <div className="space-y-3">
                        {(["Cash On Delivery", "GCash", "Maya"] as PaymentMethod[]).map((method) => (
                            <button key={method} type="button"
                                onClick={() => { setPaymentMethod(method); setShowPaymentModal(false); }}
                                className={`block w-full rounded-[18px] border-2 px-4 py-3 text-left text-lg font-bold transition-colors ${paymentMethod === method
                                        ? "border-[#c93b57] bg-[#fbe8ee] text-[#c93b57]"
                                        : "border-[#e4b8c2] bg-white text-[#c93b57] hover:border-[#c93b57]"
                                    }`}>
                                {method}
                            </button>
                        ))}
                    </div>
                </SectionModal>
            )}
        </main>
    );
}