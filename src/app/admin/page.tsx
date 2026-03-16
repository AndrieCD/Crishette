"use client";

import { useState, useEffect } from "react";
import Link from "next/link"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";
import {
    adminGetAllProducts,
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminTogglePublished,
    adminToggleFeatured,
} from "@/lib/products";
import type { Product } from "@/lib/types";

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

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <div onClick={onChange} className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ${checked ? "bg-[#C0395A]" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </div>
    );
}

function ProductModal({ onClose, onSave, initial }: {
    onClose: () => void;
    onSave: (data: Partial<Product>) => void;
    initial?: Product;
}) {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [price, setPrice] = useState(String(initial?.price ?? ""));
    const [stock, setStock] = useState(String(initial?.stock ?? "0"));
    const [image, setImage] = useState(initial?.image ?? "");
    const [colors, setColors] = useState((initial?.colors ?? []).join(", "));
    const [sizes, setSizes] = useState((initial?.sizes ?? []).join(", "));
    const [category, setCategory] = useState(initial?.category ?? "");
    const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
    const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);

    const handleSave = () => {
        if (!name.trim() || !price) return;
        onSave({
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            image: image.trim(),
            colors: colors.split(",").map((c) => c.trim()).filter(Boolean),
            sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
            category: category.trim() || undefined,
            is_featured: isFeatured,
            is_published: isPublished,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-[#FFF0F6] rounded-3xl shadow-2xl p-6 w-full max-w-lg flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">
                    {initial ? "Edit Product ✏️" : "New Product 🧶"}
                </h2>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Product Name *", value: name, onChange: setName, type: "text", colSpan: true },
                        { label: "Price (₱) *", value: price, onChange: setPrice, type: "number" },
                        { label: "Stock", value: stock, onChange: setStock, type: "number" },
                        { label: "Image filename (e.g. product1)", value: image, onChange: setImage, type: "text" },
                        { label: "Category", value: category, onChange: setCategory, type: "text" },
                        { label: "Colors (comma-separated)", value: colors, onChange: setColors, type: "text" },
                        { label: "Sizes (comma-separated)", value: sizes, onChange: setSizes, type: "text" },
                    ].map(({ label, value, onChange, type, colSpan }) => (
                        <div key={label} className={colSpan ? "col-span-2" : ""}>
                            <label className="block font-['Fredoka'] text-xs font-semibold text-[#4B2E39] mb-1">{label}</label>
                            <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
                                className="w-full rounded-full border-2 border-pink-200 px-3 py-1.5 text-sm font-['Fredoka'] text-[#4B2E39] outline-none focus:ring-2 focus:ring-pink-300 bg-white" />
                        </div>
                    ))}

                    <div className="col-span-2">
                        <label className="block font-['Fredoka'] text-xs font-semibold text-[#4B2E39] mb-1">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                            className="w-full rounded-2xl border-2 border-pink-200 px-3 py-2 text-sm font-['Fredoka'] text-[#4B2E39] outline-none focus:ring-2 focus:ring-pink-300 bg-white resize-none" />
                    </div>
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-['Fredoka'] text-sm text-[#4B2E39]">
                        <Toggle checked={isPublished} onChange={() => setIsPublished(!isPublished)} />
                        Published
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-['Fredoka'] text-sm text-[#4B2E39]">
                        <Toggle checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
                        Featured
                    </label>
                </div>

                <div className="flex gap-3 mt-2">
                    <button type="button" onClick={onClose}
                        className="flex-1 border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-pink-50 transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave}
                        className="flex-1 bg-[#C0395A] text-white font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-[#a02845] transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

function DeleteModal({ productName, onCancel, onConfirm }: {
    productName: string; onCancel: () => void; onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-[#FFF0F6] rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-4 text-center">
                <p className="text-4xl">🗑️</p>
                <h2 className="font-['Fredoka'] font-bold text-xl text-[#C0395A]">Delete Product?</h2>
                <p className="font-['Fredoka'] text-sm text-[#4B2E39]">
                    Are you sure you want to delete <span className="font-bold">{productName}</span>? This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 border-2 border-pink-300 text-[#C0395A] font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-pink-50 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 bg-[#C0395A] text-white font-['Fredoka'] font-semibold rounded-full py-2 text-sm hover:bg-[#a02845] transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const session = getSession();
        if (!session) { router.push("/login"); return; }
        if (session.role !== "admin") { router.push("/"); return; }

        adminGetAllProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const handleTogglePublished = async (product: Product) => {
        setTogglingIds((prev) => new Set(prev).add(product.id));
        setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_published: !p.is_published } : p));
        await adminTogglePublished(product.id, !product.is_published);
        setTogglingIds((prev) => { const s = new Set(prev); s.delete(product.id); return s; });
    };

    const handleToggleFeatured = async (product: Product) => {
        setTogglingIds((prev) => new Set(prev).add(product.id));
        setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_featured: !p.is_featured } : p));
        await adminToggleFeatured(product.id, !product.is_featured);
        setTogglingIds((prev) => { const s = new Set(prev); s.delete(product.id); return s; });
    };

    const handleAddProduct = async (data: Partial<Product>) => {
        const result = await adminCreateProduct(data as Omit<Product, "id" | "created_at" | "updated_at">);
        if (result.success && result.product) {
            setProducts((prev) => [result.product!, ...prev]);
        }
        setShowAddModal(false);
    };

    const handleEditProduct = async (data: Partial<Product>) => {
        if (!editProduct) return;
        const result = await adminUpdateProduct(editProduct.id, data);
        if (result.success && result.product) {
            setProducts((prev) => prev.map((p) => p.id === editProduct.id ? result.product! : p));
        }
        setEditProduct(null);
    };

    const handleDeleteProduct = async () => {
        if (!deleteProduct) return;
        await adminDeleteProduct(deleteProduct.id);
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
        setDeleteProduct(null);
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
        router.refresh();
    };

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative min-h-screen" style={{ backgroundColor: "#FDE8EF" }}>
            <YarnBackground />

            {showAddModal && <ProductModal onClose={() => setShowAddModal(false)} onSave={handleAddProduct} />}
            {editProduct && <ProductModal onClose={() => setEditProduct(null)} onSave={handleEditProduct} initial={editProduct} />}
            {deleteProduct && <DeleteModal productName={deleteProduct.name} onCancel={() => setDeleteProduct(null)} onConfirm={handleDeleteProduct} />}

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

                {/* ── Header ── */}
                <div className="bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-between border-b-4 border-[#C0395A]">
                    <div className="flex items-center gap-3">
                        <Image src="/assets/CrishetteLogo.png" alt="Crishette" width={48} height={48} className="drop-shadow" />
                        <div className="w-px h-8 bg-[#C0395A]" />
                        {/* Nav links — active page is pink, inactive is faded */}
                        <div className="flex items-center gap-3">
                            <span className="font-['Fredoka'] font-semibold text-[#C0395A] text-lg">
                                product / list
                            </span>
                            <span className="text-pink-200">·</span>
                            <Link
                                href="/admin/orders"
                                className="font-['Fredoka'] font-semibold text-pink-300 text-lg hover:text-[#C0395A] transition-colors"
                            >
                                orders
                            </Link>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="font-['Fredoka'] font-bold text-[#C0395A] text-sm hover:underline tracking-wide uppercase">
                        Logout
                    </button>
                </div>

                {/* ── Products table ── */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
                        <div className="flex items-center gap-3">
                            <span className="font-['Fredoka'] font-bold text-[#C0395A] text-lg">
                                PRODUCTS ({filtered.length})
                            </span>
                            <div className="relative">
                                <input type="text" placeholder="Search..." value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded-full border-2 border-pink-200 pl-8 pr-3 py-1 text-xs font-['Fredoka'] text-[#4B2E39] outline-none focus:ring-2 focus:ring-pink-300 bg-[#FFF0F6] w-36"
                                />
                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C0395A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                        </div>
                        <button onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-1.5 bg-[#C0395A] text-white font-['Fredoka'] font-semibold text-sm rounded-full px-4 py-1.5 hover:bg-[#a02845] transition-colors shadow-sm">
                            <span className="text-lg leading-none">+</span> NEW PRODUCT
                        </button>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="py-12 text-center font-['Fredoka'] text-pink-300">Loading products... 🧶</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-pink-50 border-b border-pink-100">
                                    <th className="text-left px-6 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm">PRODUCT NAME</th>
                                    <th className="px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm text-center">PRICE</th>
                                    <th className="px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm text-center">STOCK</th>
                                    <th className="px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm text-center">PUBLISHED</th>
                                    <th className="px-4 py-3 font-['Fredoka'] font-semibold text-[#4B2E39] text-sm text-center">FEATURED</th>
                                    <th className="px-4 py-3 w-20" />
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((product, i) => (
                                    <tr key={product.id}
                                        className={`border-b border-pink-50 hover:bg-pink-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#FFF8FA]"}`}>

                                        {/* Name — click to edit */}
                                        <td className="px-6 py-3">
                                            <button onClick={() => setEditProduct(product)}
                                                className="font-['Fredoka'] text-sm text-[#4B2E39] hover:text-[#C0395A] hover:underline text-left transition-colors">
                                                {product.name}
                                            </button>
                                            {product.category && (
                                                <span className="ml-2 rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-[#C0395A] font-['Fredoka']">
                                                    {product.category}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-center font-['Fredoka'] text-sm text-[#4B2E39]">
                                            ₱{product.price.toFixed(2)}
                                        </td>

                                        <td className="px-4 py-3 text-center font-['Fredoka'] text-sm text-[#4B2E39]">
                                            <span className={product.stock === 0 ? "text-red-400 font-bold" : ""}>{product.stock}</span>
                                        </td>

                                        {/* Published toggle */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center">
                                                <Toggle checked={product.is_published} onChange={() => handleTogglePublished(product)} />
                                            </div>
                                        </td>

                                        {/* Featured toggle */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center">
                                                <Toggle checked={product.is_featured} onChange={() => handleToggleFeatured(product)} />
                                            </div>
                                        </td>

                                        {/* Delete */}
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => setDeleteProduct(product)}
                                                className="font-['Fredoka'] text-xs font-semibold text-pink-300 hover:text-[#C0395A] transition-colors">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 font-['Fredoka'] text-pink-300 text-sm">
                                            No products found 🧶
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}