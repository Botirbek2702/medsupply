"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, CheckCircle, Truck, User, Bell, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"orders" | "details" | "notifications" | "settings">("orders");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
      } else {
        setUserData(session.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <div className="container" style={{ padding: "64px 16px", textAlign: "center" }}>Yuklanmoqda...</div>;
  }

  if (!userData) return null;

  const clinicName = userData.user_metadata?.clinic_name || "Klinika nomi kiritilmagan";
  const stir = userData.user_metadata?.stir || "STIR kiritilmagan";

  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--text-main)" }}>Mening Kabinetim</h1>
      
      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Sidebar */}
        <div style={{ width: "250px", backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", position: "sticky", top: "100px" }}>
          <div style={{ paddingBottom: "16px", borderBottom: "1px solid var(--border-color)", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "var(--text-main)", fontSize: "18px", wordBreak: "break-word" }}>
              {userData.email}
            </h3>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
              {clinicName}
            </span>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: "16px", listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <button 
                onClick={() => setActiveTab("orders")}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: activeTab === "orders" ? "var(--primary)" : "var(--text-main)", fontWeight: activeTab === "orders" ? 600 : 400, display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}
              >
                <Package size={18} /> Buyurtmalarim
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("details")}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: activeTab === "details" ? "var(--primary)" : "var(--text-main)", fontWeight: activeTab === "details" ? 600 : 400, display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}
              >
                <User size={18} /> Shaxsiy ma'lumotlar
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("notifications")}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: activeTab === "notifications" ? "var(--primary)" : "var(--text-main)", fontWeight: activeTab === "notifications" ? 600 : 400, display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between", fontSize: "16px" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Bell size={18} /> Xabarnomalar</span>
                <span style={{ backgroundColor: "var(--danger)", color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "12px" }}>2</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("settings")}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: activeTab === "settings" ? "var(--primary)" : "var(--text-main)", fontWeight: activeTab === "settings" ? 600 : 400, display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}
              >
                <Settings size={18} /> Sozlamalar
              </button>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", fontWeight: 500, fontSize: "16px" }}
              >
                <LogOut size={18} /> Chiqish
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          
          {activeTab === "orders" && (
            <div>
              <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "var(--text-main)" }}>Joriy buyurtmalar (Demo)</h2>
              
              <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Buyurtma №4892</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "14px", marginLeft: "12px" }}>Bugun</span>
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
                    <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>To'lov usuli: Shartnoma (Qabul qilingan)</span>
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
                  <div style={{ width: "60px", height: "60px", backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          )}

          {activeTab === "details" && (
            <div style={{ backgroundColor: "var(--card-bg)", padding: "32px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "24px", color: "var(--text-main)" }}>Shaxsiy ma'lumotlar</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "500px" }}>
                <div className="form-group">
                  <label className="form-label">Email manzil</label>
                  <input type="text" className="form-input" value={userData.email} disabled style={{ backgroundColor: "var(--bg-color)" }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Klinika / Tashkilot nomi</label>
                  <input type="text" className="form-input" value={clinicName} disabled style={{ backgroundColor: "var(--bg-color)" }} />
                </div>
                <div className="form-group">
                  <label className="form-label">STIR yoki Litsenziya</label>
                  <input type="text" className="form-input" value={stir} disabled style={{ backgroundColor: "var(--bg-color)" }} />
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "8px" }}>
                  * Ushbu ma'lumotlarni o'zgartirish uchun adminga murojaat qiling.
                </div>
              </div>
            </div>
          )}

          {(activeTab === "notifications" || activeTab === "settings") && (
            <div style={{ backgroundColor: "var(--card-bg)", padding: "64px 32px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <div style={{ marginBottom: "16px", opacity: 0.2, display: "flex", justifyContent: "center" }}>
                {activeTab === "notifications" ? <Bell size={64} /> : <Settings size={64} />}
              </div>
              <h2 style={{ fontSize: "24px", marginBottom: "8px", color: "var(--text-main)" }}>Tez orada...</h2>
              <p style={{ color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>
                Bu bo'lim hozirda ishlab chiqilmoqda. Tez orada siz bu yerdan to'liq foydalana olasiz!
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
