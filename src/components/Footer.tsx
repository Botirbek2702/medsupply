import Link from "next/link";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--card-bg)", borderTop: "1px solid var(--border-color)", padding: "48px 0 24px", marginTop: "auto" }}>
      <div className="container">
        <div className="responsive-flex" style={{ display: "flex", justifyContent: "space-between", gap: "32px", marginBottom: "48px" }}>
          
          <div style={{ flex: 1, minWidth: "250px" }}>
            <Link href="/" className="logo" style={{ marginBottom: "16px", display: "inline-flex" }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '8px' }}>
                Med
              </div>
              <span className="logo-text">Supply</span>
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
              Klinikangiz uchun eng sifatli va ishonchli tibbiyot uskunalari. O'zbekiston bo'ylab yetkazib berish va professional texnik servis xizmati.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href="#" style={{ color: "var(--text-muted)" }} aria-label="Telegram"><Send size={24} /></a>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: "200px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>Mijozlar uchun</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "var(--text-muted)" }}>
              <li><a href="#" className="footer-link">Qanday buyurtma beriladi?</a></li>
              <li><a href="#" className="footer-link">To'lov usullari</a></li>
              <li><a href="#" className="footer-link">Yetkazib berish va o'rnatish</a></li>
              <li><a href="#" className="footer-link">Kafolat va qaytarish</a></li>
              <li><a href="#" className="footer-link">Ommaviy oferta</a></li>
            </ul>
          </div>

          <div style={{ flex: 1, minWidth: "200px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>Kompaniya</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "var(--text-muted)" }}>
              <li><a href="#" className="footer-link">Biz haqimizda</a></li>
              <li><a href="#" className="footer-link">Servis markazi</a></li>
              <li><a href="#" className="footer-link">Hamkorlik</a></li>
              <li><a href="#" className="footer-link">Bo'sh ish o'rinlari</a></li>
              <li><a href="#" className="footer-link">Maxfiylik siyosati</a></li>
            </ul>
          </div>

          <div style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>Aloqa</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "var(--text-muted)" }}>
              <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <Phone size={18} color="var(--primary)" />
                <div>
                  <a href="tel:+998901234567" style={{ display: "block", color: "var(--text-main)", fontWeight: 500, fontSize: "16px" }} className="footer-link">+998 90 123 45 67</a>
                  <span style={{ fontSize: "12px" }}>Dush-Shan: 09:00 dan 18:00 gacha</span>
                </div>
              </li>
              <li style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Mail size={18} color="var(--primary)" />
                <a href="mailto:info@medsupply.uz" className="footer-link">info@medsupply.uz</a>
              </li>
              <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span style={{ lineHeight: 1.4 }}>Toshkent sh., Yunusobod tumani, A.Temur ko'chasi, 10-uy</span>
              </li>
            </ul>
          </div>

        </div>

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "var(--text-muted)", flexWrap: "wrap", gap: "16px" }}>
          <div>© 2026 MedSupply UZ. Barcha huquqlar himoyalangan.</div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span style={{ fontWeight: 600 }}>Uzcard</span>
            <span style={{ fontWeight: 600 }}>Humo</span>
            <span style={{ fontWeight: 600 }}>Visa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
