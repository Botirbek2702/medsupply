"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import AddToCartButton from "@/components/AddToCartButton";

export default function FavoritesPage() {
  const [mounted, setMounted] = useState(false);
  const { items, toggleFavorite } = useFavoritesStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container" style={{ padding: "32px 16px", minHeight: "60vh" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--text-main)", fontSize: "28px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Heart size={28} color="var(--primary)" fill="var(--primary)" />
        Saralangan mahsulotlar
      </h1>

      {items.length > 0 ? (
        <div className="product-grid">
          {items.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-image-container">
                <Image src={product.image_url} alt={product.title} fill style={{ objectFit: "contain" }} />
                <button 
                  className="add-to-cart-btn" 
                  style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "transparent", color: "var(--danger)", border: "none", cursor: "pointer" }} 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(product);
                  }}
                >
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-rating">
                  <Star className="star" fill="var(--warning)" color="var(--warning)" size={14} />
                  <span>{product.rating || 5.0}</span>
                </div>
                <div className="product-footer">
                  <div className="product-price">{new Intl.NumberFormat('uz-UZ').format(product.price)} so'm</div>
                  <div onClick={(e) => e.preventDefault()}>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
          <Heart size={64} style={{ opacity: 0.2, margin: "0 auto 16px" }} />
          <h2>Saralangan mahsulotlar yo'q</h2>
          <p style={{ marginTop: "8px", marginBottom: "24px" }}>Sizga yoqqan mahsulotlardagi yurakcha belgisini bosing va ular shu yerda saqlanadi.</p>
          <Link href="/">
            <button className="btn btn-primary" style={{ padding: "12px 24px" }}>Katalogga o'tish</button>
          </Link>
        </div>
      )}
    </div>
  );
}
