// src/app/profile/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, logout, updateProfile } from "@/lib/auth";
import { getUserOrders } from "@/lib/orders";
import { getUserLikes } from "@/lib/likes";
import Navbar from "@/app/Navbar";
import type { CrishetteUser, Order, Like } from "@/lib/types";

// ── Yarn background ────────────────────────────────────────────
function YarnBackground() {
    return (
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
                <svg key={i} className="absolute" style={{ top: `${i * 13}%`, left: "-10%", width: "120%" }} viewBox="0 0 500 40" preserveAspectRatio="none">
                    <path d={`M0,20 C30,${5 + i * 2} 60,${35 - i * 2} 100,20 C140,${5 + i} 170,${35 - i} 200,20 C240,${5 + i * 2} 270,${35 - i * 2} 300,20 C340,${5 + i} 370,${35 - i} 400,20 C430,${5 + i * 2} 460,${35 - i * 2} 500,20`}
                        stroke="#A02845" strokeWidth="2.5" fill="none" />
                </svg>
            ))}
        </div>
    );
}

// ── Scallop border at bottom of the white content card ────────
function ScallopBottom() {
    return (
        <div className="w-full overflow-hidden leading-none">
            <svg viewBox="0 0 800 28" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                <path d="M0,0 C20,0 20,24 40,24 C60,24 60,0 80,0 C100,0 100,24 120,24 C140,24 140,0 160,0 C180,0 180,24 200,24 C220,24 220,0 240,0 C260,0 260,24 280,24 C300,24 300,0 320,0 C340,0 340,24 360,24 C380,24 380,0 400,0 C420,0 420,24 440,24 C460,24 460,0 480,0 C500,0 500,24 520,24 C540,24 540,0 560,0 C580,0 580,24 600,24 C620,24 620,0 640,0 C660,0 660,24 680,24 C700,24 700,0 720,0 C740,0 740,24 760,24 C780,24 780,0 800,0 L800,28 L0,28 Z"
                    fill="#C0395A" />
            </svg>
        </div>
    );
}

// ── Profile Picture Card ───────────────────────────────────────
function ProfilePictureCard({ avatarSrc, onImageChange, onRemove, onSave }: {
    avatarSrc: string; onImageChange: (src: string) => void; onRemove: () => void; onSave: () => void;
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
            <div className="flex gap-2 w-full">
                <button type="button" onClick={onRemove}
                    className="flex-1 bg-white border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold text-xs rounded-full py-1.5 hover:bg-pink-50 transition-colors">
                    Remove
                </button>
                <button type="button" onClick={onSave}
                    className="flex-1 bg-[#C0395A] text-white font-['Fredoka'] font-semibold text-xs rounded-full py-1.5 hover:bg-[#a02845] transition-colors">
                    Save
                </button>
            </div>
        </div>
    );
}

