"use client";
import Link from "next/link";
import { Filter, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function SearchPage() {
  const searchResults = [
    { id: 1, title: "Philips Achieva 1.5T MRT apparati - Premium diagnostika", price: "450 000 000", rating: 4.9, image: "/mri_machine_1779796015053.png" },
    { id: 2, title: "Mindray DC-70 Ultratovush (UZI) apparati", price: "120 000 000", rating: 4.8, image: "/media__1779796889813.png" },
    { id: 3, title: "Jarrohlik asboblari to'plami (Premium)", price: "5 500 000", rating: 4.5, image: "/surgical_tools_1779796079137.png" },
    { id: 4, title: "Reanimatsiya yotog'i (Elektron boshqaruvli)", price: "18 000 000", rating: 4.7, image: "/hospital_bed_1779796068522.png" },
  ];

  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--text-main)", fontSize: "24px" }}>
        Qidiruv natijalari: <span style={{ color: "var(--text-muted)" }}>"Diagnostika uskunalari"</span>
      </h1>

      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        
        {/* Sidebar Filters */}
        <div style={{ width: "260px", backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", position: "sticky", top: "100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", fontWeight: 600, fontSize: "18px" }}>
            <Filter size={20} color="var(--primary)" /> Filtrlar
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "15px", marginBottom: "12px", fontWeight: 600 }}>Narx (so'm)</h3>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input type="number" className="form-input" placeholder="dan" style={{ padding: "8px 12px", width: "100%" }} />
              <span style={{ color: "var(--text-muted)" }}>-</span>
              <input type="number" className="form-input" placeholder="gacha" style={{ padding: "8px 12px", width: "100%" }} />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "15px", marginBottom: "12px", fontWeight: 600 }}>Brendlar</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Philips", "Mindray", "Siemens", "GE Healthcare"].map(brand => (
                <label key={brand} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                  <input type="checkbox" style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "15px", marginBottom: "12px", fontWeight: 600 }}>Kategoriya</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["MRT apparatlari", "UZI apparatlari", "Rentgen", "Laboratoriya"].map(cat => (
                <label key={cat} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                  <input type="checkbox" style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          
          <button className="btn btn-primary" style={{ width: "100%", padding: "10px" }}>Qo'llash</button>
        </div>

        {/* Results Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", color: "var(--text-muted)", fontSize: "14px" }}>
            <span>Jami 4 ta mahsulot topildi</span>
            <select className="form-input" style={{ padding: "8px 12px", width: "auto" }}>
              <option>Ommaboplik bo'yicha</option>
              <option>Arzonlari oldin</option>
              <option>Qimmatlari oldin</option>
              <option>Yangi qo'shilganlar</option>
            </select>
          </div>

          <div className="product-grid">
            {searchResults.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <div className="product-card" style={{ height: "100%" }}>
                  <div className="product-image-container">
                    <Image src={product.image} alt={product.title} width={180} height={180} style={{ objectFit: "contain" }} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <div className="product-rating">
                      <Star className="star" fill="currentColor" />
                      <span>{product.rating}</span>
                    </div>
                    <div className="product-footer">
                      <div className="product-price">{product.price} so'm</div>
                      <button className="add-to-cart-btn" onClick={(e) => { e.preventDefault(); }}>
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
