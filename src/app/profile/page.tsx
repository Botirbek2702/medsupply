import { Package, Clock, CheckCircle, Truck } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--text-main)" }}>Mening Kabinetim</h1>
      
      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Sidebar */}
        <div style={{ width: "250px", backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", position: "sticky", top: "100px" }}>
          <div style={{ paddingBottom: "16px", borderBottom: "1px solid var(--border-color)", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "var(--text-main)" }}>Dr. Azamatov</h3>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>"Shifo-Nur" klinikasi</span>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <li><a href="#" style={{ color: "var(--primary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}><Package size={18} /> Buyurtmalarim</a></li>
            <li><a href="#" style={{ color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>Shaxsiy ma'lumotlar</a></li>
            <li><a href="#" style={{ color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between" }}>
              Xabarnomalar 
              <span style={{ backgroundColor: "var(--danger)", color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "12px" }}>2</span>
            </a></li>
            <li><a href="#" style={{ color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>Sozlamalar</a></li>
            <li><a href="#" style={{ color: "var(--danger)", marginTop: "16px", display: "inline-block", fontWeight: 500 }}>Chiqish</a></li>
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "var(--text-main)" }}>Joriy buyurtmalar</h2>
          
          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
              <div>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Buyurtma №4892</span>
                <span style={{ color: "var(--text-muted)", fontSize: "14px", marginLeft: "12px" }}>24-May, 2026</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)", fontWeight: 500 }}>
                <Truck size={18} />
                <span>Yo'lda (Yetkazib berilmoqda)</span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "60px", height: "60px", backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={24} color="var(--text-muted)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: "var(--text-main)" }}>Philips Achieva 1.5T MRT apparati</div>
                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>1 dona</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: "16px", color: "var(--text-main)" }}>
                450 000 000 so'm
              </div>
            </div>
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>To'lov usuli: Pul o'tkazish yo'li bilan (Qabul qilingan)</span>
                <button className="btn btn-secondary">Tafsilotlar</button>
            </div>
          </div>

          <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "var(--text-main)" }}>Buyurtmalar tarixi</h2>
          
          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
              <div>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Buyurtma №4102</span>
                <span style={{ color: "var(--text-muted)", fontSize: "14px", marginLeft: "12px" }}>10-Aprel, 2026</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--success)", fontWeight: 500 }}>
                <CheckCircle size={18} />
                <span>Yetkazib berilgan</span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "60px", height: "60px", backgroundColor: "#f8f9fa", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={24} color="var(--text-muted)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: "var(--text-main)" }}>Jarrohlik uskunalari to'plami</div>
                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>2 dona</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: "16px", color: "var(--text-main)" }}>
                6 400 000 so'm
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
