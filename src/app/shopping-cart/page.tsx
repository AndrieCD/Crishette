// src/app/shopping-cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  selected: boolean;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Tomorrow crochet tulips",
    price: 3.66,
    quantity: 1,
    image: "/images/product3.png",
    alt: "Crochet tulips product",
    selected: false,
  },
  {
    id: 2,
    name: "Tomorrow crochet tulips",
    price: 3.66,
    quantity: 1,
    image: "/images/product3.png",
    alt: "Crochet tulips product",
    selected: false,
  },
  {
    id: 3,
    name: "Tomorrow crochet tulips",
    price: 3.66,
    quantity: 1,
    image: "/images/product3.png",
    alt: "Crochet tulips product",
    selected: false,
  },
];

function ScallopBottom() {
  return (
    <div className="absolute left-0 right-0 top-full z-10 overflow-hidden leading-none">
      <svg
        viewBox="0 0 1200 60"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-[34px] w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 H1200 V10
             C1170,10 1170,60 1140,60
             C1110,60 1110,10 1080,10
             C1050,10 1050,60 1020,60
             C990,60 990,10 960,10
             C930,10 930,60 900,60
             C870,60 870,10 840,10
             C810,10 810,60 780,60
             C750,60 750,10 720,10
             C690,10 690,60 660,60
             C630,60 630,10 600,10
             C570,10 570,60 540,60
             C510,60 510,10 480,10
             C450,10 450,60 420,60
             C390,60 390,10 360,10
             C330,10 330,60 300,60
             C270,60 270,10 240,10
             C210,10 210,60 180,60
             C150,60 150,10 120,10
             C90,10 90,60 60,60
             C30,60 30,10 0,10 Z"
          fill="#f7e3ec"
        />
      </svg>
    </div>
  );
}

function CartCheckbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white bg-white"
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[#cb3859]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.261a1 1 0 0 1-1.42.005L3.29 9.17a1 1 0 1 1 1.414-1.414l4.09 4.09 6.493-6.55a1 1 0 0 1 1.417-.006Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}

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
    <div className="flex h-8 items-center overflow-hidden rounded-md bg-[#f2eef0] text-[#76636b] shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        className="px-3 text-lg font-bold"
      >
        −
      </button>
      <span className="min-w-[28px] text-center text-base font-bold">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="px-3 text-lg font-bold"
      >
        +
      </button>
    </div>
  );
}

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
      className="flex flex-col items-center text-[10px] font-bold text-[#cb3859]"
    >
      <div className="mb-0.5">{children}</div>
      <span>{label}</span>
    </Link>
  );
}

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const toggleSelected = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const changeQuantity = (id: number, amount: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: "#4a4a4a" }}
    >
      <div className="mx-auto w-full max-w-[980px]">
        <section
          className="px-4 pb-5 pt-4"
          style={{ backgroundColor: "#cb3859" }}
        >
          {/* Header */}
          <div
            className="relative rounded-[28px] px-4 pb-8 pt-3"
            style={{ backgroundColor: "#f7e3ec" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-fit items-center gap-2">
                <Image
                  src="/assets/CrishetteLogo.png"
                  alt="Crishette logo"
                  width={34}
                  height={34}
                  className="h-8 w-8 object-contain"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[22px] font-bold text-[#cb3859]">
                    crishette
                  </span>
                  <span className="text-[13px] font-bold text-[#cb3859]">
                    | shopping cart
                  </span>
                </div>
              </div>

              <div className="relative w-[240px]">
                <input
                  type="text"
                  placeholder="Hinted search text"
                  className="h-10 w-full rounded-full bg-white px-4 pr-10 text-xs text-gray-500 outline-none"
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

                <TopNavIcon href="/login" label="profile">
                  <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#666666] bg-white">
                    <Image
                      src="/images/profile-placeholder.jpg"
                      alt="Profile"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TopNavIcon>
              </div>
            </div>

            <ScallopBottom />
          </div>

          {/* Body */}
          <div className="mx-auto max-w-[900px] px-2 pt-16" style={{ color: "#ffffff" }}>
            <div
              className="mb-5 grid items-center gap-4"
              style={{ gridTemplateColumns: "52px 2fr 1fr 1fr 110px" }}
            >
              <div />
              <div className="text-left text-[18px] font-extrabold uppercase">
                Product
              </div>
              <div className="text-center text-[18px] font-extrabold uppercase">
                Unit Price
              </div>
              <div className="text-center text-[18px] font-extrabold uppercase">
                Quantity
              </div>
              <div className="text-center text-[18px] font-extrabold uppercase">
                Actions
              </div>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid items-center gap-4"
                  style={{ gridTemplateColumns: "52px 2fr 1fr 1fr 110px" }}
                >
                  <div className="flex justify-center">
                    <CartCheckbox
                      checked={item.selected}
                      onToggle={() => toggleSelected(item.id)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="overflow-hidden rounded-[4px] border-[4px] border-[#f08aa0] shadow-sm">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={94}
                        height={94}
                        className="h-[94px] w-[94px] object-cover"
                      />
                    </div>

                    <div className="max-w-[150px]">
                      <h2 className="text-[22px] font-bold leading-[0.95] text-white">
                        Tomorrow
                        <br />
                        crochet
                        <br />
                        tulips
                      </h2>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[26px] font-extrabold text-white">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <QuantityControl
                      quantity={item.quantity}
                      onDecrease={() => changeQuantity(item.id, -1)}
                      onIncrease={() => changeQuantity(item.id, 1)}
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="text-[20px] font-bold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-end gap-4">
              <p className="text-[18px] font-bold text-pink-50">
                Total ({totalItems} Items):{" "}
                <span className="text-white">${total.toFixed(2)}</span>
              </p>

              <button
                type="button"
                className="rounded-full px-8 py-2 text-[20px] font-bold"
                style={{
                  backgroundColor: "#f7d7df",
                  color: "#d34d6d",
                }}
              >
                check out
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}