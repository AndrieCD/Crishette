"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type CheckoutItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  selected?: boolean;
};

type Address = {
  fullName: string;
  phone: string;
  addressLine: string;
};

type ShippingOption = {
  id: string;
  label: string;
  fee: number;
  note: string;
};

type PaymentMethod = "Cash On Delivery" | "GCash" | "Maya";

const initialAddress: Address = {
  fullName: "Trysthan Joshua Jireh Fernando",
  phone: "09456214599",
  addressLine:
    "Gate 2 Lot 24 Rainbow Village 5 Phase 3, Hemlock St. Barangay 171, Caloocan City Metro Manila",
};

const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    fee: 1.5,
    note: "Guaranteed to get by 12 Feb",
  },
  {
    id: "express",
    label: "Express Shipping",
    fee: 3.0,
    note: "Guaranteed to get by 9 Feb",
  },
  {
    id: "local",
    label: "Standard Local",
    fee: 1.0,
    note: "Guaranteed to get by 14 Feb",
  },
];

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

function ChangeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-[120px] rounded-full bg-[#c93b57] px-6 py-2 text-[16px] font-bold text-white transition hover:opacity-90"
    >
      change
    </button>
  );
}

function SectionModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[520px] rounded-[28px] bg-[#fff7f9] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[24px] font-extrabold text-[#c93b57]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#c93b57] px-4 py-1 text-sm font-bold text-white"
          >
            close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
<<<<<<< Updated upstream
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

<<<<<<< Updated upstream
  const [address, setAddress] = useState<Address>(initialAddress);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Cash On Delivery");
  const [selectedShippingId, setSelectedShippingId] = useState("standard");
=======
=======
    const router = useRouter();
    const [user, setUser] = useState<CrishetteUser | null>(null);
    const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
    const [shipping, setShipping] = useState<ShippingOption>({ id: "standard", label: "Standard Shipping", note: "Guaranteed to get by 12 Feb", fee: 50 });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash On Delivery");
    const [address, setAddress] = useState<Address>({ fullName: "", phone: "", addressLine: "" });
    const [draftAddress, setDraftAddress] = useState<Address>(address);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [placing, setPlacing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======

>>>>>>> Stashed changes
    const [validationErrors, setValidationErrors] = useState<{ phone?: string; address?: string }>({});
>>>>>>> Stashed changes

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const [draftAddress, setDraftAddress] = useState<Address>(initialAddress);
  const router = useRouter();
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    const isMissingPhone = !address.phone.trim();
    const isMissingAddress = !address.addressLine.trim();
    const isAddressIncomplete = isMissingPhone || isMissingAddress;
>>>>>>> Stashed changes

<<<<<<< Updated upstream
  useEffect(() => {
    const rawItems = localStorage.getItem("checkoutItems");
=======
    useEffect(() => {
        const session = getSession();
        if (!session) { router.push("/login"); return; }
        setUser(session);
        const filled = { fullName: session.username ?? "", phone: session.phone ?? "", addressLine: session.address ?? "" };
        setAddress(filled);
        setDraftAddress(filled);
        const rawItems = sessionStorage.getItem("checkoutItems");
        if (!rawItems) { router.push("/shopping-cart"); return; }
        try { setCheckoutItems(JSON.parse(rawItems)); } catch { router.push("/shopping-cart"); }
        const rawShipping = sessionStorage.getItem("selectedShipping");
        if (rawShipping) { try { setShipping(JSON.parse(rawShipping)); } catch { } }
    }, [router]);
>>>>>>> Stashed changes

<<<<<<< Updated upstream
    if (rawItems) {
      try {
        const parsedItems: CheckoutItem[] = JSON.parse(rawItems);
        setCheckoutItems(parsedItems);
      } catch (error) {
        console.error("Failed to parse checkout items:", error);
      }
=======
    const itemSubtotal = useMemo(() => checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [checkoutItems]);
    const totalPayment = itemSubtotal + shipping.fee;

    const validateAddress = (): boolean => {
        const errors: { phone?: string; address?: string } = {};
        if (isMissingPhone) errors.phone = "Phone number is required before placing your order.";
        if (isMissingAddress) errors.address = "Delivery address is required before placing your order.";
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!user || isPaymentUnavailable) return;
        if (!validateAddress()) return;

        setPlacing(true);
        setOrderError(null);
        const cartItemsForOrder = checkoutItems.map((item) => ({
            id: item.cart_item_id, user_id: user.id, product_id: item.product_id,
            quantity: item.quantity, color: item.color, size: item.size,
            added_at: new Date().toISOString(),
            product: {
                id: item.product_id, name: item.product_name, image: item.product_image, price: item.price,
                description: "", colors: [], sizes: [], stock: 0, is_featured: false, is_published: true, created_at: "", updated_at: ""
            },
        }));
        const deliveryAddress = `${address.fullName} | ${address.phone} | ${address.addressLine}`;
        const result = await placeOrder(user.id, cartItemsForOrder, shipping.fee, shipping.label, paymentMethod, deliveryAddress);
        if (!result.success) { setOrderError(result.error ?? "Failed to place order."); setPlacing(false); return; }
        const ids = checkoutItems.map((i) => i.cart_item_id);
        for (const id of ids) { await import("@/lib/cart").then(({ removeFromCart }) => removeFromCart(id)); }
        sessionStorage.removeItem("checkoutItems");
        sessionStorage.removeItem("selectedShipping");
        setPlacing(false);
        setOrderPlaced(true);
    };

    if (!placing && checkoutItems.length === 0 && !orderPlaced) {
        return (
            <main className="min-h-screen bg-[#c93b57] font-['Fredoka']"><HeroBanner /><Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                    <h1 className="text-[34px] font-extrabold text-white">No items selected</h1>
                    <p className="mt-3 text-[18px] font-semibold text-pink-200">Please go back to your cart and choose at least one item.</p>
                    <Link href="/shopping-cart" className="mt-8 rounded-full bg-white px-8 py-3 text-[22px] font-extrabold text-[#c93b57]">back to cart</Link>
                </div>
            </main>
        );
>>>>>>> Stashed changes
    }

    setIsLoaded(true);
  }, []);

  const selectedShipping = useMemo(() => {
    return (
      shippingOptions.find((option) => option.id === selectedShippingId) ??
      shippingOptions[0]
    );
  }, [selectedShippingId]);

<<<<<<< Updated upstream
  const itemSubtotal = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [checkoutItems]);

  const totalQuantity = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [checkoutItems]);

  const totalPayment = itemSubtotal + selectedShipping.fee;

  const handleSaveAddress = () => {
    setAddress(draftAddress);
    setShowAddressModal(false);
  };

