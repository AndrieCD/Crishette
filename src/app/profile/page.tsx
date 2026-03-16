// src/app/profile/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, logout, updateProfile } from "@/lib/auth";
import { getUserOrders, cancelOrder } from "@/lib/orders";
import { getUserLikes } from "@/lib/likes";
import { submitReview, getUserReview } from "@/lib/products";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import type { CrishetteUser, Order, Like } from "@/lib/types";

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button"
                    onClick={() => onChange(star === value ? 0 : star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className={`text-xl transition-colors ${star <= (hovered || value) ? "text-[#C0395A]" : "text-pink-200"}`}>
                    ★
                </button>
            ))}
        </div>
    );
}

function RatingWidget({ userId, productId, productName }: {
    userId: string; productId: string; productName: string;
}) {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getUserReview(userId, productId).then((existing) => {
            if (existing !== null) { setRating(existing); setSubmitted(true); }
            setLoaded(true);
        });
    }, [userId, productId]);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSaving(true);
        const result = await submitReview(userId, productId, rating);
        setSaving(false);
        if (result.success) setSubmitted(true);
    };

    if (!loaded) return <div className="h-6 w-24 animate-pulse rounded-full bg-pink-100" />;

    return (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
            <StarInput value={rating} onChange={(v) => { setRating(v); setSubmitted(false); }} />
            {!submitted ? (
                <button type="button" onClick={handleSubmit} disabled={saving || rating === 0}
                    className="rounded-full bg-[#C0395A] px-3 py-1 text-[11px] font-bold text-white disabled:opacity-40 hover:opacity-90 transition-opacity font-['Fredoka']">
                    {saving ? "Saving..." : "Rate"}
                </button>
            ) : (
                <span className="text-[11px] font-semibold text-green-500 font-['Fredoka']">✓ Rated!</span>
            )}
        </div>
    );
}

