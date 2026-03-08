// src/app/product-catalog/page.tsx
import Image from "next/image";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  image: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const categories: Category[] = [
  { id: 1, name: "category 1", image: "/images/product2.png" },
  { id: 2, name: "category 1", image: "/images/product2.png" },
  { id: 3, name: "category 1", image: "/images/product2.png" },
  { id: 4, name: "category 1", image: "/images/product2.png" },
  { id: 5, name: "category 1", image: "/images/product2.png" },
];

const products: Product[] = [
  { id: 1, name: "product 1", price: 4.44, image: "/images/product3.png" },
  { id: 2, name: "product 1", price: 4.44, image: "/images/product3.png" },
  { id: 3, name: "product 1", price: 4.44, image: "/images/product3.png" },
  { id: 4, name: "product 1", price: 4.44, image: "/images/product3.png" },
  { id: 5, name: "product 1", price: 4.44, image: "/images/product3.png" },
  { id: 6, name: "product 1", price: 4.44, image: "/images/product3.png" },
  { id: 7, name: "product 1", price: 4.44, image: "/images/product3.png" },
  { id: 8, name: "product 1", price: 4.44, image: "/images/product3.png" },
];

function ScallopBottom() {
  return (
    <div className="w-full overflow-hidden leading-none">
      <svg
        viewBox="0 0 1200 80"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-10 w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 H1200 V10
             C1170,10 1170,80 1140,80
             C1110,80 1110,10 1080,10
             C1050,10 1050,80 1020,80
             C990,80 990,10 960,10
             C930,10 930,80 900,80
             C870,80 870,10 840,10
             C810,10 810,80 780,80
             C750,80 750,10 720,10
             C690,10 690,80 660,80
             C630,80 630,10 600,10
             C570,10 570,80 540,80
             C510,80 510,10 480,10
             C450,10 450,80 420,80
             C390,80 390,10 360,10
             C330,10 330,80 300,80
             C270,80 270,10 240,10
             C210,10 210,80 180,80
             C150,80 150,10 120,10
             C90,10 90,80 60,80
             C30,80 30,10 0,10 Z"
          fill="#FFF0F6"
        />
      </svg>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <button
      type="button"
      className="min-w-[88px] rounded-xl bg-[#CB3859] p-2 text-white shadow-sm transition hover:scale-[1.02]"
    >
      <div className="overflow-hidden rounded-lg">
        <Image
          src={category.image}
          alt={category.name}
          width={80}
          height={80}
          className="h-16 w-16 rounded-lg object-cover md:h-20 md:w-20"
        />
      </div>
      <p className="mt-1 text-center text-xs font-bold">{category.name}</p>
    </button>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block text-center"
    >
      <div className="overflow-hidden rounded-[4px] border-[4px] border-[#E25373] shadow-sm transition group-hover:scale-[1.02]">
        <Image
          src={product.image}
          alt={product.name}
          width={150}
          height={150}
          className="h-[120px] w-[120px] object-cover md:h-[140px] md:w-[140px]"
        />
      </div>
      <h3 className="mt-2 text-lg font-bold leading-none text-[#CB3859]">
        {product.name}
      </h3>
      <p className="text-lg font-bold leading-none text-[#CB3859]">
        ${product.price.toFixed(2)}
      </p>
    </Link>
  );
}

export default function ProductCatalogPage() {
  return (
    <main className="min-h-screen bg-[#CB3859]">
      {/* Top branding area */}
      <section className="relative overflow-hidden px-4 pt-6">
        <div className="absolute inset-0 opacity-15">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-6 border-t-4 border-[#A92F4C] opacity-70"
              style={{ top: `${i * 54 + 8}px`, borderRadius: "9999px" }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="/assets/CrishetteLogo.png"
            alt="Crishette logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      </section>

      {/* Main catalog board */}
      <section className="px-4 pb-0">
        <div className="mx-auto max-w-[980px] rounded-t-[2rem] bg-[#CB3859]">
          {/* Top nav card */}
          <div className="rounded-[2rem] bg-[#FFF0F6] px-6 py-4 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/CrishetteLogo.png"
                  alt="Crishette"
                  width={34}
                  height={34}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-[20px] font-bold text-[#CB3859]">
                  crishette
                </span>
              </div>

              <div className="relative w-full max-w-[420px]">
                <input
                  type="text"
                  placeholder="Hinted search text"
                  className="h-10 w-full rounded-full border border-pink-100 bg-white px-4 pr-10 text-xs text-gray-500 outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#555555]">
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
                </span>
              </div>

              <div className="flex items-start gap-4">
                <Link
                  href="/product-catalog"
                  className="flex flex-col items-center text-[10px] font-bold text-[#CB3859]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>shop</span>
                </Link>

                <Link
                  href="/shopping-cart"
                  className="flex flex-col items-center text-[10px] font-bold text-[#CB3859]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5h12.8M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                    />
                  </svg>
                  <span>cart</span>
                </Link>

                <Link
                  href="/login"
                  className="flex flex-col items-center text-[10px] font-bold text-[#CB3859]"
                >
                  <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#666666] bg-white">
                    <Image
                      src="/images/profile-placeholder.jpg"
                      alt="Profile"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span>profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Content card */}
          <div className="bg-[#FFF0F6] px-6 pb-0 pt-5">
            <div className="grid grid-cols-[220px_1fr] gap-6">
              {/* Left filter sidebar */}
              <aside className="rounded-[2rem] bg-[#FFF0F6]">
                <div className="rounded-[2rem] bg-white px-4 py-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-2 text-[#CB3859]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 4h18l-7 8v6l-4 2v-8L3 4z"
                      />
                    </svg>
                    <span className="text-sm font-bold">Search Filter</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-bold text-[#CB3859]">
                        Price Range
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="$ MIN"
                          className="w-full rounded-md border border-pink-200 px-2 py-1 text-xs outline-none"
                        />
                        <input
                          type="text"
                          placeholder="$ MIN"
                          className="w-full rounded-md border border-pink-200 px-2 py-1 text-xs outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        className="mt-3 w-full rounded-full bg-[#CB3859] py-2 text-sm font-bold text-white"
                      >
                        Apply
                      </button>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-bold text-[#CB3859]">
                        Rating
                      </p>
                      <p className="text-sm text-[#CB3859]">☆ ☆ ☆ ☆ ☆</p>
                      <button
                        type="button"
                        className="mt-3 w-full rounded-full bg-[#CB3859] py-2 text-sm font-bold text-white"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right content */}
              <div>
                <h2 className="mb-3 text-xl font-extrabold uppercase text-[#CB3859]">
                  Categories
                </h2>

                <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>

                <div className="mb-4 rounded-xl bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#CB3859]">
                      Sort by
                    </span>
                    <button
                      type="button"
                      className="rounded-md border border-pink-200 px-4 py-1 text-xs font-bold text-[#CB3859]"
                    >
                      Relevance
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-pink-200 px-4 py-1 text-xs font-bold text-[#CB3859]"
                    >
                      Latest
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-pink-200 px-4 py-1 text-xs font-bold text-[#CB3859]"
                    >
                      Top Sales
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <ScallopBottom />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#FFF0F6] px-6 py-4">
            <h3 className="text-2xl font-bold text-[#CB3859]">About Crishette</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#CB3859]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}