import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, Headphones, Wrench, PackageOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import { HeroBanner, SectionTitle, ServiceSection } from "@/components/HomeSections";

export const revalidate = 0;

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*');

  const trustItems = [
    { icon: Truck, title: "Tez yetkazib berish", desc: "O'zbekiston bo'ylab 1-3 kun" },
    { icon: ShieldCheck, title: "Rasmiy kafolat", desc: "Barcha uskunalarga kafolat" },
    { icon: Wrench, title: "O'rnatish & servis", desc: "Muhandislar tomonidan" },
    { icon: Headphones, title: "24/7 qo'llab-quvvatlash", desc: "Doimiy texnik yordam" },
  ];

  return (
    <div className="container">
      <HeroBanner />

      {/* Trust badges */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        {trustItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "18px",
                backgroundColor: "var(--card-bg)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={22} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-main)" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <SectionTitle tkey="popular_products" />

      {!products || products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 24px",
            backgroundColor: "var(--card-bg)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)",
            marginBottom: "48px",
          }}
        >
          <PackageOpen size={56} color="var(--text-muted)" style={{ opacity: 0.4, margin: "0 auto 16px" }} />
          <h3 style={{ color: "var(--text-main)", marginBottom: "8px" }}>Hozircha mahsulotlar yo'q</h3>
          <p style={{ color: "var(--text-muted)" }}>Tez orada katalog to'ldiriladi.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const hasDiscount = product.old_price && Number(product.old_price) > Number(product.price);
            const discountPercent = hasDiscount
              ? Math.round((1 - Number(product.price) / Number(product.old_price)) * 100)
              : 0;
            const inStock = product.stock === undefined || product.stock === null || product.stock > 0;

            return (
              <Link href={`/product/${product.id}`} key={product.id} className="product-card">
                <div className="product-image-container">
                  {/* Discount badge */}
                  {hasDiscount && (
                    <span
                      className="badge"
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "var(--danger)",
                        color: "#fff",
                        zIndex: 2,
                      }}
                    >
                      -{discountPercent}%
                    </span>
                  )}
                  {/* Stock badge */}
                  {!inStock && (
                    <span
                      className="badge"
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        background: "var(--secondary)",
                        color: "var(--text-muted)",
                        zIndex: 2,
                      }}
                    >
                      Tugadi
                    </span>
                  )}
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={product.image_url || '/placeholder.png'}
                      alt={product.title}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <FavoriteButton product={product} />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-rating">
                    <span className="star">★</span>
                    <span>{product.rating || 5}</span>
                  </div>
                  <div className="product-footer">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {hasDiscount && (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                          {Number(product.old_price).toLocaleString('uz-UZ')} so'm
                        </span>
                      )}
                      <span className="product-price">{Number(product.price).toLocaleString('uz-UZ')} so'm</span>
                    </div>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <SectionTitle tkey="service_section" />
      <ServiceSection />
    </div>
  );
}
