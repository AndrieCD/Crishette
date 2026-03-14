// src/components/Footer.tsx
// Reusable "About Crishette" footer section.
// Drop this at the bottom of any page that needs it.
// No props needed.

export default function Footer() {
  return (
    <section className="mt-6 rounded-t-3xl bg-[#FFF0F6] px-8 py-8">
      <h3 className="mb-2 font-['Fredoka'] text-xl font-bold text-[#C0395A]">
        About Crishette
      </h3>
      <p className="max-w-3xl font-['Fredoka'] text-sm leading-relaxed text-[#4B2E39]">
        Your Wish is My Crochet — Handmade crochet creations made with love.
        <br />
        <br />
        Email: crishette@email.com
        <br />
        Instagram: @crishette
        <br />
        <br />
        Based in Caloocan, Philippines
        <br />
        © 2026 Crishette. All rights reserved.
      </p>
    </section>
  );
}
