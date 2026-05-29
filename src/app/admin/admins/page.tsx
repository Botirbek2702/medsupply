"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Save, X, Mail, Shield, Trash2, UserCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: any;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const toast = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user || !session.user.email?.toLowerCase().includes("admin")) {
      router.push("/auth");
      return;
    }

    await fetchAdmins();
  };

  const fetchAdmins = async () => {
    setLoading(true);
    
    // Note: Supabase free tier doesn't allow listing all users via JS client
    // We'll need to create a custom table for admin users or use Supabase Admin API
    // For now, we'll show a placeholder message
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdmins([{
          id: user.id,
          email: user.email || "",
          created_at: user.created_at,
          user_metadata: user.user_metadata
        }]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
    
    setLoading(false);
  };

  const handleAddAdmin = async () => {
    if (!newEmail.trim() || !newPassword.trim()) {
      toast.warning("Email va parolni to'ldiring!");
      return;
    }

    if (!newEmail.toLowerCase().includes("admin")) {
      toast.warning("Admin email'da 'admin' so'zi bo'lishi kerak!");
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: {
          data: {
            role: 'admin',
            clinic_name: 'Administrator'
          }
        }
      });

      if (error) throw error;

      toast.success("Yangi admin muvaffaqiyatli qo'shildi! Admin email'ga tasdiqlash xati yuborildi.");
      setShowAddModal(false);
      setNewEmail("");
      setNewPassword("");
      
      // Refresh list
      await fetchAdmins();

    } catch (error: any) {
      console.error(error);
      toast.error("Xatolik: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ color: "var(--text-muted)" }}>Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 16px", maxWidth: "1200px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ color: "var(--text-main)", fontSize: "24px", margin: 0 }}>Adminlar</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
              Tizim adminlarini boshqarish
            </p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: "8px" }}>
          <Plus size={18} />
          Yangi admin qo'shish
        </button>
      </div>

      {/* Info Card */}
      <div style={{
        backgroundColor: "var(--primary-light)",
        padding: "16px",
        borderRadius: "var(--radius-lg)",
        marginBottom: "24px",
        border: "1px solid var(--primary)"
      }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <Shield size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p style={{ fontSize: "14px", color: "var(--text-main)", lineHeight: "1.6", margin: 0 }}>
              <strong>Muhim:</strong> Admin sifatida foydalanuvchi qo'shish uchun email'da "admin" so'zi bo'lishi kerak. 
              Masalan: <code style={{ backgroundColor: "var(--bg-color)", padding: "2px 6px", borderRadius: "4px" }}>admin@klinika.uz</code>
            </p>
          </div>
        </div>
      </div>

      {/* Admins List */}
      <div style={{ 
        backgroundColor: "var(--card-bg)", 
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-color)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-color)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Email
                </th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Rol
                </th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Qo'shilgan sana
                </th>
                <th style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Holat
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    Hozircha adminlar yo'q
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "var(--primary-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--primary)",
                          fontWeight: 600
                        }}>
                          {admin.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: "var(--text-main)", fontWeight: 500 }}>
                            {admin.email}
                          </div>
                          <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                            ID: {admin.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: "var(--primary-light)",
                        color: "var(--primary)"
                      }}>
                        <Shield size={12} style={{ display: "inline", marginRight: "4px" }} />
                        Super Admin
                      </span>
                    </td>
                    <td style={{ padding: "16px", color: "var(--text-main)" }}>
                      {new Date(admin.created_at).toLocaleDateString('uz-UZ', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        backgroundColor: "var(--success-light)",
                        color: "var(--success)"
                      }}>
                        <UserCheck size={12} style={{ display: "inline", marginRight: "4px" }} />
                        Faol
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Note */}
      <div style={{
        marginTop: "24px",
        padding: "16px",
        backgroundColor: "var(--card-bg)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-color)"
      }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
          <strong>Texnik eslatma:</strong> Supabase'ning bepul rejasida barcha foydalanuvchilarni ko'rish chegaralangan. 
          To'liq admin boshqaruv paneli uchun Supabase Admin API yoki maxsus jadval yaratish kerak.
        </p>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "var(--card-bg)",
            padding: "32px",
            borderRadius: "var(--radius-lg)",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "var(--shadow-lg)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", color: "var(--text-main)", margin: 0 }}>
                Yangi admin qo'shish
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ 
                  padding: "8px", 
                  backgroundColor: "transparent", 
                  border: "none", 
                  cursor: "pointer",
                  color: "var(--text-muted)"
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} style={{ display: "inline", marginRight: "8px" }} />
                Email manzil *
              </label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="admin@example.com (admin so'zi majburiy)"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
              <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                Email'da "admin" so'zi bo'lishi shart
              </span>
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Parol *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Kamida 6 ta belgi"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={saving}
              >
                Bekor qilish
              </button>
              <button 
                onClick={handleAddAdmin}
                className="btn btn-primary"
                style={{ flex: 1, gap: "8px", opacity: saving ? 0.7 : 1 }}
                disabled={saving}
              >
                <Save size={18} />
                {saving ? "Qo'shilmoqda..." : "Admin qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
