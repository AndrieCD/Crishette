"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
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
      className={`flex h-10 w-10 items-center justify-center rounded-[10px] border-2 transition ${
        checked
          ? "border-[#c93b57] bg-[#fbe8ee]"
          : "border-[#e4b8c2] bg-white"
      }`}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[#c93b57]"
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
    <div className="flex h-10 items-center overflow-hidden rounded-[10px] border-2 border-[#e4b8c2] bg-white text-[#7a5d67] shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        className="px-4 text-xl font-bold transition hover:bg-[#fbe8ee]"
      >
        −
      </button>
      <span className="min-w-[38px] text-center text-base font-bold">
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
      className="flex flex-col items-center text-[11px] font-bold text-[#cb3859]"
    >
      <div className="mb-0.5">{children}</div>
      <span>{label}</span>
    </Link>
  );
}

export default function ShoppingCartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cartItems");
    if (raw) {
      try {
        const parsed: CartItem[] = JSON.parse(raw);
        setCartItems(parsed);
      } catch (error) {
        console.error("Failed to parse cart items:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  const persistCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

<<<<<<< Updated upstream
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
=======
  const selectedItems = useMemo(() => {
    return cartItems.filter((item) => item.selected);
  }, [cartItems]);

  const toggleSelected = (index: number) => {
    const updated = [...cartItems];
    updated[index].selected = !updated[index].selected;
    persistCart(updated);
  };

  const changeQuantity = (index: number, amount: number) => {
    const updated = [...cartItems];
    updated[index].quantity = Math.max(1, updated[index].quantity + amount);
    persistCart(updated);
>>>>>>> Stashed changes
  };

  const deleteItem = (index: number) => {
    const updated = cartItems.filter((_, itemIndex) => itemIndex !== index);
    persistCart(updated);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item before checking out.");
      return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    router.push("/checkout");
  };

  if (!isLoaded) {
    return null;
  }

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
                  <span className="text-[18px] font-bold leading-none">
                    | shopping cart
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

<<<<<<< Updated upstream
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
=======
                  <TopNavIcon href="/profile" label="profile">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#666666] bg-white">
>>>>>>> Stashed changes
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
            {cartItems.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <h2 className="text-[34px] font-extrabold">Your cart is empty</h2>
                <p className="mt-3 text-[18px] font-semibold">
                  Add a product first to continue shopping.
                </p>
                <Link
                  href="/product-catalog"
                  className="mt-6 rounded-full bg-[#c93b57] px-8 py-3 text-[22px] font-extrabold text-white"
                >
                  go to catalog
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-5 border-t-[3px] border-[#e4b8c2] pt-5">
                  <div className="hidden grid-cols-[70px_2.5fr_1fr_1fr_120px] gap-4 md:grid">
                    <div />
                    <div className="text-left text-[20px] font-extrabold uppercase">
                      Product
                    </div>
                    <div className="text-center text-[20px] font-extrabold uppercase">
                      Unit Price
                    </div>
                    <div className="text-center text-[20px] font-extrabold uppercase">
                      Quantity
                    </div>
                    <div className="text-center text-[20px] font-extrabold uppercase">
                      Actions
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-5">
                    {cartItems.map((item, index) => (
                      <div
                        key={`${item.id}-${item.color}-${item.size}-${index}`}
                        className="rounded-[24px] border-2 border-[#ecd3d9] bg-white/70 p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0"
                      >
                        <div className="hidden items-center gap-4 md:grid md:grid-cols-[70px_2.5fr_1fr_1fr_120px]">
                          <div className="flex justify-center">
                            <CartCheckbox
                              checked={item.selected}
                              onToggle={() => toggleSelected(index)}
                            />
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="overflow-hidden rounded-[8px] border-[4px] border-[#e7748f]">
                              <Image
                                src={item.image}
                                alt={item.alt}
                                width={110}
                                height={110}
                                className="h-[110px] w-[110px] object-cover"
                              />
                            </div>

                            <div className="max-w-[260px]">
                              <h2 className="text-[22px] font-bold leading-[1] text-[#c93b57]">
                                {item.name}
                              </h2>
                              <p className="mt-2 text-[16px] font-semibold text-[#c93b57]">
                                Color: <span className="capitalize">{item.color}</span>
                              </p>
                              <p className="text-[16px] font-semibold text-[#c93b57]">
                                Size: <span className="capitalize">{item.size}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-[28px] font-extrabold text-[#c93b57]">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex justify-center">
                            <QuantityControl
                              quantity={item.quantity}
                              onDecrease={() => changeQuantity(index, -1)}
                              onIncrease={() => changeQuantity(index, 1)}
                            />
                          </div>

                          <div className="text-center">
                            <button
                              type="button"
                              onClick={() => deleteItem(index)}
                              className="text-[20px] font-bold text-[#c93b57] transition hover:opacity-70"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="md:hidden">
                          <div className="mb-4 flex items-start gap-3">
                            <CartCheckbox
                              checked={item.selected}
                              onToggle={() => toggleSelected(index)}
                            />

                            <div className="overflow-hidden rounded-[8px] border-[4px] border-[#e7748f]">
                              <Image
                                src={item.image}
                                alt={item.alt}
                                width={92}
                                height={92}
                                className="h-[92px] w-[92px] object-cover"
                              />
                            </div>

                            <div className="flex-1">
                              <h2 className="text-[20px] font-bold leading-[1] text-[#c93b57]">
                                {item.name}
                              </h2>
                              <p className="mt-2 text-[14px] font-semibold text-[#c93b57]">
                                Color: <span className="capitalize">{item.color}</span>
                              </p>
                              <p className="text-[14px] font-semibold text-[#c93b57]">
                                Size: <span className="capitalize">{item.size}</span>
                              </p>
                              <p className="mt-2 text-[24px] font-extrabold text-[#c93b57]">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <QuantityControl
                              quantity={item.quantity}
                              onDecrease={() => changeQuantity(index, -1)}
                              onIncrease={() => changeQuantity(index, 1)}
                            />

                            <button
                              type="button"
                              onClick={() => deleteItem(index)}
                              className="text-[18px] font-bold text-[#c93b57]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-end gap-4">
                  <p className="text-[22px] font-extrabold text-[#c93b57]">
                    Total ({totalItems} Items): <span>${total.toFixed(2)}</span>
                  </p>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="rounded-full bg-[#c93b57] px-10 py-3 text-[28px] font-extrabold leading-none text-white transition hover:opacity-90 md:text-[32px]"
                  >
                    check out
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}