"use client";
// src/app/profile/page.tsx
// Profile page — matches the Figma screenshot with:
//   - Header banner (crimson + logo + tagline)
//   - Search bar + cart icon (Navbar strip)
//   - Left sidebar: avatar, username, edit profile, My Purchases, My Likes
//   - Right main panel: My Profile form (username, email, phone, gender)
//   - Profile picture upload card (Select Image / Remove / Save)
//   - Bottom Save button
// 'use client' is needed because we use useState for form fields and image upload.

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Wavy yarn background (reused from login page) ────────────────────────────
function YarnBackground() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <svg
          key={i}
          className="absolute"
          style={{ top: `${i * 13}%`, left: "-10%" , width: "120%" }}
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

// ── Cart icon SVG ─────────────────────────────────────────────────────────────
function CartIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

// ── Profile Sidebar ───────────────────────────────────────────────────────────
function ProfileSidebar({
  username,
  avatarSrc,
}: {
  username: string;
  avatarSrc: string;
}) {
  const [activeTab, setActiveTab] = useState<"purchases" | "likes">("purchases");

  return (
    <aside className="w-full max-w-[200px] flex flex-col gap-3 shrink-0">
      {/* Avatar + username */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-pink-200 flex items-center justify-center text-2xl">🐥</div>
          )}
        </div>
        <div>
          <p className="font-['Fredoka'] font-semibold text-[#4B2E39] text-sm leading-tight">{username}</p>
          <button className="font-['Fredoka'] text-xs text-[#C0395A] hover:underline">
            edit profile
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <button
        onClick={() => setActiveTab("purchases")}
        className={`w-full text-left px-5 py-2.5 rounded-xl font-['Fredoka'] font-semibold text-sm transition-colors shadow-sm ${
          activeTab === "purchases"
            ? "bg-white text-[#C0395A] shadow-pink-200"
            : "bg-pink-100 text-[#4B2E39] hover:bg-white"
        }`}
      >
        My Purchases
      </button>
      <button
        onClick={() => setActiveTab("likes")}
        className={`w-full text-left px-5 py-2.5 rounded-xl font-['Fredoka'] font-semibold text-sm transition-colors shadow-sm ${
          activeTab === "likes"
            ? "bg-white text-[#C0395A] shadow-pink-200"
            : "bg-pink-100 text-[#4B2E39] hover:bg-white"
        }`}
      >
        My Likes
      </button>
    </aside>
  );
}

