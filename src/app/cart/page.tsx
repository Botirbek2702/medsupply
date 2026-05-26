import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";

const cartItems = [
  {
    id: 1,
    title: "Philips Achieva 1.5T MRT apparati, yuqori sifatli tasvirlash",
    price: 450000000,
    priceStr: "450 000 000 so'm",
    image: "/images/mri_machine.png",
    quantity: 1,
  },
  {
    id: 3,
    title: "Jarrohlik uskunalari to'plami, zanglamas po'latdan",
    price: 3200000,
    priceStr: "3 200 000 so'm",
    image: "/images/surgical_tools.png",
    quantity: 2,
  }
];

export default function CartPage() {
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalFormatted = new Intl.NumberFormat('uz-UZ').format(totalPrice) + " so'm";

  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--text-main)", fontSize: "28px" }}>Savat</h1>
      
      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        
        {/* Cart Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: "flex", padding: "24px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", gap: "24px", alignItems: "center" }}>
              
              <div style={{ width: "100px", height: "100px", position: "relative", backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-md)" }}>
                <Image src={item.image} alt={item.title} fill style={{ objectFit: "contain", padding: "8px" }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <Link href={`/product/${item.id}`} style={{ fontWeight: 500, fontSize: "16px", color: "var(--text-main)", marginBottom: "8px", display: "inline-block" }}>
                  {item.title}
                </Link>
                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Yetkazib berish va o'rnatish bepul</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                  <button style={{ padding: "8px 12px", backgroundColor: "var(--card-bg)", borderRight: "1px solid var(--border-color)", cursor: "pointer" }}><Minus size={16} /></button>
                  <span style={{ padding: "0 16px", fontWeight: 500 }}>{item.quantity}</span>
                  <button style={{ padding: "8px 12px", backgroundColor: "var(--card-bg)", borderLeft: "1px solid var(--border-color)", cursor: "pointer" }}><Plus size={16} /></button>
                </div>
                
                <div style={{ fontWeight: 700, fontSize: "18px", width: "150px", textAlign: "right" }}>
                  {item.priceStr}
                </div>

                <button style={{ padding: "8px", color: "var(--danger)", backgroundColor: "transparent" }}>
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
            <span>Mahsulotlar soni ({cartItems.length}):</span>
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
