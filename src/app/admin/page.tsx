"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  FolderTree, 
  Users, 
  ShoppingCart, 
  Settings,
  LogOut
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminStats from "@/components/AdminStats";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      router.push("/auth");
      return;
    }

    // Check if admin
    if (!session.user.email?.toLowerCase().includes("admin")) {
      router.push("/");
      return;
    }

    setUserEmail(session.user.email || "");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ color: "var(--text-muted)" }}>Yuklanmoqda...</div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
    { icon: Package, label: "Mahsulotlar", href: "/admin/products" },
    { icon: PlusCircle, label: "Yangi mahsulot", href: "/admin/add-product" },
    { icon: FolderTree, label: "Kategoriyalar", href: "/admin/categories" },
    { icon: Users, label: "Adminlar", href: "/admin/admins" },
    { icon: ShoppingCart, label: "Buyurtmalar", href: "/admin/orders" },
    { icon: Settings, label: "Sozlamalar", href: "/admin/settings" },
  ];

  return (
    <div className="admin-shell" style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ 
        width: "280px", 
        backgroundColor: "var(--card-bg)", 
        borderRight: "1px solid var(--border-color)",
        padding: "24px",
        display: "flex",
        flexDirection: "column"
      }}>
        
        <div className="admin-sidebar-head" style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "var(--primary)", marginBottom: "4px" }}>
            MedSupply Admin
          </h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{userEmail}</p>
        </div>

        <nav className="admin-nav" style={{ flex: 1 }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link 
                key={index}
                href={item.href}
                className="admin-nav-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: item.active ? "var(--primary-light)" : "transparent",
                  color: item.active ? "var(--primary)" : "var(--text-main)",
                  marginBottom: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: "14px", fontWeight: item.active ? 600 : 400 }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="admin-logout-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "transparent",
            color: "var(--danger)",
            border: "1px solid var(--danger)",
            cursor: "pointer",
            width: "100%",
            fontSize: "14px",
            fontWeight: 500,
            marginTop: "auto"
          }}
        >
          <LogOut size={20} />
          Chiqish
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main" style={{ flex: 1, padding: "32px", minWidth: 0 }}>
        
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-main)", marginBottom: "8px" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Admin panel'ga xush kelibsiz. Quyidagi statistika va ma'lumotlarni ko'ring.
          </p>
        </div>

        {/* Stats Component */}
        <AdminStats />

        {/* Quick Actions */}
        <div style={{ 
          backgroundColor: "var(--card-bg)", 
          padding: "24px", 
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border-color)"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>
            Tez harakatlar
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/admin/add-product" className="btn btn-primary" style={{ gap: "8px" }}>
              <PlusCircle size={18} />
              Yangi mahsulot qo'shish
            </Link>
            <Link href="/admin/categories" className="btn btn-secondary" style={{ gap: "8px" }}>
              <FolderTree size={18} />
              Kategoriyalarni boshqarish
            </Link>
            <Link href="/admin/products" className="btn btn-secondary" style={{ gap: "8px" }}>
              <Package size={18} />
              Mahsulotlarni ko'rish
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
