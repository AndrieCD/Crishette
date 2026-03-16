
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