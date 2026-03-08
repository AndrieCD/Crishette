"use client";
// src/app/login/page.tsx
// Login & Register page — matches Section 1 Figma (Security & User Access)
// 'use client' is needed here because we use useState to toggle between
// Login and Register views, and handle form input changes.
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Scallop bottom border (used on register card) ─────────────────────────────
function ScallopBottom() {
  return (
    <div className="w-full overflow-hidden leading-none mt-auto">
      <svg
        viewBox="0 0 400 28"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 
             C10,0 10,24 20,24 C30,24 30,0 40,0 
             C50,0 50,24 60,24 C70,24 70,0 80,0 
             C90,0 90,24 100,24 C110,24 110,0 120,0 
             C130,0 130,24 140,24 C150,24 150,0 160,0 
             C170,0 170,24 180,24 C190,24 190,0 200,0 
             C210,0 210,24 220,24 C230,24 230,0 240,0 
             C250,0 250,24 260,24 C270,24 270,0 280,0 
             C290,0 290,24 300,24 C310,24 310,0 320,0 
             C330,0 330,24 340,24 C350,24 350,0 360,0 
             C370,0 370,24 380,24 C390,24 390,0 400,0 
             L400,28 L0,28 Z"
          fill="#C0395A"
        />
      </svg>
    </div>
  );
}

// ── Wavy yarn background pattern ─────────────────────────────────────────────
function YarnBackground() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
      {/* Decorative wavy lines mimicking the yarn texture in the Figma */}
      {[...Array(8)].map((_, i) => (
        <svg
          key={i}
          className="absolute"
          style={{ top: `${i * 13}%`, left: "-10%", width: "120%" }}
          viewBox="0 0 500 40"
          preserveAspectRatio="none"
        >
          <path
            d={`M0,20 C30,${5 + i * 2} 60,${35 - i * 2} 100,20 C140,${5 + i} 170,${35 - i} 200,20 C240,${5 + i * 2} 270,${35 - i * 2} 300,20 C340,${5 + i} 370,${35 - i} 400,20 C430,${5 + i * 2} 460,${35 - i * 2} 500,20`}
            stroke="#A02845"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}

// ── Social button component ───────────────────────────────────────────────────
function SocialButton({
  provider,
  action,
}: {
  provider: "Facebook" | "Google";
  action: "Sign in" | "Sign up";
}) {
  const icon =
    provider === "Facebook" ? (
      // Facebook F icon
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ) : (
      // Google G icon
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    );

  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2 border-2 border-[#C0395A] text-[#C0395A] bg-transparent rounded-full py-2 px-4 font-semibold text-sm hover:bg-pink-50 transition-colors font-['Fredoka']"
    >
      {icon}
      {action} with {provider}
    </button>
  );
}

// ── Toggle switch component ───────────────────────────────────────────────────
function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#C0395A]" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm text-[#4B2E39] font-['Fredoka']">{label}</span>
    </label>
  );
}

