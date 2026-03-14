import Image from "next/image";
import Link from "next/link";

export default function Navbar(){
  return(
    <div className="relative mx-4 md:mx-8" style={{ minHeight: "150px" }}>
        <Image
          src="/assets/Scallops.png"
          alt=""
          fill
          className="object-fill"
          sizes="100vw"
          priority
        />

        {/* Nav content floats on top */}
        <div className="relative z-10 flex items-center justify-between gap-3 px-10 pt-4 pb-16">
          {/* Brand mark */}
          <div className="flex shrink-0 items-center gap-2">
            <Image
              src="/assets/Crishette_Logo2_Shop.png"
              alt="Crishette"
              width={200}
              height={100}
            />
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Crochet of my dreams..."
              className="w-full rounded-full border border-pink-200 bg-white px-4 py-4 text-sm text-gray-500 shadow-inner outline-none focus:ring-2 focus:ring-pink-300 font-['Fredoka']"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C0395A]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </button>
          </div>

          {/* Nav icons */}
          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/product-catalog"
              className="flex flex-col items-center text-[#C0395A] transition-colors hover:text-pink-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="font-['Fredoka'] text-xs">shop</span>
            </Link>

            <Link
              href="/shopping-cart"
              className="flex flex-col items-center text-[#C0395A] transition-colors hover:text-pink-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5h12.8M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                />
              </svg>
              <span className="font-['Fredoka'] text-xs">cart</span>
            </Link>

            <Link
              href="/login"
              className="flex flex-col items-center text-[#C0395A] transition-colors hover:text-pink-400"
            >
              <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#C0395A]">
                <Image
                  src="/images/profile-placeholder.jpg"
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <span className="font-['Fredoka'] text-xs">profile</span>
            </Link>
          </div>
        </div>
      </div>
  );
}