const handlePlaceOrder = () => {
  const rawCheckoutItems = localStorage.getItem("checkoutItems");
  const rawCartItems = localStorage.getItem("cartItems");

  const checkoutItems = rawCheckoutItems ? JSON.parse(rawCheckoutItems) : [];
  const cartItems = rawCartItems ? JSON.parse(rawCartItems) : [];
=======
                        <div className="border-t-[3px] border-[#e4b8c2] py-5">
                            <h2 className="mb-3 text-[20px] font-extrabold uppercase">Delivery Address</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1.6fr_auto] md:items-start">
                                <div className="text-[18px] font-semibold leading-tight">
                                    <p>{address.fullName || "—"}</p>
                                    <div className="mt-1">
                                        {address.phone
                                            ? <p>{address.phone}</p>
                                            : <p className="text-amber-500 text-sm font-bold">⚠️ No phone number set</p>}
                                        {validationErrors.phone && (
                                            <p className="mt-0.5 text-xs font-bold text-red-500">{validationErrors.phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-[18px] font-semibold leading-tight">
                                    {address.addressLine
                                        ? <p>{address.addressLine}</p>
                                        : <p className="text-amber-500 text-sm font-bold">⚠️ No delivery address set</p>}
                                    {validationErrors.address && (
                                        <p className="mt-0.5 text-xs font-bold text-red-500">{validationErrors.address}</p>
                                    )}
                                </div>
                                <div className="md:justify-self-end">
                                    <ChangeButton onClick={() => { setDraftAddress(address); setValidationErrors({}); setShowAddressModal(true); }} />
                                </div>
                            </div>

                            {isAddressIncomplete && (
                                <div className="mt-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 flex items-start justify-between gap-3">
                                    <p className="text-sm font-bold text-amber-700 font-['Fredoka']">
                                        📋 {isMissingPhone && isMissingAddress
                                            ? "Phone number and delivery address are required to place your order."
                                            : isMissingPhone
                                                ? "Phone number is required to place your order."
                                                : "Delivery address is required to place your order."}
                                    </p>
                                    <button type="button"
                                        onClick={() => { setDraftAddress(address); setShowAddressModal(true); }}
                                        className="shrink-0 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600 transition-colors font-['Fredoka']">
                                        Fill in
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="border-t-[3px] border-[#e4b8c2] py-5">
                            <div className="mb-5 grid grid-cols-[2fr_1fr_1fr_1fr] gap-3">
                                {["Product Ordered", "Unit Price", "Quantity", "Item Subtotal"].map((h) => (
                                    <h2 key={h} className="text-center text-[16px] font-extrabold uppercase first:text-left md:text-[20px]">{h}</h2>
                                ))}
                            </div>
                            <div className="space-y-5">
                                {checkoutItems.map((item) => (
                                    <div key={item.cart_item_id} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className="overflow-hidden rounded-[6px] border-[4px] border-[#e7748f]">
                                                <Image src={`/images/${item.product_image || "product1"}.png`} alt={item.product_name} width={110} height={110} className="h-[110px] w-[110px] object-cover" />
                                            </div>
                                            <div>
                                                <p className="max-w-[180px] text-[18px] font-bold leading-tight md:text-[22px]">{item.product_name}</p>
                                                {item.color && <p className="mt-1 text-[14px] font-semibold capitalize text-pink-400">{item.color}</p>}
                                                {item.size && <p className="text-[14px] font-semibold capitalize text-pink-400">{item.size}</p>}
                                            </div>
                                        </div>
                                        <p className="text-center text-[28px] font-bold md:text-[38px]">₱{item.price.toFixed(2)}</p>
                                        <p className="text-center text-[28px] font-bold md:text-[38px]">{item.quantity}</p>
                                        <p className="text-center text-[28px] font-bold md:text-[38px]">₱{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t-[3px] border-[#e4b8c2] py-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                                <h2 className="text-[20px] font-extrabold uppercase">Payment Method</h2>
                                <div className="flex items-center gap-2">
                                    <p className="text-[18px] font-bold md:text-[20px]">{paymentMethod}</p>
                                    {isPaymentUnavailable && (
                                        <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-600 border border-amber-300">Currently unavailable</span>
                                    )}
                                </div>
                                <div className="md:justify-self-end"><ChangeButton onClick={() => setShowPaymentModal(true)} /></div>
                            </div>
                        </div>

                        <div className="border-y-[3px] border-[#e4b8c2] py-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.3fr_auto_auto] md:items-center">
                                <h2 className="text-[20px] font-extrabold uppercase">Shipping Option</h2>
                                <div>
                                    <p className="text-[18px] font-bold md:text-[20px]">{shipping.label}</p>
                                    <p className="text-[16px] italic text-[#64865b] md:text-[18px]">{shipping.note}</p>
                                </div>
                                <p className="text-[20px] font-bold">₱{shipping.fee.toFixed(2)}</p>
                                <div className="md:justify-self-end"><ChangeButton onClick={() => router.push("/shipping-method")} /></div>
                            </div>
                        </div>

                        <div className="mt-7 flex justify-end">
                            <div className="w-full max-w-[320px]">
                                <div className="mb-1 flex items-center justify-between text-[18px] font-semibold">
                                    <span>Merchandise Subtotal</span><span>₱{itemSubtotal.toFixed(2)}</span>
                                </div>
                                <div className="mb-1 flex items-center justify-between text-[18px] font-semibold">
                                    <span>Shipping Subtotal</span><span>₱{shipping.fee.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-[22px] font-extrabold">
                                    <span>Total Payment:</span>
                                    <span className="text-[38px] leading-none">₱{totalPayment.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
>>>>>>> Stashed changes

  const remainingCartItems = cartItems.filter((cartItem: any) => {
    const matchedCheckoutItem = checkoutItems.find(
      (checkoutItem: any) =>
        checkoutItem.id === cartItem.id &&
        checkoutItem.color === cartItem.color &&
        checkoutItem.size === cartItem.size
    );

<<<<<<< Updated upstream
    return !matchedCheckoutItem;
  });

  localStorage.setItem("cartItems", JSON.stringify(remainingCartItems));
  localStorage.removeItem("checkoutItems");

  setOrderPlaced(true);
};

  if (!isLoaded) {
    return null;
  }

  if (checkoutItems.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen bg-[#f7edf1] px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-[1400px] bg-[#c93b57] p-4 md:p-6">
          <section className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center rounded-[34px] bg-[#f9f6f7] px-6 py-10 text-center">
            <h1 className="text-[34px] font-extrabold text-[#c93b57]">
              No items selected
            </h1>
            <p className="mt-3 text-[18px] font-semibold text-[#c93b57]">
              Please go back to your cart and choose at least one item.
            </p>

            <Link
              href="/shopping-cart"
              className="mt-8 rounded-full bg-[#c93b57] px-8 py-3 text-[22px] font-extrabold text-white"
            >
              back to cart
            </Link>
          </section>
        </div>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#f7edf1] px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-[1400px] bg-[#c93b57] p-4 md:p-6">
          <section className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center rounded-[34px] bg-[#f9f6f7] px-6 py-10 text-center">
            <h1 className="text-[34px] font-extrabold text-[#c93b57] md:text-[48px]">
              Order placed!
            </h1>
            <p className="mt-3 max-w-[500px] text-[18px] font-semibold text-[#c93b57]">
              Your checkout flow is now connected locally from cart to payment.
            </p>

            <div className="mt-8 rounded-[24px] border-[3px] border-[#e4b8c2] bg-white px-6 py-5 text-left text-[#c93b57]">
              <p className="text-[18px] font-bold">
                Items: {totalQuantity}
              </p>
              <p className="text-[18px] font-bold">
                Payment Method: {paymentMethod}
              </p>
              <p className="text-[18px] font-bold">
                Shipping: {selectedShipping.label}
              </p>
              <p className="text-[18px] font-bold">
                Total Paid: ${totalPayment.toFixed(2)}
              </p>
            </div>

            <Link
              href="/shopping-cart"
              className="mt-8 rounded-full bg-[#c93b57] px-8 py-3 text-[24px] font-extrabold text-white"
            >
              back to cart
            </Link>
          </section>
        </div>
      </main>
=======
                        <div className="mt-7 flex flex-col items-end gap-4">
                            {isPaymentUnavailable && (
                                <div className="w-full max-w-[440px] rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-right">
                                    <p className="text-[15px] font-bold text-amber-700">⚠️ {paymentMethod} is not yet available.</p>
                                    <p className="mt-1 text-[13px] text-amber-600">Please switch to <strong>Cash On Delivery</strong> to continue.</p>
                                </div>
                            )}
                            <button type="button" onClick={handlePlaceOrder} disabled={placing || isPaymentUnavailable}
                                title={isPaymentUnavailable ? `${paymentMethod} is not yet available` : undefined}
                                className={`rounded-full px-8 py-3 text-[28px] font-extrabold leading-none text-white transition md:text-[32px] ${isPaymentUnavailable ? "cursor-not-allowed bg-gray-300 text-gray-500" : "bg-[#c93b57] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    }`}>
                                {placing ? "Placing order..." : "place order"}
                            </button>
                            <p className="max-w-[360px] text-right text-[16px] italic leading-tight text-[#64865b] md:text-[18px]">
                                Each product is carefully handmade. Please allow 5–7 business days (1 creation week) for production before shipping.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {showAddressModal && (
                <SectionModal title="Change Delivery Address" onClose={() => setShowAddressModal(false)}>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#c93b57]">Full Name</label>
                            <input type="text" value={draftAddress.fullName}
                                onChange={(e) => setDraftAddress((p) => ({ ...p, fullName: e.target.value }))}
                                className="w-full rounded-full border-2 border-[#e4b8c2] px-4 py-2 outline-none focus:border-[#c93b57]" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#c93b57]">Phone Number <span className="text-red-400">*</span></label>
                            <input type="tel" value={draftAddress.phone}
                                onChange={(e) => setDraftAddress((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="e.g. 09123456789"
                                className="w-full rounded-full border-2 border-[#e4b8c2] px-4 py-2 outline-none focus:border-[#c93b57]" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#c93b57]">Delivery Address <span className="text-red-400">*</span></label>
                            <textarea value={draftAddress.addressLine}
                                onChange={(e) => setDraftAddress((p) => ({ ...p, addressLine: e.target.value }))}
                                rows={4} placeholder="House No., Street, Barangay, City, Province"
                                className="w-full rounded-[18px] border-2 border-[#e4b8c2] px-4 py-3 outline-none focus:border-[#c93b57]" />
                        </div>
                        <button type="button"
                            onClick={() => { setAddress(draftAddress); setValidationErrors({}); setShowAddressModal(false); }}
                            className="rounded-full bg-[#c93b57] px-6 py-2 text-lg font-bold text-white hover:opacity-90 transition-opacity">
                            save address
                        </button>
                    </div>
                </SectionModal>
            )}

            {showPaymentModal && (
                <SectionModal title="Choose Payment Method" onClose={() => setShowPaymentModal(false)}>
                    <div className="space-y-3">
                        {(["Cash On Delivery", "GCash", "Maya"] as PaymentMethod[]).map((method) => {
                            const unavailable = UNAVAILABLE_METHODS.has(method);
                            return (
                                <button key={method} type="button"
                                    onClick={() => { setPaymentMethod(method); setShowPaymentModal(false); }}
                                    className={`block w-full rounded-[18px] border-2 px-4 py-3 text-left transition-colors ${paymentMethod === method ? "border-[#c93b57] bg-[#fbe8ee] text-[#c93b57]" : "border-[#e4b8c2] bg-white text-[#c93b57] hover:border-[#c93b57]"}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold">{method}</span>
                                        {unavailable && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-600 border border-amber-300">Coming soon</span>}
                                    </div>
                                    {unavailable && <p className="mt-0.5 text-xs text-pink-400">This payment method is not yet available.</p>}
                                </button>
                            );
                        })}
                    </div>
                </SectionModal>
            )}
        </main>
>>>>>>> Stashed changes
    );
  }

  return (
    <main className="min-h-screen bg-[#f7edf1] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-[1400px] bg-[#c93b57] p-4 md:p-6">
        <section className="min-h-[calc(100vh-96px)] rounded-[34px] bg-[#f9f6f7] px-5 pb-8 pt-5 md:px-10 md:pb-10 md:pt-6">
          <div className="relative rounded-[28px] bg-[#f6dfe6] px-5 py-5">
            <div className="flex items-center gap-3">
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
                  | checkout
                </span>
              </div>
            </div>

            <ScallopHeader />
          </div>

          <div className="pt-14 text-[#c93b57]">
            <div className="border-t-[3px] border-[#e4b8c2] py-5">
              <div className="mb-3">
                <h2 className="text-[20px] font-extrabold uppercase">
                  Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1.6fr_auto] md:items-start">
                <div className="text-[18px] font-semibold leading-tight">
                  <p>{address.fullName}</p>
                  <p className="mt-1">{address.phone}</p>
                </div>

                <div className="text-[18px] font-semibold leading-tight">
                  {address.addressLine}
                </div>

                <div className="md:justify-self-end">
                  <ChangeButton
                    onClick={() => {
                      setDraftAddress(address);
                      setShowAddressModal(true);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t-[3px] border-[#e4b8c2] py-5">
              <div className="mb-5 grid grid-cols-[2fr_1fr_1fr_1fr] gap-3">
                <h2 className="text-[18px] font-extrabold uppercase md:text-[20px]">
                  Product Ordered
                </h2>
                <h2 className="text-center text-[18px] font-extrabold uppercase md:text-[20px]">
                  Unit Price
                </h2>
                <h2 className="text-center text-[18px] font-extrabold uppercase md:text-[20px]">
                  Quantity
                </h2>
                <h2 className="text-center text-[18px] font-extrabold uppercase md:text-[20px]">
                  Item Subtotal
                </h2>
              </div>

              <div className="space-y-5">
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="overflow-hidden rounded-[6px] border-[4px] border-[#e7748f]">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          width={110}
                          height={110}
                          className="h-[110px] w-[110px] object-cover"
                        />
                      </div>

                      <p className="max-w-[180px] text-[20px] font-bold leading-[1] md:text-[22px]">
                        {item.name}
                      </p>
                    </div>

                    <p className="text-center text-[34px] font-bold md:text-[48px]">
                      ${item.price.toFixed(2)}
                    </p>

                    <p className="text-center text-[34px] font-bold md:text-[48px]">
                      {item.quantity}
                    </p>

                    <p className="text-center text-[34px] font-bold md:text-[48px]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-[3px] border-[#e4b8c2] py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <h2 className="text-[20px] font-extrabold uppercase">
                  Payment Method
                </h2>

                <p className="text-[18px] font-bold md:text-[20px]">
                  {paymentMethod}
                </p>

                <div className="md:justify-self-end">
                  <ChangeButton onClick={() => setShowPaymentModal(true)} />
                </div>
              </div>
            </div>

            <div className="border-y-[3px] border-[#e4b8c2] py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.3fr_auto_auto] md:items-center">
                <h2 className="text-[20px] font-extrabold uppercase">
                  Shipping Option
                </h2>

                <div>
                  <p className="text-[18px] font-bold md:text-[20px]">
                    {selectedShipping.label}
                  </p>
                  <p className="text-[16px] italic text-[#64865b] md:text-[18px]">
                    {selectedShipping.note}
                  </p>
                </div>

                <p className="text-[20px] font-bold">
                  ${selectedShipping.fee.toFixed(2)}
                </p>

                <div className="md:justify-self-end">
                  <ChangeButton onClick={() => router.push("/shipping-method")} />
                </div>
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <div className="w-full max-w-[320px]">
                <div className="mb-1 flex items-center justify-between text-[18px] font-semibold">
                  <span>Merchandise Subtotal</span>
                  <span>${itemSubtotal.toFixed(2)}</span>
                </div>

                <div className="mb-1 flex items-center justify-between text-[18px] font-semibold">
                  <span>Shipping Subtotal</span>
                  <span>${selectedShipping.fee.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-[22px] font-extrabold">
                  <span>Total Payment:</span>
                  <span className="text-[38px] leading-none">
                    ${totalPayment.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col items-end gap-4">
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="rounded-full bg-[#c93b57] px-8 py-3 text-[28px] font-extrabold leading-none text-white transition hover:opacity-90 md:text-[32px]"
              >
                place order
              </button>

              <p className="max-w-[360px] text-right text-[16px] italic leading-tight text-[#64865b] md:text-[18px]">
                Each product is carefully handmade. Please allow 5–7 business
                days (1 creation week) for production before shipping.
              </p>
            </div>
          </div>
        </section>
      </div>

      {showAddressModal && (
        <SectionModal
          title="Change Delivery Address"
          onClose={() => setShowAddressModal(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-[#c93b57]">
                Full Name
              </label>
              <input
                type="text"
                value={draftAddress.fullName}
                onChange={(e) =>
                  setDraftAddress((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="w-full rounded-full border-2 border-[#e4b8c2] px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-[#c93b57]">
                Phone
              </label>
              <input
                type="text"
                value={draftAddress.phone}
                onChange={(e) =>
                  setDraftAddress((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="w-full rounded-full border-2 border-[#e4b8c2] px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-[#c93b57]">
                Address
              </label>
              <textarea
                value={draftAddress.addressLine}
                onChange={(e) =>
                  setDraftAddress((prev) => ({
                    ...prev,
                    addressLine: e.target.value,
                  }))
                }
                rows={4}
                className="w-full rounded-[18px] border-2 border-[#e4b8c2] px-4 py-3 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveAddress}
              className="rounded-full bg-[#c93b57] px-6 py-2 text-lg font-bold text-white"
            >
              save address
            </button>
          </div>
        </SectionModal>
      )}

      {showPaymentModal && (
        <SectionModal
          title="Choose Payment Method"
          onClose={() => setShowPaymentModal(false)}
        >
          <div className="space-y-3">
            {(["Cash On Delivery", "GCash", "Maya"] as PaymentMethod[]).map(
              (method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(method);
                    setShowPaymentModal(false);
                  }}
                  className={`block w-full rounded-[18px] border-2 px-4 py-3 text-left text-lg font-bold ${
                    paymentMethod === method
                      ? "border-[#c93b57] bg-[#fbe8ee] text-[#c93b57]"
                      : "border-[#e4b8c2] bg-white text-[#c93b57]"
                  }`}
                >
                  {method}
                </button>
              )
            )}
          </div>
        </SectionModal>
      )}

    </main>
  );

    useEffect(() => {
    const rawItems = localStorage.getItem("checkoutItems");

    if (rawItems) {
        try {
        const parsedItems: CheckoutItem[] = JSON.parse(rawItems);
        setCheckoutItems(parsedItems);
        } catch (error) {
        console.error("Failed to parse checkout items:", error);
        }
    }

    const savedShippingId = localStorage.getItem("selectedShippingId");
    if (savedShippingId) {
        setSelectedShippingId(savedShippingId);
    }

    setIsLoaded(true);
    }, []);
}