// ── REGISTER PANEL ────────────────────────────────────────────────────────────
function RegisterPanel({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setEmailError(true);
      return;
    }

    if (!username || !password || !confirm) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    setEmailError(false);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Sign up successful. Check your email for verification.");
    console.log("Register success:", data);
  };

  return (
    // Full-page crimson background with yarn texture
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-10 overflow-hidden"
      style={{ backgroundColor: "#C0395A" }}
    >
      <YarnBackground />

      {/* White card with scallop bottom */}
      <div className="relative z-10 w-full max-w-sm bg-[#FFF0F6] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Card top: logo + heading */}
        <div className="flex flex-col items-center pt-8 pb-4 px-8">
          <Image
            src="/assets/CrishetteLogo.png"
            alt="Crishette Logo"
            width={72}
            height={72}
            className="drop-shadow-md"
          />
          <h1 className="font-['Fredoka'] font-bold text-2xl text-white mt-1 tracking-wide drop-shadow"
            style={{ WebkitTextStroke: "1px #C0395A", color: "white" }}
          >
            WELCOMES YOU!
          </h1>
          {/* The heading color in Figma is white with a pink outline */}
          <p className="text-center text-sm text-[#4B2E39] mt-2 font-['Fredoka']">
            Log in to continue your cozy shopping experience and
            manage your handmade creations securely.
          </p>
        </div>

        {/* Form area */}
        <div className="px-8 pb-6 flex flex-col gap-3">
          <p className="text-center text-sm font-semibold text-[#4B2E39] font-['Fredoka']">
            Register with
          </p>

          <SocialButton provider="Facebook" action="Sign up" />
          <SocialButton provider="Google" action="Sign up" />

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-pink-300" />
            <span className="text-xs text-[#C0395A] font-['Fredoka']">or</span>
            <div className="flex-1 h-px bg-pink-300" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                className={`w-full rounded-full border-2 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition ${
                  emailError ? "border-red-400" : "border-pink-200"
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1 ml-3 font-['Fredoka']">
                  Invalid email
                </p>
              )}
            </div>

            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
            />

            <ToggleSwitch
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              label="Remember me"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C0395A] text-white font-bold rounded-full py-2.5 text-base hover:bg-[#a02845] transition-colors font-['Fredoka'] shadow-md mt-1 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm text-[#4B2E39] font-['Fredoka']">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="font-bold text-[#C0395A] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Scallop bottom */}
        <ScallopBottom />
      </div>
    </div>
  );
}

// ── LOGIN PANEL ───────────────────────────────────────────────────────────────
function LoginPanel({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }

      setError("");
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setError(error.message);
        return;
      }

      console.log("Login success:", data);
      alert("Login successful!");
    };
  return (
    // Two-column layout: left = soft pink form, right = crimson branding
    <div className="min-h-screen w-full flex">

      {/* ── Left: form side (soft pink) ─────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-center px-10 py-12"
        style={{ backgroundColor: "#FFF0F6" }}
      >
        {/* Curved right edge — mimics the Figma wave cutout */}
        <div className="max-w-sm w-full mx-auto flex flex-col gap-4">
          <div>
            <h1 className="font-['Fredoka'] font-bold text-2xl text-[#C0395A]">
              WELCOME BACK!
            </h1>
            <p className="text-sm text-[#4B2E39] font-['Fredoka']">
              Enter your Email and password to sign in
            </p>
          </div>

          <SocialButton provider="Facebook" action="Sign in" />
          <SocialButton provider="Google" action="Sign in" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
            <div>
              <label className="text-sm font-semibold text-[#C0395A] font-['Fredoka'] mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="lightninggirl2234@yahoo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#C0395A] font-['Fredoka'] mb-1 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full rounded-full border-2 border-pink-200 px-4 py-2 text-sm bg-white outline-none font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-['Fredoka'] ml-1">{error}</p>
            )}

            <ToggleSwitch
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              label="Remember me"
            />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C0395A] text-white font-bold rounded-full py-2.5 text-base hover:bg-[#a02845] transition-colors font-['Fredoka'] shadow-md disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          </form>

          <p className="text-sm text-[#4B2E39] font-['Fredoka']">
            Don&apos;t have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="font-bold text-[#C0395A] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* ── Right: branding side (crimson with yarn + logo) ─────────── */}
      <div
        className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#C0395A" }}
      >
        <YarnBackground />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <Image
            src="/assets/CrishetteLogo.png"
            alt="Crishette Logo"
            width={120}
            height={120}
            className="drop-shadow-xl"
          />
          {/* Big brand wordmark */}
          <div className="text-center">
            <h2
              className="font-['Fredoka'] font-bold text-5xl text-white tracking-wide drop-shadow-lg"
              style={{ WebkitTextStroke: "2px #a02845" }}
            >
              crissh
              <span className="inline-block w-8 h-8 bg-white rounded-full mx-1 align-middle shadow-inner" />
              tte
            </h2>
            <p className="text-pink-200 text-sm font-['Fredoka'] mt-2 italic">
              ✦ your wish is my crochet
            </p>
          </div>
        </div>

        {/* Star sparkles — decorative, matching Figma */}
        <div className="absolute top-1/4 left-1/4 text-pink-200 text-2xl opacity-60 select-none">✦</div>
        <div className="absolute top-1/3 right-1/4 text-pink-300 text-3xl opacity-50 select-none">✦</div>
        <div className="absolute bottom-1/3 left-1/3 text-pink-200 text-xl opacity-40 select-none">✦</div>
      </div>
    </div>
  );
}

// ── Main Page: toggles between Login and Register ─────────────────────────────
export default function LoginPage() {
  const [view, setView] = useState<"login" | "register">("login");

  return view === "login" ? (
    <LoginPanel onSwitchToRegister={() => setView("register")} />
  ) : (
    <RegisterPanel onSwitchToLogin={() => setView("login")} />
  );
}
