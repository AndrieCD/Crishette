// src/app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";
import { adminGetAllOrders, adminUpdateOrderStatus } from "@/lib/orders";
import type { Order, OrderStatus } from "@/lib/types";

// ── All possible order statuses ────────────────────────────────
const STATUSES: OrderStatus[] = ["Pending", "Processing", "In Transit", "Completed", "Cancelled"];

// ── Status badge colors ────────────────────────────────────────
const STATUS_STYLE: Record<OrderStatus, string> = {
    Pending: "bg-pink-100 text-[#C0395A]",
    Processing: "bg-yellow-100 text-yellow-700",
    "In Transit": "bg-blue-100 text-blue-600",   // ← add this
    Completed: "bg-green-100 text-green-600",
    Cancelled: "bg-red-100 text-red-500",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-3 py-0.5 text-xs font-bold font-['Fredoka'] whitespace-nowrap ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

// ── Yarn background ────────────────────────────────────────────
function YarnBackground() {
  return (
    <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <svg key={i} className="absolute" style={{ top: `${i * 10}%`, left: "-10%", width: "120%" }} viewBox="0 0 500 40" preserveAspectRatio="none">
          <path d={`M0,20 C30,${5 + i * 2} 60,${35 - i * 2} 100,20 C140,${5 + i} 170,${35 - i} 200,20 C240,${5 + i * 2} 270,${35 - i * 2} 300,20 C340,${5 + i} 370,${35 - i} 400,20 C430,${5 + i * 2} 460,${35 - i * 2} 500,20`}
            stroke="#C0395A" strokeWidth="2.5" fill="none" />
        </svg>
      ))}
    </div>
  );
}