function ProfilePictureCard({ avatarSrc, onImageChange }: {
    avatarSrc: string; onImageChange: (src: string) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => onImageChange(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="bg-pink-100 border-2 border-dashed border-pink-300 rounded-2xl p-5 flex flex-col items-center gap-3 w-full max-w-[200px]">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                {avatarSrc ? (
                    <img src={avatarSrc} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-pink-200 flex items-center justify-center text-4xl">🐥</div>
                )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold text-sm rounded-full py-1.5 hover:bg-pink-50 transition-colors">
                Select Image
            </button>
            <p className="text-[10px] text-center text-pink-400 font-['Fredoka']">Hit "save" below to apply</p>
        </div>
    );
}

function MyProfileTab({ user, onSaved }: { user: CrishetteUser; onSaved: (u: CrishetteUser) => void }) {
    const [username, setUsername] = useState(user.username);
    const [phone, setPhone] = useState(user.phone ?? "");
    const [gender, setGender] = useState<"Male" | "Female" | "Other">(user.gender ?? "Other");
    const [avatarSrc, setAvatarSrc] = useState(user.avatar_url ?? "");
    const [editing, setEditing] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    const fieldClass = (field: string) =>
        `flex-1 rounded-lg border-2 px-3 py-1.5 text-sm font-['Fredoka'] text-[#4B2E39] outline-none transition ${editing === field
            ? "border-[#C0395A] bg-white focus:ring-2 focus:ring-pink-300"
            : "border-pink-200 bg-pink-50 cursor-default"}`;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaveMsg("");
        const result = await updateProfile(user.id, { username, phone, gender, avatar_url: avatarSrc || undefined });
        setSaving(false);
        setEditing(null);
        if (result.success && result.user) {
            onSaved(result.user);
            setSaveMsg("Profile saved! 🌸");
            setTimeout(() => setSaveMsg(""), 3000);
        } else {
            setSaveMsg("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5 flex-1">
            <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">My Profile</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex gap-6 items-start">
                    <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-3">
                            <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} readOnly={editing !== "username"} className={fieldClass("username")} />
                            <button type="button" onClick={() => setEditing(editing === "username" ? null : "username")} className="text-[#C0395A] font-['Fredoka'] text-xs font-semibold hover:underline whitespace-nowrap">
                                {editing === "username" ? "done" : "change?"}
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">Email</label>
                            <input type="email" value={user.email} readOnly className="flex-1 rounded-lg border-2 border-pink-200 bg-pink-50 px-3 py-1.5 text-sm font-['Fredoka'] text-[#4B2E39] cursor-default outline-none" />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">Phone Number</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} readOnly={editing !== "phone"} placeholder="e.g. 09123456789" className={fieldClass("phone")} />
                            <button type="button" onClick={() => setEditing(editing === "phone" ? null : "phone")} className="text-[#C0395A] font-['Fredoka'] text-xs font-semibold hover:underline whitespace-nowrap">
                                {editing === "phone" ? "done" : "change?"}
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">Gender</label>
                            <div className="flex gap-4">
                                {(["Male", "Female", "Other"] as const).map((g) => (
                                    <label key={g} className="flex items-center gap-1 cursor-pointer font-['Fredoka'] text-sm text-[#4B2E39]">
                                        <input type="radio" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)} className="accent-[#C0395A]" />
                                        {g}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <ProfilePictureCard avatarSrc={avatarSrc} onImageChange={setAvatarSrc} />
                </div>
                {saveMsg && <p className="text-sm font-semibold text-[#C0395A] font-['Fredoka'] text-center">{saveMsg}</p>}
                <div className="flex justify-end mt-2">
                    <button type="submit" disabled={saving}
                        className="bg-[#C0395A] text-white font-['Fredoka'] font-bold rounded-full px-8 py-2 text-sm hover:bg-[#a02845] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                        {saving ? "Saving..." : "save"}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── Status badge — includes "In Transit" ──────────────────────
function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        Completed: "bg-green-100 text-green-600",
        Cancelled: "bg-red-100 text-red-500",
        "In Transit": "bg-blue-100 text-blue-600",
        Processing: "bg-yellow-100 text-yellow-600",
        Pending: "bg-pink-100 text-[#C0395A]",
    };
    return (
        <span className={`rounded-full px-3 py-0.5 text-xs font-bold font-['Fredoka'] ${colors[status] ?? "bg-pink-100 text-[#C0395A]"}`}>
            {status}
        </span>
    );
}

// ── Cancel confirmation dialog ─────────────────────────────────
function CancelConfirmDialog({ onConfirm, onCancel, cancelling }: {
    onConfirm: () => void; onCancel: () => void; cancelling: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-3xl bg-[#FFF0F6] p-6 shadow-2xl flex flex-col gap-4 text-center">
                <p className="text-4xl">🗑️</p>
                <h3 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">Cancel this order?</h3>
                <p className="font-['Fredoka'] text-sm text-[#4B2E39]">
                    This can only be done while the order is still <strong>Pending</strong>. Once cancelled, it cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button type="button" onClick={onCancel} disabled={cancelling}
                        className="flex-1 border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-pink-50 transition-colors disabled:opacity-50">
                        Keep order
                    </button>
                    <button type="button" onClick={onConfirm} disabled={cancelling}
                        className="flex-1 bg-[#C0395A] text-white font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-[#a02845] transition-colors disabled:opacity-50">
                        {cancelling ? "Cancelling..." : "Yes, cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── My Purchases tab ───────────────────────────────────────────
function MyPurchasesTab({ userId }: { userId: string }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        getUserOrders(userId).then((data) => { setOrders(data); setLoading(false); });
    }, [userId]);

    const handleCancelConfirm = async () => {
        if (!cancellingOrderId) return;
        setCancelling(true);
        const result = await cancelOrder(cancellingOrderId, userId);
        setCancelling(false);
        if (result.success) {
            // Optimistic update — flip status in local state immediately
            setOrders((prev) =>
                prev.map((o) => o.id === cancellingOrderId ? { ...o, status: "Cancelled" } : o)
            );
        }
        setCancellingOrderId(null);
    };

    if (loading) return <div className="py-8 text-center font-['Fredoka'] text-[#C0395A]">Loading purchases...</div>;

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center py-10 gap-2">
                <p className="text-4xl">🛍️</p>
                <p className="font-['Fredoka'] font-semibold text-[#4B2E39]">No purchases yet</p>
                <Link href="/product-catalog" className="mt-2 rounded-full bg-[#C0395A] px-6 py-2 text-sm font-bold text-white font-['Fredoka'] hover:opacity-90 transition-opacity">
                    Start shopping
                </Link>
            </div>
        );
    }

    return (
        <>
            {cancellingOrderId && (
                <CancelConfirmDialog
                    onConfirm={handleCancelConfirm}
                    onCancel={() => setCancellingOrderId(null)}
                    cancelling={cancelling}
                />
            )}

            <div className="flex flex-col gap-4">
                <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">My Purchases</h2>
                {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl border-2 border-pink-100 bg-white p-4 shadow-sm">

                        {/* Order header */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-['Fredoka'] text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleDateString("en-PH", {
                                    year: "numeric", month: "long", day: "numeric",
                                })}
                            </span>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={order.status} />
                                {/* Cancel button — only visible while Pending */}
                                {order.status === "Pending" && (
                                    <button type="button"
                                        onClick={() => setCancellingOrderId(order.id)}
                                        className="rounded-full border-2 border-red-200 bg-red-50 px-3 py-0.5 text-[11px] font-bold text-red-500 hover:bg-red-100 transition-colors font-['Fredoka']">
                                        Cancel order
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Items */}
                        {order.order_items?.map((item) => (
                            <div key={item.id} className="border-t border-pink-50 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-pink-200">
                                        <Image src={`/images/${item.product_image || "product1"}.png`}
                                            alt={item.product_name} width={64} height={64}
                                            className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-['Fredoka'] font-semibold text-sm text-[#4B2E39]">{item.product_name}</p>
                                        <p className="font-['Fredoka'] text-xs text-[#C0395A]">
                                            {item.quantity}x · ₱{item.price_at_purchase.toFixed(2)}
                                            {item.color && ` · ${item.color}`}
                                            {item.size && ` · ${item.size}`}
                                        </p>
                                        {order.status === "Completed" && (
                                            <div className="mt-1">
                                                <p className="text-[10px] text-pink-400 font-['Fredoka'] mb-1">Rate this item:</p>
                                                <RatingWidget userId={userId} productId={item.product_id} productName={item.product_name} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-['Fredoka'] font-bold text-sm text-[#C0395A] shrink-0">
                                        ₱{(item.price_at_purchase * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="mt-2 flex justify-between border-t border-pink-100 pt-3">
                            <span className="font-['Fredoka'] text-sm font-semibold text-[#4B2E39]">Total</span>
                            <span className="font-['Fredoka'] text-sm font-bold text-[#C0395A]">₱{order.total_price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function MyLikesTab({ userId }: { userId: string }) {
    const [likes, setLikes] = useState<Like[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserLikes(userId).then((data) => { setLikes(data); setLoading(false); });
    }, [userId]);

    if (loading) return <div className="py-8 text-center font-['Fredoka'] text-[#C0395A]">Loading likes...</div>;

    if (likes.length === 0) {
        return (
            <div className="flex flex-col items-center py-10 gap-2">
                <p className="text-4xl">🩷</p>
                <p className="font-['Fredoka'] font-semibold text-[#4B2E39]">No liked items yet</p>
                <Link href="/product-catalog" className="mt-2 rounded-full bg-[#C0395A] px-6 py-2 text-sm font-bold text-white font-['Fredoka'] hover:opacity-90 transition-opacity">
                    Browse products
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">My Likes</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {likes.map((like) => (
                    <Link key={like.id} href={`/product/${like.product_id}`}
                        className="group overflow-hidden rounded-2xl border-2 border-pink-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-square w-full overflow-hidden">
                            <Image src={`/images/${like.product?.image || "product1"}.png`} alt={like.product?.name ?? "Product"} fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                        </div>
                        <div className="p-2 text-center">
                            <p className="font-['Fredoka'] text-sm font-semibold text-[#4B2E39] line-clamp-1">{like.product?.name}</p>
                            <p className="font-['Fredoka'] text-sm font-bold text-[#C0395A]">₱{like.product?.price?.toFixed(2)}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<CrishetteUser | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "purchases" | "likes">("profile");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = getSession();
        if (!session) { router.push("/login"); return; }
        setUser(session);
        setLoading(false);
    }, [router]);

    const handleLogout = () => { logout(); router.push("/login"); router.refresh(); };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-[#C0395A] font-['Fredoka']">
            <HeroBanner />
            <Navbar />
            <div className="px-4 pb-10 pt-4 md:px-8">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#FFF0F6] shadow-lg">
                    <div className="flex gap-0 p-6">
                        <aside className="w-52 shrink-0 flex flex-col gap-3 pr-4">
                            <div className="flex items-center gap-3 px-1 mb-1">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-pink-200 flex items-center justify-center text-xl">🐥</div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-['Fredoka'] font-semibold text-[#4B2E39] text-sm leading-tight">{user.username}</p>
                                    <button onClick={() => setActiveTab("profile")} className="font-['Fredoka'] text-xs text-[#C0395A] hover:underline">edit profile</button>
                                </div>
                            </div>
                            {([
                                { tab: "purchases" as const, label: "My purchases", icon: "🛍️" },
                                { tab: "likes" as const, label: "My Likes", icon: "🩷" },
                            ]).map(({ tab, label, icon }) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl font-['Fredoka'] font-semibold text-sm transition-colors ${activeTab === tab ? "bg-white text-[#C0395A] shadow-sm" : "bg-pink-100 text-[#4B2E39] hover:bg-white"}`}>
                                    {icon} {label}
                                </button>
                            ))}
                            <button onClick={handleLogout} className="mt-4 w-full text-left px-4 py-2 rounded-xl font-['Fredoka'] text-sm font-semibold text-gray-400 hover:text-[#C0395A] hover:bg-pink-50 transition-colors">
                                🚪 Log out
                            </button>
                        </aside>
                        <div className="flex-1 min-w-0">
                            {activeTab === "profile" && <MyProfileTab user={user} onSaved={setUser} />}
                            {activeTab === "purchases" && <MyPurchasesTab userId={user.id} />}
                            {activeTab === "likes" && <MyLikesTab userId={user.id} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}