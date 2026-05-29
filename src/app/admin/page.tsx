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
  LogOut,
  TrendingUp,
  DollarSign,
  ShoppingBag
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    checkAuth();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      // Get products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get categories count
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalProducts: productsCount || 0,
        totalCategories: categoriesCount || 0,
        totalOrders: 0, // To'ldiriladi orders jadvali yaratilganda
        totalRevenue: 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
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

  const statsCards = [
    { 
      icon: Package, 
      label: "Jami Mahsulotlar", 
      value: stats.totalProducts, 
      color: "#3b82f6",
      bgColor: "#dbeafe"
    },
    { 
      icon: FolderTree, 
      label: "Kategoriyalar", 
      value: stats.totalCategories, 
      color: "#8b5cf6",
      bgColor: "#ede9fe"
    },
    { 
      icon: ShoppingBag, 
      label: "Buyurtmalar", 
      value: stats.totalOrders, 
      color: "#10b981",
      bgColor: "#d1fae5"
    },
    { 
      icon: DollarSign, 
      label: "Jami Tushum", 
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`, 
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      
      {/* Sidebar */}
      <div style={{ 
        width: "280px", 
        backgroundColor: "var(--card-bg)", 
        borderRight: "1px solid var(--border-color)",
        padding: "24px",
        display: "flex",
        flexDirection: "column"
      }}>
        
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "var(--primary)", marginBottom: "4px" }}>
            MedSupply Admin
          </h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{userEmail}</p>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link 
                key={index}
                href={item.href}
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
                  transition: "all 0.2s"
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
      <div style={{ flex: 1, padding: "32px" }}>
        
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-main)", marginBottom: "8px" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Admin panel'ga xush kelibsiz. Quyidagi statistika va ma'lumotlarni ko'ring.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "24px",
          marginBottom: "32px"
        }}>
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                style={{
                  backgroundColor: "var(--card-bg)",
                  padding: "24px",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid var(--border-color)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>
                      {stat.label}
                    </p>
                    <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "var(--text-main)" }}>
                      {stat.value}
                    </h2>
                  </div>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon size={24} color={stat.color} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--success)" }}>
                  <TrendingUp size={16} />
                  <span>+12% o'tgan oyga nisbatan</span>
                </div>
              </div>
            );
          })}
        </div>

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