// ── Profile Picture Upload Card ───────────────────────────────────────────────
function ProfilePictureCard({
  avatarSrc,
  onImageChange,
  onRemove,
  onSave,
}: {
  avatarSrc: string;
  onImageChange: (src: string) => void;
  onRemove: () => void;
  onSave: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImageChange(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-pink-100 border-2 border-dashed border-pink-300 rounded-2xl p-5 flex flex-col items-center gap-3 w-full max-w-[200px]">
      {/* Preview circle */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
        {avatarSrc ? (
          <img src={avatarSrc} alt="Profile preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-pink-200 flex items-center justify-center text-4xl">🐥</div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Select Image button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-white border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold text-sm rounded-full py-1.5 hover:bg-pink-50 transition-colors"
      >
        Select Image
      </button>

      {/* Remove + Save row */}
      <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={onRemove}
          className="flex-1 bg-white border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold text-xs rounded-full py-1.5 hover:bg-pink-50 transition-colors"
        >
          Remove
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-1 bg-[#C0395A] text-white font-['Fredoka'] font-semibold text-xs rounded-full py-1.5 hover:bg-[#a02845] transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ── My Profile Form ───────────────────────────────────────────────────────────
function ProfileForm({ avatarSrc, onAvatarChange }: { avatarSrc: string; onAvatarChange: (src: string) => void }) {
  const [username, setUsername] = useState("angielelie");
  const [email, setEmail] = useState("angielelie@gmail.com");
  const [phone, setPhone] = useState("09123456789");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Other");

  // Which field is currently being edited
  const [editing, setEditing] = useState<string | null>(null);

  // Simple "change?" button that toggles the input to be editable
  const fieldClass = (field: string) =>
    `flex-1 rounded-lg border-2 px-3 py-1.5 text-sm font-['Fredoka'] text-[#4B2E39] outline-none transition ${
      editing === field
        ? "border-[#C0395A] bg-white focus:ring-2 focus:ring-pink-300"
        : "border-pink-200 bg-pink-50 cursor-default"
    }`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(null);
    // TODO: wire up Supabase profile update here
    console.log("Profile saved:", { username, email, phone, gender });
    alert("Profile saved! 🌸");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5 flex-1">
      {/* Heading */}
      <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">My Profile</h2>

      <form onSubmit={handleSave} className="flex flex-col gap-4">

        {/* Top section: fields on left, picture on right */}
        <div className="flex gap-6 items-start">

          {/* Fields column */}
          <div className="flex flex-col gap-3 flex-1">

            {/* Username */}
            <div className="flex items-center gap-3">
              <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly={editing !== "username"}
                className={fieldClass("username")}
              />
              <button
                type="button"
                onClick={() => setEditing(editing === "username" ? null : "username")}
                className="text-[#C0395A] font-['Fredoka'] text-xs font-semibold hover:underline whitespace-nowrap"
              >
                {editing === "username" ? "done" : "change?"}
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={editing !== "email"}
                className={fieldClass("email")}
              />
              <button
                type="button"
                onClick={() => setEditing(editing === "email" ? null : "email")}
                className="text-[#C0395A] font-['Fredoka'] text-xs font-semibold hover:underline whitespace-nowrap"
              >
                {editing === "email" ? "done" : "change?"}
              </button>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-3">
              <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                readOnly={editing !== "phone"}
                className={fieldClass("phone")}
              />
              <button
                type="button"
                onClick={() => setEditing(editing === "phone" ? null : "phone")}
                className="text-[#C0395A] font-['Fredoka'] text-xs font-semibold hover:underline whitespace-nowrap"
              >
                {editing === "phone" ? "done" : "change?"}
              </button>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-3">
              <label className="w-28 shrink-0 font-['Fredoka'] text-sm text-[#4B2E39] font-semibold">
                Gender
              </label>
              <div className="flex gap-4">
                {(["Male", "Female", "Other"] as const).map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-1 cursor-pointer font-['Fredoka'] text-sm text-[#4B2E39]"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="accent-[#C0395A]"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Profile picture card */}
          <ProfilePictureCard
            avatarSrc={avatarSrc}
            onImageChange={onAvatarChange}
            onRemove={() => onAvatarChange("")}
            onSave={() => console.log("Avatar saved!")}
          />
        </div>

        {/* Bottom Save button */}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-[#C0395A] text-white font-['Fredoka'] font-bold rounded-full px-8 py-2 text-sm hover:bg-[#a02845] transition-colors shadow-md"
          >
            save
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [avatarSrc, setAvatarSrc] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FDE8EF" }}>

      {/* ── HEADER BANNER (crimson with logo + tagline) ─────────────── */}
      <header
        className="relative w-full flex flex-col items-center justify-center py-5 overflow-hidden"
        style={{ backgroundColor: "#C0395A" }}
      >
        <YarnBackground />

        {/* Tagline text (faded, behind logo) */}
        <p
          className="absolute font-['Fredoka'] font-bold text-4xl tracking-widest uppercase select-none pointer-events-none"
          style={{ color: "rgba(255,255,255,0.18)", letterSpacing: "0.25em" }}
        >
          YOUR WISH IS MY CROCHET
        </p>

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src="/assets/CrishetteLogo.png"
            alt="Crishette Logo"
            width={80}
            height={80}
            className="drop-shadow-xl"
          />
        </div>

        {/* Star sparkles */}
        <div className="absolute top-3 left-1/4 text-pink-200 text-xl opacity-50 select-none">✦</div>
        <div className="absolute bottom-3 right-1/4 text-pink-300 text-2xl opacity-40 select-none">✦</div>
      </header>

      {/* ── SEARCH BAR STRIP ────────────────────────────────────────── */}
      <div
        className="w-full flex items-center gap-3 px-6 py-3 border-b border-pink-200"
        style={{ backgroundColor: "#FFF0F6" }}
      >
        {/* Search input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border-2 border-pink-200 px-4 py-1.5 text-sm font-['Fredoka'] text-[#4B2E39] placeholder-pink-300 outline-none focus:ring-2 focus:ring-pink-300 bg-white transition"
          />
        </div>

        {/* Cart icon */}
        <Link
          href="/shopping-cart"
          className="flex items-center gap-1 text-[#C0395A] font-['Fredoka'] text-sm font-semibold hover:text-[#a02845] transition-colors"
        >
          <CartIcon />
          <span>cart</span>
        </Link>
      </div>

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────── */}
      <main className="flex flex-1 gap-6 px-8 py-6 max-w-5xl mx-auto w-full">
        {/* Left sidebar */}
        <ProfileSidebar username="angielelie" avatarSrc={avatarSrc} />

        {/* Right: profile form */}
        <ProfileForm avatarSrc={avatarSrc} onAvatarChange={setAvatarSrc} />
      </main>
    </div>
  );
}
