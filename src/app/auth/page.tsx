"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: "450px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "32px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <Link href="/" style={{ padding: "8px", backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", display: "flex" }}>
            <ArrowLeft size={20} color="var(--text-main)" />
          </Link>
          <h1 style={{ fontSize: "24px", color: "var(--text-main)", margin: 0 }}>Xush kelibsiz</h1>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", marginBottom: "24px" }}>
          <button 
            style={{ flex: 1, padding: "12px 0", fontWeight: 600, borderBottom: activeTab === "login" ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === "login" ? "var(--primary)" : "var(--text-muted)", backgroundColor: "transparent" }}
            onClick={() => setActiveTab("login")}
          >
            Kirish
          </button>
          <button 
            style={{ flex: 1, padding: "12px 0", fontWeight: 600, borderBottom: activeTab === "register" ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === "register" ? "var(--primary)" : "var(--text-muted)", backgroundColor: "transparent" }}
            onClick={() => setActiveTab("register")}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {activeTab === "login" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Telefon raqam</label>
              <input type="tel" className="form-input" placeholder="+998 (__) ___-__-__" />
            </div>
            <div className="form-group">
              <label className="form-label">Parol</label>
              <input type="password" className="form-input" placeholder="Parolni kiriting" />
            </div>
            <Link href="#" style={{ fontSize: "14px", color: "var(--primary)", textAlign: "right" }}>Parolni unutdingizmi?</Link>
            
            <Link href="/profile" style={{ width: "100%", display: "block" }}>
              <button className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "8px" }}>
                Tizimga kirish
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Klinika (Tashkilot) nomi</label>
              <input type="text" className="form-input" placeholder="Masalan: Shifo-Nur klinikasi" />
            </div>
            <div className="form-group">
              <label className="form-label">STIR (INN) yoki Litsenziya raqami</label>
              <input type="text" className="form-input" placeholder="Yuridik shaxs INNsi" />
            </div>
            <div className="form-group">
              <label className="form-label">Telefon raqam</label>
              <input type="tel" className="form-input" placeholder="+998 (__) ___-__-__" />
            </div>
            <div className="form-group">
              <label className="form-label">Parol o'rnating</label>
              <input type="password" className="form-input" placeholder="Kamida 6 ta belgi" />
            </div>
            
            <Link href="/profile" style={{ width: "100%", display: "block" }}>
              <button className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "8px" }}>
                Ro'yxatdan o'tish
              </button>
            </Link>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "8px" }}>
              Tugmani bosish orqali siz Ommaviy oferta shartlariga rozilik bildirasiz.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
