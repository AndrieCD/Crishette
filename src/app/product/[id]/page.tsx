"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/products";

type LocalCartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  quantity: number;
  selected: boolean;
  color: string;
  size: string;
};

function ScallopHeader() {
  const scallops = Array.from({ length: 12 });

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-full flex h-[38px] overflow-hidden">
      {scallops.map((_, index) => (
        <div
          key={index}
          className="h-[38px] flex-1 rounded-b-full bg-[#f6dfe6]"
        />
      ))}
    </div>
  );
}

<<<<<<< Updated upstream
<<<<<<< Updated upstream
function TopNavIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-[11px] font-bold text-[#cb3859]"
    >
      <div className="mb-0.5">{children}</div>
      <span>{label}</span>
    </Link>
  );
}

<<<<<<< Updated upstream
function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex h-11 items-center overflow-hidden rounded-[10px] border-2 border-[#e4b8c2] bg-white text-[#7a5d67] shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        className="px-4 text-xl font-bold transition hover:bg-[#fbe8ee]"
      >
        −
      </button>
      <span className="min-w-[42px] text-center text-lg font-bold">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="px-4 text-xl font-bold transition hover:bg-[#fbe8ee]"
      >
        +
      </button>
    </div>
  );
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
function StarDisplay({ value, count }: { value: number; count: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-2xl ${star <= Math.round(value) ? "text-[#c93b57]" : "text-pink-200"}`}>★</span>
                ))}
            </div>
            <span className="text-sm font-semibold text-[#c93b57]">
                {value > 0 ? `${value.toFixed(1)} (${count} review${count !== 1 ? "s" : ""})` : "No reviews yet"}
            </span>
        </div>
    );
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
    return (
        <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#c93b57] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
            {message}
        </div>
    );
>>>>>>> Stashed changes
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const product = useMemo(
    () => PRODUCTS.find((item) => item.id === params.id),
    [params.id]
  );

  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] ?? ""
  );
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7edf1] px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-[1400px] bg-[#c93b57] p-4 md:p-6">
          <section className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center rounded-[34px] bg-[#f9f6f7] px-6 py-10 text-center">
            <h1 className="text-[34px] font-extrabold text-[#c93b57]">
              Product not found
            </h1>
            <Link
              href="/product-catalog"
              className="mt-6 rounded-full bg-[#c93b57] px-8 py-3 text-[22px] font-extrabold text-white"
            >
              back to catalog
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    const existingRaw = localStorage.getItem("cartItems");
    const existingItems: LocalCartItem[] = existingRaw
      ? JSON.parse(existingRaw)
      : [];

    const existingIndex = existingItems.findIndex(
      (item) =>
        item.id === product.id &&
        item.color === selectedColor &&
        item.size === selectedSize
    );

<<<<<<< Updated upstream
    if (existingIndex >= 0) {
      existingItems[existingIndex].quantity += quantity;
    } else {
      existingItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        alt: product.name,
        quantity,
        selected: false,
        color: selectedColor,
        size: selectedSize,
      });
    }
=======
                            <div className="flex flex-col gap-5">
                                <div>
                                    <h1 className="text-[44px] font-extrabold uppercase leading-none text-[#c93b57] drop-shadow-[3px_3px_0_#fff] md:text-[64px]">
                                        {product.name}
                                    </h1>
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="text-[32px] font-extrabold md:text-[44px]">₱{product.price.toFixed(2)}</span>
                                        <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-bold text-[#c93b57]">{product.stock} in stock</span>
                                    </div>
                                    <div className="mt-2">
                                        <StarDisplay value={product.avg_rating} count={product.review_count} />
                                    </div>
                                    <p className="mt-1 text-xs text-pink-400 font-['Fredoka']">
                                        Bought this?{" "}
                                        <Link href="/profile" className="underline font-bold text-[#c93b57]">
                                            Leave a review from My Purchases 🌸
                                        </Link>
                                    </p>
                                </div>
>>>>>>> Stashed changes

    localStorage.setItem("cartItems", JSON.stringify(existingItems));
    router.push("/shopping-cart");
  };

  return (
    <main className="min-h-screen bg-[#f7edf1] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-[1400px] bg-[#c93b57] p-4 md:p-6">
        <section className="min-h-[calc(100vh-96px)] rounded-[34px] bg-[#f9f6f7] px-5 pb-8 pt-5 md:px-10 md:pb-10 md:pt-6">
          <div className="relative rounded-[28px] bg-[#f6dfe6] px-5 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-fit items-center gap-3">
                <Image
                  src="/assets/CrishetteLogo.png"
                  alt="Crishette logo"
                  width={42}
                  height={42}
                  className="h-10 w-10 object-contain"
                />
                <div className="flex items-center gap-2 text-[#c93b57]">
                  <span className="text-[28px] font-bold leading-none">
                    crishette
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative w-full md:w-[280px]">
                  <input
                    type="text"
                    placeholder="Hinted search text"
                    className="h-11 w-full rounded-full bg-white px-4 pr-10 text-sm text-gray-500 outline-none"
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

                <div className="flex items-start gap-5 md:gap-4">
                  <TopNavIcon href="/product-catalog" label="shop">
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </TopNavIcon>

                  <TopNavIcon href="/shopping-cart" label="cart">
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
                  </TopNavIcon>

                  <TopNavIcon href="/profile" label="profile">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#666666] bg-white">
                      <Image
                        src="/images/profile-placeholder.jpg"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TopNavIcon>
                </div>
              </div>
            </div>

            <ScallopHeader />
          </div>

          <div className="pt-14 text-[#c93b57]">
            <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
              <div>
                <div className="overflow-hidden rounded-[22px] border-[8px] border-[#d34563] bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={700}
                    height={700}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-[44px] font-extrabold uppercase leading-none text-[#c93b57] drop-shadow-[3px_3px_0_#fff] md:text-[64px]">
                    {product.name}
                  </h1>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-[32px] font-extrabold md:text-[44px]">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[20px] font-bold md:text-[24px]">
                      {product.slots} slots
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="min-w-[80px] pt-1 text-[22px] font-extrabold">
                    Color
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`min-w-[110px] rounded-[12px] border-2 px-6 py-2 text-[18px] font-bold capitalize ${
                          selectedColor === color
                            ? "border-[#c93b57] bg-[#fbe8ee] text-[#c93b57]"
                            : "border-[#d6c0c6] bg-white text-[#c93b57]"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="min-w-[80px] pt-1 text-[22px] font-extrabold">
                    Size
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[110px] rounded-[12px] border-2 px-6 py-2 text-[18px] font-bold capitalize ${
                          selectedSize === size
                            ? "border-[#c93b57] bg-[#fbe8ee] text-[#c93b57]"
                            : "border-[#d6c0c6] bg-white text-[#c93b57]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="min-w-[120px] text-[22px] font-extrabold">
                    Quantity
                  </span>
                  <QuantityControl
                    quantity={quantity}
                    onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    onIncrease={() => setQuantity((prev) => prev + 1)}
                  />
                </div>

                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="rounded-full bg-[#c93b57] px-8 py-4 text-[24px] font-extrabold leading-none text-white transition hover:opacity-90 md:text-[32px]"
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    className="text-[44px] leading-none text-[#c93b57]"
                  >
                    ♡
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t-[3px] border-[#e4b8c2] pt-8">
              <h2 className="text-[34px] font-extrabold text-[#c93b57]">
                Detail
              </h2>
              <p className="mt-3 max-w-[980px] text-[18px] font-semibold leading-relaxed text-[#c93b57]">
                {product.detail}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}