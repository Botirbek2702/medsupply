"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Auth states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [stir, setStir] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (session.user.email?.toLowerCase().includes("admin")) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Barcha maydonlarni to'ldiring!");
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    setLoading(false);
    
    if (error) {
      alert("Xatolik: " + (error.message.includes("Invalid login") ? "Email yoki parol noto'g'ri" : error.message));
    } else {
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !clinicName) return alert("Barcha asosiy maydonlarni to'ldiring!");
    
    setLoading(true);
    const redirectUrl = email.toLowerCase().includes("admin") 
      ? `${window.location.origin}/admin` 
      : `${window.location.origin}/profile`;

    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          clinic_name: clinicName,
          stir: stir
        },
        emailRedirectTo: redirectUrl
      }
    });
    
    setLoading(false);
    
    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      alert("Muvaffaqiyatli ro'yxatdan o'tdingiz! Iltimos, tizimga kiring.");
      setActiveTab("login");
    }
  };

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
            style={{ flex: 1, padding: "12px 0", fontWeight: 600, borderBottom: activeTab === "login" ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === "login" ? "var(--primary)" : "var(--text-muted)", backgroundColor: "transparent", cursor: "pointer" }}
            onClick={() => setActiveTab("login")}
          >
            Kirish
          </button>
          <button 
            style={{ flex: 1, padding: "12px 0", fontWeight: 600, borderBottom: activeTab === "register" ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === "register" ? "var(--primary)" : "var(--text-muted)", backgroundColor: "transparent", cursor: "pointer" }}
            onClick={() => setActiveTab("register")}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Email manzil</label>
              <input type="email" className="form-input" placeholder="admin@klinka.uz" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Parol</label>
              <input type="password" className="form-input" placeholder="Parolni kiriting" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Link href="#" style={{ fontSize: "14px", color: "var(--primary)", textAlign: "right" }}>Parolni unutdingizmi?</Link>
            
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "8px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Kutilmoqda..." : "Tizimga kirish"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Klinika (Tashkilot) nomi</label>
              <input type="text" className="form-input" placeholder="Masalan: Shifo-Nur klinikasi" value={clinicName} onChange={e => setClinicName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">STIR (INN) yoki Litsenziya raqami</label>
              <input type="text" className="form-input" placeholder="Yuridik shaxs INNsi" value={stir} onChange={e => setStir(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email manzil</label>
              <input type="email" className="form-input" placeholder="info@klinika.uz" value={email} onChange={e => setEmail(e.target.value)} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>* Telefon raqam o'rniga hozircha Email ishlatiladi (SMS tizimi pullik bo'lgani uchun)</span>
            </div>
            <div className="form-group">
              <label className="form-label">Parol o'rnating</label>
              <input type="password" className="form-input" placeholder="Kamida 6 ta belgi" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "8px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Kutilmoqda..." : "Ro'yxatdan o'tish"}
            </button>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "8px" }}>
              Tugmani bosish orqali siz Ommaviy oferta shartlariga rozilik bildirasiz.
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
