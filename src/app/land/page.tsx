// src/app/Land.tsx
// StoreFront / Landing Page
// Now clean and readable — each section is its own reusable component.
// To reuse any section on another page, just import and drop it in!

import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

export default function Land() {
    return (
        <main className="min-h-screen bg-[#C0395A] font-['Fredoka']">

            <HeroBanner />
            <Navbar />
            <FeaturedProducts />
            <Footer />

        </main>
    );
}