"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Globe, Mail, Phone, MapPin, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [siteName, setSiteName] = useState("MedSupply UZ");
  const [siteDescription, setSiteDescription] = useState("Tibbiyot texnikalari va uskunalari");
  const [contactEmail, setContactEmail] = useState("info@medsupply.uz");
  const [contactPhone, setContactPhone] = useState("+998 71 123 45 67");
  const [address, setAddress] = useState("Toshkent shahar, Mirzo Ulug'bek tumani");
  const [currency, setCurrency] = useState("UZS");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user || !session.user.email?.toLowerCase().includes("admin")) {
      router.push("/auth");
      return;
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate saving (in real app, save to database or config)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert("Sozlamalar muvaffaqiyatli saqlandi! ✅");
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ color: "var(--text-muted)" }}>Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 16px", maxWidth: "1000px" }}>
      
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/admin" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ color: "var(--text-main)", fontSize: "24px", margin: 0 }}>Sozlamalar</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Sayt va tizim sozlamalarini boshqarish
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* General Settings */}
        <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <Globe size={20} color="var(--primary)" />
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
              Umumiy sozlamalar
            </h2>
          </div>

          <div className="form-group">
            <label className="form-label">Sayt nomi</label>
            <input 
              type="text" 
              className="form-input" 
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginTop: "16px" }}>
            <label className="form-label">Sayt ta'rifi</label>
            <textarea 
              className="form-input" 
              rows={3}
              value={siteDescription}
              onChange={e => setSiteDescription(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginTop: "16px" }}>
            <label className="form-label">Valyuta</label>
            <select 
              className="form-input"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="UZS">UZS - O'zbek so'mi</option>
              <option value="USD">USD - Dollar</option>
              <option value="EUR">EUR - Yevro</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <Phone size={20} color="var(--primary)" />
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
              Aloqa ma'lumotlari
            </h2>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} style={{ display: "inline", marginRight: "8px" }} />
              Email manzil
            </label>
            <input 
              type="email" 
              className="form-input" 
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginTop: "16px" }}>
            <label className="form-label">
              <Phone size={16} style={{ display: "inline", marginRight: "8px" }} />
              Telefon raqam
            </label>
            <input 
              type="tel" 
              className="form-input" 
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginTop: "16px" }}>
            <label className="form-label">
              <MapPin size={16} style={{ display: "inline", marginRight: "8px" }} />
              Manzil
            </label>
            <textarea 
              className="form-input" 
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* System Settings */}
        <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <FileText size={20} color="var(--primary)" />
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
              Tizim sozlamalari
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "16px",
              backgroundColor: "var(--bg-color)",
              borderRadius: "var(--radius-md)"
            }}>
              <div>
                <div style={{ fontWeight: 500, color: "var(--text-main)", marginBottom: "4px" }}>
                  Email bildirishnomalar
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Yangi buyurtmalar haqida email yuborish
                </div>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: "48px", height: "24px" }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "var(--primary)",
                  borderRadius: "24px",
                  transition: ".4s"
                }}></span>
              </label>
            </div>

            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "16px",
              backgroundColor: "var(--bg-color)",
              borderRadius: "var(--radius-md)"
            }}>
              <div>
                <div style={{ fontWeight: 500, color: "var(--text-main)", marginBottom: "4px" }}>
                  Ombor ogohlantirishi
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Mahsulot kamayganida xabar berish
                </div>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: "48px", height: "24px" }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "var(--primary)",
                  borderRadius: "24px",
                  transition: ".4s"
                }}></span>
              </label>
            </div>

            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "16px",
              backgroundColor: "var(--bg-color)",
              borderRadius: "var(--radius-md)"
            }}>
              <div>
                <div style={{ fontWeight: 500, color: "var(--text-main)", marginBottom: "4px" }}>
                  Avtomatik backup
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Ma'lumotlar bazasini kunlik zaxiralash
                </div>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: "48px", height: "24px" }}>
                <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "var(--border-color)",
                  borderRadius: "24px",
                  transition: ".4s"
                }}></span>
              </label>
            </div>

          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ 
            width: "100%", 
            padding: "16px", 
            fontSize: "16px", 
            display: "flex", 
            gap: "8px", 
            justifyContent: "center",
            opacity: saving ? 0.7 : 1
          }}
        >
          <Save size={20} />
          {saving ? "Saqlanmoqda..." : "Barcha o'zgarishlarni saqlash"}
        </button>

        {/* Info */}
        <div style={{
          padding: "16px",
          backgroundColor: "var(--card-bg)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)"
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
            <strong>Eslatma:</strong> Bu sozlamalar hozircha faqat demo rejimida. To'liq ishlaydigan tizim uchun 
            Supabase'da <code>settings</code> jadvali yaratish va backend logikasini qo'shish kerak.
          </p>
        </div>

      </div>

    </div>
  );
}