// ── My Profile tab ─────────────────────────────────────────────
function MyProfileTab({ user, onSaved }: { user: CrishetteUser; onSaved: (updated: CrishetteUser) => void }) {
    const [username, setUsername] = useState(user.username);
    const [phone, setPhone] = useState(user.phone ?? "");
    const [gender, setGender] = useState<"Male" | "Female" | "Other">(user.gender ?? "Other");
    const [avatarSrc, setAvatarSrc] = useState(user.avatar_url ?? "");
    const [editing, setEditing] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    const fieldClass = (field: string) =>
        `flex-1 rounded-lg border-2 px-3 py-1.5 text-sm font-['Fredoka'] text-[#4B2E39] outline-none transition ${editing === field ? "border-[#C0395A] bg-white focus:ring-2 focus:ring-pink-300" : "border-pink-200 bg-pink-50 cursor-default"
        }`;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // ✅ Calls updateProfile() from auth.ts → updates users table in Supabase
        const result = await updateProfile(user.id, {
            username, phone, gender,
            avatar_url: avatarSrc || undefined,
        });
        setSaving(false);
        setEditing(null);
        if (result.success && result.user) {
            onSaved(result.user);
            setSaveMsg("Profile saved! 🌸");
            setTimeout(() => setSaveMsg(""), 3000);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5 flex-1">
            <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">My Profile</h2>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex gap-6 items-start">
                    <div className="flex flex-col gap-3 flex-1">

                        {/* Username */}
                        <div className="flex items-center gap-3">
                            <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                readOnly={editing !== "username"} className={fieldClass("username")} />
                            <button type="button" onClick={() => setEditing(editing === "username" ? null : "username")}
                                className="text-[#C0395A] font-['Fredoka'] text-xs font-semibold hover:underline whitespace-nowrap">
                                {editing === "username" ? "done" : "change?"}
                            </button>
                        </div>

                        {/* Email (read-only — changing email is complex, skip for school project) */}
                        <div className="flex items-center gap-3">
                            <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">Email</label>
                            <input type="email" value={user.email} readOnly
                                className="flex-1 rounded-lg border-2 border-pink-200 bg-pink-50 px-3 py-1.5 text-sm font-['Fredoka'] text-[#4B2E39] cursor-default outline-none" />
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3">
                            <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">Phone Number</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                readOnly={editing !== "phone"} placeholder="e.g. 09123456789" className={fieldClass("phone")} />
                            <button type="button" onClick={() => setEditing(editing === "phone" ? null : "phone")}
                                className="text-[#C0395A] font-['Fredoka'] text-xs font-semibold hover:underline whitespace-nowrap">
                                {editing === "phone" ? "done" : "change?"}
                            </button>
                        </div>

                        {/* Gender */}
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

                    {/* Profile picture */}
                    <ProfilePictureCard
                        avatarSrc={avatarSrc}
                        onImageChange={setAvatarSrc}
                        onRemove={() => setAvatarSrc("")}
                        onSave={() => {/* handled by the main save button */ }}
                    />
                </div>

                {saveMsg && <p className="text-sm font-semibold text-[#C0395A] font-['Fredoka'] text-center">{saveMsg}</p>}

                <div className="flex justify-end mt-2">
                    <button type="submit" disabled={saving}
                        className="bg-[#C0395A] text-white font-['Fredoka'] font-bold rounded-full px-8 py-2 text-sm hover:bg-[#a02845] transition-colors shadow-md disabled:opacity-50">
                        {saving ? "Saving..." : "save"}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── My Purchases tab ───────────────────────────────────────────
function MyPurchasesTab({ userId }: { userId: string }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserOrders(userId).then((data) => {
            setOrders(data);
            setLoading(false);
        });
    }, [userId]);

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
        <div className="flex flex-col gap-4">
            <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">My Purchases</h2>
            {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border-2 border-pink-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-['Fredoka'] text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                        <span className={`rounded-full px-3 py-0.5 text-xs font-bold font-['Fredoka'] ${order.status === "Completed" ? "bg-green-100 text-green-600" :
                                order.status === "Cancelled" ? "bg-red-100 text-red-500" :
                                    "bg-pink-100 text-[#C0395A]"
                            }`}>
                            {order.status}
                        </span>
                    </div>

                    {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 border-t border-pink-50 py-2">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-pink-200">
                                <Image
                                    src={`/images/${item.product_image || "product1"}.png`}
                                    alt={item.product_name} width={64} height={64}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="font-['Fredoka'] font-semibold text-sm text-[#4B2E39]">{item.product_name}</p>
                                <p className="font-['Fredoka'] text-xs text-[#C0395A]">
                                    {item.quantity}x · ₱{item.price_at_purchase.toFixed(2)}
                                    {item.color && ` · ${item.color}`}
                                    {item.size && ` · ${item.size}`}
                                </p>
                            </div>
                            <p className="font-['Fredoka'] font-bold text-sm text-[#C0395A]">
                                ₱{(item.price_at_purchase * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}

                    <div className="mt-3 flex justify-between border-t border-pink-100 pt-3">
                        <span className="font-['Fredoka'] text-sm font-semibold text-[#4B2E39]">Total</span>
                        <span className="font-['Fredoka'] text-sm font-bold text-[#C0395A]">₱{order.total_price.toFixed(2)}</span>
                    </div>

                    {order.status === "Completed" && (
                        <div className="mt-2 flex justify-end">
                            <Link href="/product-catalog"
                                className="rounded-full border-2 border-[#C0395A] px-4 py-1 text-xs font-bold text-[#C0395A] font-['Fredoka'] hover:bg-pink-50 transition-colors">
                                buy again
                            </Link>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ── My Likes tab ───────────────────────────────────────────────
function MyLikesTab({ userId }: { userId: string }) {
    const [likes, setLikes] = useState<Like[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserLikes(userId).then((data) => {
            setLikes(data);
            setLoading(false);
        });
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
                            <Image
                                src={`/images/${like.product?.image || "product1"}.png`}
                                alt={like.product?.name ?? "Product"} fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />
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

// ── Main Profile Page ──────────────────────────────────────────
export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<CrishetteUser | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "purchases" | "likes">("profile");
    const [loading, setLoading] = useState(true);

    // ── Auth guard ─────────────────────────────────────────────
    useEffect(() => {
        const session = getSession();
        if (!session) { router.push("/login"); return; }
        setUser(session);
        setLoading(false);
    }, []);

    const handleLogout = () => {
        logout(); // clears localStorage session
        router.push("/login");
        router.refresh();
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-[#C0395A] font-['Fredoka']">
            {/* ── Crimson header banner ── */}
            <div className="relative w-full flex flex-col items-center justify-center py-4 overflow-hidden bg-[#C0395A]">
                <YarnBackground />
                <p className="absolute font-['Fredoka'] font-bold text-3xl tracking-widest uppercase select-none pointer-events-none"
                    style={{ color: "rgba(255,255,255,0.18)", letterSpacing: "0.2em" }}>
                    YOUR WISH IS MY CROCHET
                </p>
                <div className="relative z-10">
                    <Image src="/assets/CrishetteLogo.png" alt="Crishette Logo" width={70} height={70} className="drop-shadow-xl" />
                </div>
            </div>

            {/* ── Shared Navbar ── */}
            <Navbar />

            {/* ── Main content ── */}
            <div className="px-4 pb-10 pt-4 md:px-8">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#FFF0F6] shadow-lg">

                    {/* ── Content area ── */}
                    <div className="flex gap-0 p-6">

                        {/* ── Left sidebar ── */}
                        <aside className="w-52 shrink-0 flex flex-col gap-3 pr-4">
                            {/* Avatar + username */}
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
                                    <button onClick={() => setActiveTab("profile")}
                                        className="font-['Fredoka'] text-xs text-[#C0395A] hover:underline">
                                        edit profile
                                    </button>
                                </div>
                            </div>

                            {/* Nav buttons */}
                            {([
                                { tab: "purchases" as const, label: "My purchases", icon: "🛍️" },
                                { tab: "likes" as const, label: "My Likes", icon: "🩷" },
                            ]).map(({ tab, label, icon }) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl font-['Fredoka'] font-semibold text-sm transition-colors ${activeTab === tab ? "bg-white text-[#C0395A] shadow-sm" : "bg-pink-100 text-[#4B2E39] hover:bg-white"
                                        }`}>
                                    {icon} {label}
                                </button>
                            ))}

                            {/* Logout */}
                            <button onClick={handleLogout}
                                className="mt-4 w-full text-left px-4 py-2 rounded-xl font-['Fredoka'] text-sm font-semibold text-gray-400 hover:text-[#C0395A] hover:bg-pink-50 transition-colors">
                                🚪 Log out
                            </button>
                        </aside>

                        {/* ── Right panel ── */}
                        <div className="flex-1 min-w-0">
                            {activeTab === "profile" && (
                                <MyProfileTab user={user} onSaved={(updated) => setUser(updated)} />
                            )}
                            {activeTab === "purchases" && <MyPurchasesTab userId={user.id} />}
                            {activeTab === "likes" && <MyLikesTab userId={user.id} />}
                        </div>
                    </div>

                    <ScallopBottom />
                </div>
            </div>
        </div>
    );
}