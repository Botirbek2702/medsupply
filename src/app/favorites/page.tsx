"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

export default function FavoritesPage() {
  const favorites = [
    { id: 1, title: "Philips Achieva 1.5T MRT apparati - Premium diagnostika", price: "450 000 000 so'm", rating: 4.9, image: "/mri_machine_1779796015053.png" },
    { id: 2, title: "Mindray DC-70 Ultratovush (UZI) apparati", price: "120 000 000 so'm", rating: 4.8, image: "/media__1779796889813.png" },
  ];

  return (
    <div className="container" style={{ padding: "32px 16px", minHeight: "60vh" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--text-main)", fontSize: "28px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Heart size={28} color="var(--primary)" fill="var(--primary)" />
        Saralangan mahsulotlar
      </h1>

      {favorites.length > 0 ? (
        <div className="product-grid">
          {favorites.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="product-card" style={{ height: "100%" }}>
                <div className="product-image-container">
                  <Image src={product.image} alt={product.title} width={180} height={180} style={{ objectFit: "contain" }} />
                  <button className="add-to-cart-btn" style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "transparent", color: "var(--danger)" }} onClick={(e) => e.preventDefault()}>
                    <Heart size={20} fill="currentColor" />
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-rating">
                    <Star className="star" fill="currentColor" />
                    <span>{product.rating}</span>
                  </div>
                  <div className="product-footer">
                    <div className="product-price">{product.price}</div>
                    <button className="add-to-cart-btn" onClick={(e) => e.preventDefault()}>
                      <ShoppingCart size={18} />
                    </button>
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
            <button className="btn btn-primary" style={{ padding: "12px 24px" }}>Bosh sahifaga qaytish</button>
          </Link>
        </div>
      )}
    </div>
  );
}
