import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, ShieldCheck, Truck, Clock, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import ProductReviews from "@/components/ProductReviews";

export const revalidate = 0;

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data: product } = await supabase.from('products').select('*').eq('id', resolvedParams.id).single();
  const { data: specs } = await supabase.from('product_specs').select('*').eq('product_id', resolvedParams.id);

  if (!product) return <div className="container" style={{ padding: "32px 16px" }}>Mahsulot topilmadi... (ID: {resolvedParams.id})</div>;

  const hasDiscount = product.old_price && Number(product.old_price) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.old_price)) * 100)
    : 0;

  return (
    <div className="container" style={{ padding: "24px 16px" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px", flexWrap: "wrap" }}>
        <Link href="/">Bosh sahifa</Link>
        <ChevronRight size={16} />
        <Link href="/search">Katalog</Link>
        <ChevronRight size={16} />
        <span style={{ color: "var(--text-main)" }}>{product.title}</span>
      </div>

      <div className="product-detail-layout">
        {/* Left Side: Images */}
        <div className="product-gallery">
          <div className="main-image-container">
            {hasDiscount && (
              <span
                className="badge"
                style={{ position: "absolute", top: "16px", left: "16px", background: "var(--danger)", color: "#fff", zIndex: 2, fontSize: "14px", padding: "6px 12px" }}
              >
                -{discountPercent}% chegirma
              </span>
            )}
            <Image 
              src={product.image_url || '/placeholder.png'} 
              alt={product.title} 
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="thumbnail-list">
            {[1, 2, 3].map((item) => (
              <div key={item} className="thumbnail-item">
                <Image 
                  src={product.image_url || '/placeholder.png'} 
                  alt="Thumbnail" 
                  fill
                  style={{ objectFit: "contain", padding: "4px" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="product-info-panel">
          <div className="rating-row">
            <span className="star">★</span>
            <span style={{ fontWeight: 500 }}>{product.rating}</span>
          </div>
          
          <h1 className="product-title-large">{product.title}</h1>
          
          <div className="price-section">
            <div className="current-price">{Number(product.price).toLocaleString('uz-UZ')} so'm</div>
            {product.old_price && <div className="old-price">{Number(product.old_price).toLocaleString('uz-UZ')} so'm</div>}
          </div>

          <div className="delivery-info">
            <div className="delivery-item">
              <Truck size={20} color="var(--primary)" />
              <div>
                <div style={{ fontWeight: 500 }}>Yetkazib berish (1-3 kun)</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>O'zbekiston bo'ylab klinikangizgacha yetkazib beramiz.</div>
              </div>
            </div>
            <div className="delivery-item">
              <ShieldCheck size={20} color="var(--success)" />
              <div>
                <div style={{ fontWeight: 500 }}>O'rnatish va Servis</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Muhandislarimiz tomonidan bepul o'rnatib, ishlatish o'rgatiladi.</div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <AddToCartButton product={product} fullWidth />
            <FavoriteButton product={product} isLarge />
          </div>

          <div className="specs-section">
            <h3 style={{ marginBottom: "16px" }}>Xususiyatlari</h3>
            <ul className="specs-list">
              {specs?.map((spec: any, idx: number) => (
                <li key={idx} className="spec-item">
                  <span className="spec-name">{spec.spec_name}</span>
                  <span className="spec-value">{spec.spec_value}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="description-section">
            <h3 style={{ marginBottom: "16px" }}>Uskuna haqida</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              {product.description}
            </p>
          </div>

        </div>
      </div>

      {/* Product Reviews */}
      <ProductReviews productId={product.id} />
    </div>
  );
}
