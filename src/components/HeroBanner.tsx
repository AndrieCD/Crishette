// src/components/HeroBanner.tsx
// Reusable scrolling marquee banner with centered logo.
// Used on the Landing page — can be dropped into any page that needs it.
// No props needed — it's purely decorative.

import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden py-4">
      {/* Scrolling "YOUR WISH IS MY CROCHET" text behind the logo */}
      <div className="pointer-events-none absolute inset-0 flex select-none items-center overflow-hidden opacity-30">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="mx-4 text-4xl font-bold uppercase tracking-widest text-[#A02845]"
            >
              YOUR WISH IS MY CROCHET &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Logo centered on top of the marquee */}
      <div className="relative z-10 flex flex-col items-center py-2">
        <Image
          src="/assets/CrishetteLogoCrop.png"
          alt="Crishette Logo"
          width={140}
          height={150}
          className="drop-shadow-lg"
          priority
        />
      </div>
    </div>
  );
}
