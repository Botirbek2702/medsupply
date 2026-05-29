"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalFormatted = new Intl.NumberFormat('uz-UZ').format(getTotalPrice()) + " so'm";

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "64px 16px", textAlign: "center", minHeight: "50vh" }}>
        <ShoppingCart size={64} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Savatingiz bo'sh</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Hali hech qanday tibbiyot uskunasi tanlamadingiz.</p>
        <Link href="/">
          <button className="btn btn-primary" style={{ padding: "12px 24px" }}>Bosh sahifaga qaytish</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--text-main)", fontSize: "28px" }}>Savat</h1>
      
      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        
        {/* Cart Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", padding: "24px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
              
              <div style={{ width: "100px", height: "100px", position: "relative", backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-md)" }}>
                <Image src={item.image_url} alt={item.title} fill style={{ objectFit: "contain", padding: "8px" }} />
              </div>
              
              <div style={{ flex: 1, minWidth: "200px" }}>
                <Link href={`/product/${item.id}`} style={{ fontWeight: 500, fontSize: "16px", color: "var(--text-main)", marginBottom: "8px", display: "inline-block" }}>
                  {item.title}
                </Link>
                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Yetkazib berish va o'rnatish bepul</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: "8px 12px", backgroundColor: "var(--card-bg)", borderRight: "1px solid var(--border-color)", cursor: "pointer" }}><Minus size={16} /></button>
                  <span style={{ padding: "0 16px", fontWeight: 500 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: "8px 12px", backgroundColor: "var(--card-bg)", borderLeft: "1px solid var(--border-color)", cursor: "pointer" }}><Plus size={16} /></button>
                </div>
                
                <div style={{ fontWeight: 700, fontSize: "18px", width: "150px", textAlign: "right" }}>
                  {new Intl.NumberFormat('uz-UZ').format(item.price * item.quantity)} so'm
                </div>

                <button onClick={() => removeFromCart(item.id)} style={{ padding: "8px", color: "var(--danger)", backgroundColor: "transparent", cursor: "pointer" }}>
                  <Trash2 size={20} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ width: "350px", backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", position: "sticky", top: "100px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>Buyurtmangiz</h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
            <span>Mahsulotlar soni ({items.reduce((acc, item) => acc + item.quantity, 0)}):</span>
            <span>{totalFormatted}</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
            <span>Yetkazib berish:</span>
            <span style={{ color: "var(--success)" }}>Bepul</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", margin: "24px 0", paddingTop: "24px", borderTop: "1px solid var(--border-color)", fontWeight: 700, fontSize: "20px" }}>
            <span>Jami:</span>
            <span>{totalFormatted}</span>
          </div>

          <Link href="/checkout" style={{ width: "100%", display: "block", marginBottom: "12px" }}>
            <button className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "16px" }}>
              Rasmiylashtirish
            </button>
          </Link>
          
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
            Buyurtmani rasmiylashtirish tugmasini bosish orqali, siz ommaviy oferat shartlariga rozi bo'lasiz.
          </div>
        </div>

      </div>
    </div>
  );
}
