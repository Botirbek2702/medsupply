"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter, Star, ShoppingCart, X, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/useCartStore";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  old_price: number | null;
  image_url: string;
  rating: number;
  stock: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category");

  const { addToCart } = useCartStore();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    categoryParam ? [Number(categoryParam)] : []
  );
  const [sortBy, setSortBy] = useState("default");
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("*").order("id", { ascending: false }),
      supabase.from("categories").select("*").order("id", { ascending: true }),
    ]);

    if (productsRes.data) setAllProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  // Apply all filters
  const getFilteredProducts = () => {
    let result = [...allProducts];

    // Search by query (title + description)
    if (searchInput.trim()) {
      const q = searchInput.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category_id));
    }

    // Price range
    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

    // Sorting
    if (sortBy === "price_low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "name") result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  };

  const filteredProducts = getFilteredProducts();

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);
    setSortBy("default");
  };

  const hasActiveFilters = minPrice || maxPrice || selectedCategories.length > 0 || sortBy !== "default";

  const FiltersPanel = () => (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "18px" }}>
          <Filter size={20} color="var(--primary)" /> Filtrlar
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{ background: "none", border: "none", color: "var(--danger)", fontSize: "13px", cursor: "pointer" }}
          >
            Tozalash
          </button>
        )}
      </div>

      {/* Price */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "15px", marginBottom: "12px", fontWeight: 600 }}>Narx (so'm)</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="number"
            className="form-input"
            placeholder="dan"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ padding: "8px 12px", width: "100%" }}
          />
          <span style={{ color: "var(--text-muted)" }}>-</span>
          <input
            type="number"
            className="form-input"
            placeholder="gacha"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ padding: "8px 12px", width: "100%" }}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "15px", marginBottom: "12px", fontWeight: 600 }}>Kategoriya</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {categories.length === 0 ? (
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Kategoriyalar yo'q</span>
          ) : (
            categories.map((cat) => (
              <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                />
                {cat.name}
              </label>
            ))
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--text-main)", fontSize: "24px" }}>
        {query ? (
          <>Qidiruv natijalari: <span style={{ color: "var(--text-muted)" }}>"{query}"</span></>
        ) : (
          "Barcha mahsulotlar"
        )}
      </h1>

      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Desktop Sidebar Filters */}
        <div
          className="search-filters-desktop"
          style={{
            width: "260px",
            backgroundColor: "var(--card-bg)",
            padding: "24px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            position: "sticky",
            top: "100px",
          }}
        >
          <FiltersPanel />
        </div>

        {/* Results */}
        <div style={{ flex: 1, width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              color: "var(--text-muted)",
              fontSize: "14px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="btn btn-secondary search-filters-mobile-btn"
                style={{ gap: "6px", display: "none" }}
              >
                <SlidersHorizontal size={16} /> Filtr
              </button>
              <span>Jami {filteredProducts.length} ta mahsulot topildi</span>
            </div>
            <select
              className="form-input"
              style={{ padding: "8px 12px", width: "auto" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Saralash</option>
              <option value="price_low">Arzonlari oldin</option>
              <option value="price_high">Qimmatlari oldin</option>
              <option value="rating">Reyting bo'yicha</option>
              <option value="name">Nomi bo'yicha (A-Z)</option>
            </select>
          </div>

          {loading ? (
            <div style={{ padding: "64px", textAlign: "center", color: "var(--text-muted)" }}>
              Yuklanmoqda...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                padding: "64px 24px",
                textAlign: "center",
                backgroundColor: "var(--card-bg)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <Filter size={48} color="var(--text-muted)" style={{ opacity: 0.3, margin: "0 auto 16px" }} />
              <h3 style={{ color: "var(--text-main)", marginBottom: "8px" }}>Hech narsa topilmadi</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                Qidiruv yoki filtr shartlarini o'zgartirib ko'ring
              </p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="btn btn-primary">
                  Filtrlarni tozalash
                </button>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <div className="product-card" style={{ height: "100%" }}>
                    <div className="product-image-container">
                      <Image
                        src={product.image_url || "/placeholder.png"}
                        alt={product.title}
                        width={180}
                        height={180}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-rating">
                        <Star className="star" size={14} fill="currentColor" />
                        <span>{product.rating || 5}</span>
                      </div>
                      <div className="product-footer">
                        <div className="product-price">
                          {Number(product.price).toLocaleString("uz-UZ")} so'm
                        </div>
                        <button
                          className="add-to-cart-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({
                              id: product.id,
                              title: product.title,
                              price: product.price,
                              image_url: product.image_url,
                            });
                          }}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            style={{
              width: "300px",
              maxWidth: "85%",
              backgroundColor: "var(--card-bg)",
              padding: "24px",
              height: "100%",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={24} />
              </button>
            </div>
            <FiltersPanel />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "16px" }}
            >
              Natijalarni ko'rish ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "64px 16px", textAlign: "center" }}>Yuklanmoqda...</div>}>
      <SearchContent />
    </Suspense>
  );
}