// ── Order detail modal ─────────────────────────────────────────
function OrderModal({ order, onClose, onStatusChange }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (status === order.status) { onClose(); return; }
    setSaving(true);
    await adminUpdateOrderStatus(order.id, status);
    setSaving(false);
    onStatusChange(order.id, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-[#FFF0F6] rounded-3xl shadow-2xl p-6 w-full max-w-lg flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">Order Details</h2>
            <p className="font-['Fredoka'] text-xs text-gray-400 mt-0.5">
              {new Date(order.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Delivery info */}
        <div className="rounded-2xl border-2 border-pink-100 bg-white p-4">
          <p className="font-['Fredoka'] text-xs font-bold text-[#C0395A] mb-1 uppercase tracking-wide">Delivery Address</p>
          <p className="font-['Fredoka'] text-sm text-[#4B2E39]">{order.delivery_address || "—"}</p>
          <div className="mt-2 flex gap-4 text-xs font-semibold text-[#4B2E39] font-['Fredoka']">
            <span>💳 {order.payment_method}</span>
            <span>📦 {order.shipping_option}</span>
          </div>
        </div>

        {/* Items */}
        <div>
          <p className="font-['Fredoka'] text-xs font-bold text-[#C0395A] mb-2 uppercase tracking-wide">Items Ordered</p>
          <div className="space-y-2">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-pink-100 bg-white p-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 border-pink-200">
                  <Image src={`/images/${item.product_image || "product1"}.png`} alt={item.product_name} width={48} height={48} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-['Fredoka'] text-sm font-semibold text-[#4B2E39]">{item.product_name}</p>
                  <p className="font-['Fredoka'] text-xs text-pink-400">
                    {item.quantity}x · ₱{item.price_at_purchase.toFixed(2)}
                    {item.color && ` · ${item.color}`}
                    {item.size && ` · ${item.size}`}
                  </p>
                </div>
                <p className="font-['Fredoka'] font-bold text-sm text-[#C0395A] shrink-0">
                  ₱{(item.price_at_purchase * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="rounded-2xl border-2 border-pink-100 bg-white p-4 space-y-1">
          <div className="flex justify-between font-['Fredoka'] text-sm text-[#4B2E39]">
            <span>Shipping</span><span>₱{order.shipping_cost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-['Fredoka'] text-base font-bold text-[#C0395A] pt-1 border-t border-pink-100">
            <span>Total</span><span>₱{order.total_price.toFixed(2)}</span>
          </div>
        </div>

        {/* Status changer */}
        <div>
          <p className="font-['Fredoka'] text-xs font-bold text-[#C0395A] mb-2 uppercase tracking-wide">Update Status</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {STATUSES.map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`rounded-full px-2 py-2 text-xs font-bold font-['Fredoka'] transition-all border-2 ${
                  status === s
                    ? "bg-[#C0395A] text-white border-[#C0395A]"
                    : "bg-white text-[#C0395A] border-pink-200 hover:border-[#C0395A]"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-pink-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex-1 bg-[#C0395A] text-white font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-[#a02845] transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Orders Page ─────────────────────────────────────
export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push("/login"); return; }
    if (session.role !== "admin") { router.push("/"); return; }

    adminGetAllOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => { logout(); router.push("/login"); router.refresh(); };

  // Update order status in local state after modal save
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === "All" || o.status === filterStatus;
    const matchesSearch = search === "" || o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.delivery_address ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count per status for filter pills
  const countByStatus = (status: OrderStatus) => orders.filter((o) => o.status === status).length;

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#FDE8EF" }}>
      <YarnBackground />

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-between border-b-4 border-[#C0395A]">
          <div className="flex items-center gap-3">
            <Image src="/assets/CrishetteLogo.png" alt="Crishette" width={48} height={48} className="drop-shadow" />
            <div className="w-px h-8 bg-[#C0395A]" />
            <div className="flex items-center gap-3">
              <Link href="/admin" className="font-['Fredoka'] font-semibold text-pink-300 text-lg hover:text-[#C0395A] transition-colors">
                product / list
              </Link>
              <span className="text-pink-300">·</span>
              <span className="font-['Fredoka'] font-semibold text-[#C0395A] text-lg">orders</span>
            </div>
          </div>
          <button onClick={handleLogout} className="font-['Fredoka'] font-bold text-[#C0395A] text-sm hover:underline tracking-wide uppercase">
            Logout
          </button>
        </div>

        {/* Status filter pills + search */}
        <div className="flex flex-wrap items-center gap-3">
          {(["All", ...STATUSES] as const).map((s) => (
            <button key={s} type="button" onClick={() => setFilterStatus(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold font-['Fredoka'] transition-all border-2 ${
                filterStatus === s
                  ? "bg-[#C0395A] text-white border-[#C0395A]"
                  : "bg-white text-[#C0395A] border-pink-200 hover:border-[#C0395A]"
              }`}>
              {s}
              {s !== "All" && (
                <span className="ml-1.5 rounded-full bg-pink-100 px-1.5 py-0.5 text-[10px] text-[#C0395A]">
                  {countByStatus(s)}
                </span>
              )}
            </button>
          ))}

          <div className="relative ml-auto">
            <input type="text" placeholder="Search by address..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border-2 border-pink-200 pl-8 pr-3 py-1.5 text-xs font-['Fredoka'] text-[#4B2E39] outline-none focus:ring-2 focus:ring-pink-300 bg-white w-48"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C0395A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-pink-100">
            <span className="font-['Fredoka'] font-bold text-[#C0395A] text-lg">
              ORDERS ({filtered.length})
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center font-['Fredoka'] text-pink-300">Loading orders... 🧶</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center font-['Fredoka'] text-pink-300">No orders found 🧶</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-pink-50 border-b border-pink-100">
                  <th className="text-left px-6 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm">DATE</th>
                  <th className="text-left px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm">DELIVERY TO</th>
                  <th className="px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm text-center">ITEMS</th>
                  <th className="px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm text-center">TOTAL</th>
                  <th className="px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm text-center">STATUS</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => {
                  const itemCount = order.order_items?.reduce((s, item) => s + item.quantity, 0) ?? 0;
                  const addressLine = order.delivery_address?.split("|")[0]?.trim() ?? "—";

                  return (
                    <tr key={order.id}
                      className={`border-b border-pink-50 hover:bg-pink-50 transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-[#FFF8FA]"}`}
                      onClick={() => setSelectedOrder(order)}>
                      <td className="px-6 py-3 font-['Fredoka'] text-xs text-gray-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 font-['Fredoka'] text-sm text-[#4B2E39] max-w-[200px] truncate">
                        {addressLine}
                      </td>
                      <td className="px-4 py-3 text-center font-['Fredoka'] text-sm text-[#4B2E39]">{itemCount}</td>
                      <td className="px-4 py-3 text-center font-['Fredoka'] text-sm font-bold text-[#C0395A]">
                        ₱{order.total_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-['Fredoka'] text-xs font-semibold text-pink-300 hover:text-[#C0395A] transition-colors">
                          Edit →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
