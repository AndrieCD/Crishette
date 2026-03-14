// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login, register } from "@/lib/auth";

// ── Scallop bottom border ──────────────────────────────────────
function ScallopBottom() {
    return (
        <div className="w-full overflow-hidden leading-none mt-auto">
            <svg viewBox="0 0 400 28" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                <path
                    d="M0,0 C10,0 10,24 20,24 C30,24 30,0 40,0 C50,0 50,24 60,24 C70,24 70,0 80,0 C90,0 90,24 100,24 C110,24 110,0 120,0 C130,0 130,24 140,24 C150,24 150,0 160,0 C170,0 170,24 180,24 C190,24 190,0 200,0 C210,0 210,24 220,24 C230,24 230,0 240,0 C250,0 250,24 260,24 C270,24 270,0 280,0 C290,0 290,24 300,24 C310,24 310,0 320,0 C330,0 330,24 340,24 C350,24 350,0 360,0 C370,0 370,24 380,24 C390,24 390,0 400,0 L400,28 L0,28 Z"
                    fill="#C0395A"
                />
            </svg>
        </div>
    );
}

// ── Yarn background ────────────────────────────────────────────
function YarnBackground() {
    return (
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
                <svg key={i} className="absolute" style={{ top: `${i * 13}%`, left: "-10%", width: "120%" }} viewBox="0 0 500 40" preserveAspectRatio="none">
                    <path
                        d={`M0,20 C30,${5 + i * 2} 60,${35 - i * 2} 100,20 C140,${5 + i} 170,${35 - i} 200,20 C240,${5 + i * 2} 270,${35 - i * 2} 300,20 C340,${5 + i} 370,${35 - i} 400,20 C430,${5 + i * 2} 460,${35 - i * 2} 500,20`}
                        stroke="#A02845" strokeWidth="2.5" fill="none"
                    />
                </svg>
            ))}
        </div>
    );
}

// ── Toggle switch ──────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <div onClick={onChange} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-[#C0395A]" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            <span className="text-sm text-[#4B2E39] font-['Fredoka']">{label}</span>
        </label>
    );
}

// ── Error message ──────────────────────────────────────────────
function ErrorMsg({ msg }: { msg: string }) {
    if (!msg) return null;
    return <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-red-500 text-xs font-['Fredoka']">{msg}</p>;
}

// ── REGISTER PANEL ─────────────────────────────────────────────
function RegisterPanel({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username || !email || !password || !confirm) {
            setError("Please fill in all fields.");
            return;
        }
        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        // ✅ Calls our custom register() from src/lib/auth.ts
        // This hashes the password and inserts into the users table
        const result = await register(username, email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.error ?? "Registration failed.");
            return;
        }

        // Session is now set in localStorage by register()
        // Redirect to home page
        router.push("/");
        router.refresh();
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-10 overflow-hidden" style={{ backgroundColor: "#C0395A" }}>
            <YarnBackground />

            <div className="relative z-10 w-full max-w-sm bg-[#FFF0F6] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="flex flex-col items-center pt-8 pb-4 px-8">
                    <Image src="/assets/CrishetteLogo.png" alt="Crishette Logo" width={72} height={72} className="drop-shadow-md" />
                    <h1 className="font-['Fredoka'] font-bold text-2xl text-[#C0395A] mt-1 tracking-wide">
                        WELCOMES YOU!
                    </h1>
                    <p className="text-center text-sm text-[#4B2E39] mt-2 font-['Fredoka']">
                        Create your account to start shopping handmade crochets. 🧶
                    </p>
                </div>

                <div className="px-8 pb-6 flex flex-col gap-3">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            type="text" placeholder="Username" value={username}
                            onChange={(e) => { setUsername(e.target.value); setError(""); }}
                            className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
                        />
                        <input
                            type="email" placeholder="Email" value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                            className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
                        />
                        <input
                            type="password" placeholder="Password" value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(""); }}
                            className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
                        />
                        <input
                            type="password" placeholder="Confirm Password" value={confirm}
                            onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                            className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
                        />

                        <ErrorMsg msg={error} />

                        <ToggleSwitch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} label="Remember me" />

                        <button type="submit" disabled={loading}
                            className="w-full bg-[#C0395A] text-white font-bold rounded-full py-2.5 text-base hover:bg-[#a02845] transition-colors font-['Fredoka'] shadow-md mt-1 disabled:opacity-50">
                            {loading ? "Creating account..." : "Sign up"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-[#4B2E39] font-['Fredoka']">
                        Already have an account?{" "}
                        <button onClick={onSwitchToLogin} className="font-bold text-[#C0395A] hover:underline">Sign in</button>
                    </p>
                </div>

                <ScallopBottom />
            </div>
        </div>
    );
}

