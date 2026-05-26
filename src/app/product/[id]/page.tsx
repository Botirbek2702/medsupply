import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, ShieldCheck, Truck, Clock, ChevronRight } from "lucide-react";

// In a real app, this would fetch from a database based on the ID
const product = {
  id: 1,
  title: "Philips Achieva 1.5T MRT apparati, yuqori sifatli tasvirlash",
  price: "450 000 000 so'm",
  oldPrice: "500 000 000 so'm",
  rating: 4.8,
  reviews: 12,
  image: "/images/mri_machine.png",
  description: "Philips Achieva 1.5T MRT apparati klinikangiz uchun aniq va ishonchli diagnostika vositasi. Bemorlarga qulaylik va yuqori sifatli tasvirni taqdim etadi. O'rnatish va o'rgatish bepul.",
  specs: [
    { name: "Magnit maydoni", value: "1.5 Tesla" },
    { name: "Skanerlash tezligi", value: "Yuqori (SmartExam)" },
    { name: "Bemor og'irligi", value: "250 kg gacha" },
    { name: "Kafolat", value: "2 yil" },
    { name: "Ishlab chiqaruvchi", value: "Philips (Niderlandiya)" }
  ]
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  return (
    <div className="container" style={{ padding: "24px 16px" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
        <Link href="/">Bosh sahifa</Link>
        <ChevronRight size={16} />
        <Link href="#">Katta uskunalar</Link>
        <ChevronRight size={16} />
        <Link href="#">MRT apparatlari</Link>
        <ChevronRight size={16} />
        <span style={{ color: "var(--text-main)" }}>Philips Achieva 1.5T</span>
      </div>

      <div className="product-detail-layout">
        {/* Left Side: Images */}
        <div className="product-gallery">
          <div className="main-image-container">
            <Image 
              src={product.image} 
              alt={product.title} 
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="thumbnail-list">
            {[1, 2, 3].map((item) => (
              <div key={item} className="thumbnail-item">
                <Image 
                  src={product.image} 
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
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>({product.reviews} ta sharh)</span>
          </div>
          
          <h1 className="product-title-large">{product.title}</h1>
          
          <div className="price-section">
            <div className="current-price">{product.price}</div>
            {product.oldPrice && <div className="old-price">{product.oldPrice}</div>}
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
            <button className="btn btn-primary" style={{ flex: 1, padding: "16px", fontSize: "16px" }}>
              Savatchaga qo'shish
            </button>
            <button className="btn btn-secondary" style={{ padding: "16px" }} aria-label="Saralanganlarga qo'shish">
              <Heart size={24} />
            </button>
          </div>

          <div className="specs-section">
            <h3 style={{ marginBottom: "16px" }}>Xususiyatlari</h3>
            <ul className="specs-list">
              {product.specs.map((spec, idx) => (
                <li key={idx} className="spec-item">
                  <span className="spec-name">{spec.name}</span>
                  <span className="spec-value">{spec.value}</span>
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
    </div>
  );
}
