sb_publishable_oNCAI5RvTHVjaG4oWrMQ2Q_HPBloLftimport Link from "next/link";
import { ArrowLeft, CheckCircle, MapPin, CreditCard, Building2 } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/cart" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", display: "flex" }}>
          <ArrowLeft size={20} color="var(--text-main)" />
        </Link>
        <h1 style={{ fontSize: "24px", color: "var(--text-main)", margin: 0 }}>Buyurtmani rasmiylashtirish</h1>
      </div>

      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>

        {/* Forms Side */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={20} color="var(--primary)" /> Qabul qiluvchi (Klinika)
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Klinika nomi</label>
                <input type="text" className="form-input" defaultValue="Shifo-Nur klinikasi" />
              </div>
              <div className="form-group">
                <label className="form-label">STIR (INN)</label>
                <input type="text" className="form-input" defaultValue="201 123 456" />
              </div>
              <div className="form-group">
                <label className="form-label">Ma'sul shaxs (F.I.SH)</label>
                <input type="text" className="form-input" placeholder="Ism va Familiya" />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon raqam</label>
                <input type="tel" className="form-input" defaultValue="+998 90 123 45 67" />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={20} color="var(--primary)" /> Yetkazib berish manzili
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Viloyat</label>
                <select className="form-input">
                  <option>Toshkent shahri</option>
                  <option>Toshkent viloyati</option>
                  <option>Samarqand viloyati</option>
                  <option>Buxoro viloyati</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tuman / Shahar</label>
                <select className="form-input">
                  <option>Yunusobod tumani</option>
                  <option>Chilonzor tumani</option>
                  <option>Mirzo Ulug'bek tumani</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">To'liq manzil</label>
              <textarea className="form-input" rows={2} placeholder="Ko'cha, uy raqami, mo'ljal..."></textarea>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label className="form-label">Xaritadagi joylashuv (Klinika qayerda joylashgan?)</label>
              <div style={{ width: "100%", height: "250px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-color)" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.823932822709!2d69.2774966!3d41.3262692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b4712852e93%3A0x6b0fb5c5f40e1075!2sTashkent%20Medical%20Academy!5e0!3m2!1sen!2s!4v1716723485000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Xarita"
                ></iframe>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
                * Xaritadan aniq joylashuvni belgilang. Katta tibbiyot uskunalari (MRT, Rentgen)ni o'rnatish uchun aniq manzil kerak.
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={20} color="var(--primary)" /> To'lov usuli
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", border: "1px solid var(--primary)", borderRadius: "var(--radius-md)", cursor: "pointer", backgroundColor: "var(--bg-color)" }}>
                <input type="radio" name="payment" defaultChecked style={{ width: "20px", height: "20px", accentColor: "var(--primary)", marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Pul o'tkazish yo'li bilan (Shartnoma)</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.4 }}>Buyurtma tasdiqlangandan so'ng, sizga shartnoma va schyot-faktura yuboriladi. Moliya bo'limi tomonidan to'lov amalga oshirilgach tovar yetkaziladi.</div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
                <input type="radio" name="payment" style={{ width: "20px", height: "20px", accentColor: "var(--primary)", marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Korporativ karta orqali</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.4 }}>Uzcard yoki Humo korporativ kartalari orqali onlayn to'lov qilish imkoniyati.</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary Side */}
        <div style={{ width: "350px", backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", position: "sticky", top: "100px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>Jami buyurtma</h2>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
            <span>Mahsulotlar (3):</span>
            <span>453 200 000 so'm</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
            <span>Yetkazib berish:</span>
            <span style={{ color: "var(--success)" }}>Bepul</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
            <span>QQS (12%):</span>
            <span>Ichida</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", margin: "24px 0", paddingTop: "24px", borderTop: "1px solid var(--border-color)", fontWeight: 700, fontSize: "20px", color: "var(--text-main)" }}>
            <span>To'lash uchun:</span>
            <span>453 200 000 so'm</span>
          </div>

          <Link href="/profile" style={{ width: "100%", display: "block" }}>
            <button className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "16px", marginBottom: "12px", display: "flex", gap: "8px", justifyContent: "center" }}>
              <CheckCircle size={20} />
              Buyurtmani tasdiqlash
            </button>
          </Link>

          <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
            Tasdiqlash tugmasini bosish orqali elektron shartnoma shakllantiriladi.
          </div>
        </div>

      </div>
    </div>
  );
}