// ── LOGIN PANEL ────────────────────────────────────────────────
function LoginPanel({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        // ✅ Calls our custom login() from src/lib/auth.ts
        // This fetches user by email, compares bcrypt hash, saves session to localStorage
        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.error ?? "Login failed.");
            return;
        }

        // Admin → go to admin dashboard, regular user → go to home
        if (result.user?.role === "admin") {
            router.push("/admin");
        } else {
            router.push("/");
        }
        router.refresh(); // tells Next.js to re-evaluate the page with the new session
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* ── Left: form ── */}
            <div className="flex-1 flex flex-col justify-center px-10 py-12" style={{ backgroundColor: "#FFF0F6" }}>
                <div className="max-w-sm w-full mx-auto flex flex-col gap-4">
                    <div>
                        <h1 className="font-['Fredoka'] font-bold text-2xl text-[#C0395A]">WELCOME BACK!</h1>
                        <p className="text-sm text-[#4B2E39] font-['Fredoka']">Enter your email and password to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
                        <div>
                            <label className="text-sm font-semibold text-[#C0395A] font-['Fredoka'] mb-1 block">Email</label>
                            <input
                                type="email" placeholder="your@email.com" value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-[#C0395A] font-['Fredoka'] mb-1 block">Password</label>
                            <input
                                type="password" placeholder="••••••••••••••••" value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
                            />
                        </div>

                        <ErrorMsg msg={error} />

                        <ToggleSwitch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} label="Remember me" />

                        <button type="submit" disabled={loading}
                            className="w-full bg-[#C0395A] text-white font-bold rounded-full py-2.5 text-base hover:bg-[#a02845] transition-colors font-['Fredoka'] shadow-md disabled:opacity-50">
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="text-sm text-[#4B2E39] font-['Fredoka']">
                        Don&apos;t have an account?{" "}
                        <button onClick={onSwitchToRegister} className="font-bold text-[#C0395A] hover:underline">Sign up</button>
                    </p>
                </div>
            </div>

            {/* ── Right: branding ── */}
            <div className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden" style={{ backgroundColor: "#C0395A" }}>
                <YarnBackground />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <Image src="/assets/CrishetteLogo.png" alt="Crishette Logo" width={120} height={120} className="drop-shadow-xl" />
                    <div className="text-center">
                        <h2 className="font-['Fredoka'] font-bold text-5xl text-white tracking-wide drop-shadow-lg" style={{ WebkitTextStroke: "2px #a02845" }}>
                            crishette
                        </h2>
                        <p className="text-pink-200 text-sm font-['Fredoka'] mt-2 italic">✦ your wish is my crochet</p>
                    </div>
                </div>
                <div className="absolute top-1/4 left-1/4 text-pink-200 text-2xl opacity-60 select-none">✦</div>
                <div className="absolute top-1/3 right-1/4 text-pink-300 text-3xl opacity-50 select-none">✦</div>
                <div className="absolute bottom-1/3 left-1/3 text-pink-200 text-xl opacity-40 select-none">✦</div>
            </div>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────
export default function LoginPage() {
    const [view, setView] = useState<"login" | "register">("login");

    return view === "login" ? (
        <LoginPanel onSwitchToRegister={() => setView("register")} />
    ) : (
        <RegisterPanel onSwitchToLogin={() => setView("login")} />
    );
}