// src/app/shipping-method/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import { getSession } from "@/lib/auth";

// ── Shipping options (static — no DB table needed for these) ──
// These are fixed business rules, not user data.
const SHIPPING_OPTIONS = [
    {
        id: "standard",
        label: "Standard Shipping",
        note: "Guaranteed to get by 12 Feb",
        eta: "(3–5 business days)",
        fee: 50,
    },
    {
        id: "express",
        label: "Express Shipping",
        note: "Guaranteed to get by 9 Feb",
        eta: "(1–2 business days)",
        fee: 150,
    },
    {
        id: "local",
        label: "Standard Local",
        note: "Guaranteed to get by 14 Feb",
        eta: "(5–7 business days)",
        fee: 30,
    },
];

export default function ShippingMethodPage() {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState("standard");

    // ── Auth guard ─────────────────────────────────────────────
    useEffect(() => {
        if (!getSession()) { router.push("/login"); return; }
        // Guard: if user navigated here directly without going through cart, send back
        if (!sessionStorage.getItem("checkoutItems")) { router.push("/shopping-cart"); return; }

        // Restore previously chosen shipping if user clicks "change" from checkout
        const saved = sessionStorage.getItem("selectedShipping");
        if (saved) {
            try { setSelectedId(JSON.parse(saved).id); } catch { /* ignore */ }
        }
    }, []);

    const handleConfirm = () => {
        const chosen = SHIPPING_OPTIONS.find((o) => o.id === selectedId)!;
        // Save full shipping object so checkout page can display label + fee
        sessionStorage.setItem("selectedShipping", JSON.stringify(chosen));
        router.push("/checkout");
    };

    return (
        <main className="min-h-screen bg-[#c93b57] font-['Fredoka']">
            <HeroBanner />
            <Navbar />

            <div className="px-4 pb-8 pt-4 md:px-8">
                <section className="min-h-[calc(100vh-200px)] rounded-[34px] bg-[#f9f6f7] px-5 pb-8 pt-6 md:px-10 md:pb-10">

                    <div className="pt-2 text-[#c93b57]">
                        <div className="border-t-[3px] border-[#e4b8c2] py-5">
                            <h1 className="text-[28px] font-extrabold uppercase md:text-[34px]">
                                Shipping Option
                            </h1>
                        </div>

                        <div className="border-b-[3px] border-[#e4b8c2] py-4">
                            <div className="space-y-6">
                                {SHIPPING_OPTIONS.map((option) => {
                                    const isSelected = selectedId === option.id;
                                    return (
                                        <div key={option.id}
                                            className="grid grid-cols-1 gap-4 rounded-[22px] border-2 border-[#ecd3d9] bg-white/70 p-4 md:grid-cols-[1.5fr_1.2fr_auto_auto] md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0"
                                        >
                                            <div>
                                                <p className="text-[22px] font-bold text-[#c93b57]">{option.label}</p>
                                                <p className="text-[16px] italic text-[#64865b] md:text-[18px]">{option.note}</p>
                                            </div>
                                            <p className="text-[18px] font-bold text-[#c93b57] md:text-[20px]">{option.eta}</p>
                                            <p className="text-[22px] font-bold text-[#c93b57]">₱{option.fee.toFixed(2)}</p>
                                            <button type="button" onClick={() => setSelectedId(option.id)}
                                                className={`min-w-[140px] rounded-full px-6 py-2 text-[16px] font-bold transition ${isSelected ? "bg-[#e8c7d0] text-[#c93b57]" : "bg-[#c93b57] text-white hover:opacity-90"
                                                    }`}
                                            >
                                                {isSelected ? "selected" : "change"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button type="button" onClick={handleConfirm}
                                className="rounded-full bg-[#c93b57] px-10 py-3 text-[30px] font-extrabold leading-none text-white transition hover:opacity-90 md:text-[34px]">
                                confirm
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}