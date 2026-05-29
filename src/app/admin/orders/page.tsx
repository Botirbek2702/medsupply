"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ color: "var(--text-muted)" }}>Yuklanmoqda...</div>
      </div>
    );
  }

  // Demo data for orders (will be replaced with real data later)
  const demoOrders = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      customer: "Shifo-Nur Klinikasi",
      totalAmount: 45000000,
      status: "pending",
      date: "2024-01-15",
      items: 3
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      customer: "Toshkent Tib Markazi",
      totalAmount: 120000000,
      status: "completed",
      date: "2024-01-14",
      items: 5
    },
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      customer: "Samarqand Diagnostika",
      totalAmount: 78000000,
      status: "processing",
      date: "2024-01-13",
      items: 2
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending: { 
        label: "Kutilmoqda", 
        icon: Clock, 
        color: "var(--warning)", 
        bgColor: "var(--warning-light)" 
      },
      processing: { 
        label: "Jarayonda", 
        icon: Package, 
        color: "var(--primary)", 
        bgColor: "var(--primary-light)" 
      },
      completed: { 
        label: "Bajarildi", 
        icon: CheckCircle, 
        color: "var(--success)", 
        bgColor: "var(--success-light)" 
      },
      cancelled: { 
        label: "Bekor qilindi", 
        icon: XCircle, 
        color: "var(--danger)", 
        bgColor: "var(--danger-light)" 
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "var(--radius-sm)",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: config.bgColor,
        color: config.color
      }}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="container" style={{ padding: "32px 16px", maxWidth: "1400px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ color: "var(--text-main)", fontSize: "24px", margin: 0 }}>Buyurtmalar</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
              Barcha buyurtmalarni boshqarish
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "16px",
        marginBottom: "24px"
      }}>
        {[
          { label: "Jami buyurtmalar", value: "3", color: "var(--primary)" },
          { label: "Kutilmoqda", value: "1", color: "var(--warning)" },
          { label: "Jarayonda", value: "1", color: "var(--primary)" },
          { label: "Bajarildi", value: "1", color: "var(--success)" }
        ].map((stat, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: "var(--card-bg)",
              padding: "20px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-color)"
            }}
          >
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
              {stat.label}
            </p>
            <h3 style={{ fontSize: "28px", fontWeight: "bold", color: stat.color, margin: 0 }}>
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Info Message */}
      <div style={{
        backgroundColor: "var(--primary-light)",
        padding: "16px",
        borderRadius: "var(--radius-lg)",
        marginBottom: "24px",
        border: "1px solid var(--primary)"
      }}>
        <p style={{ fontSize: "14px", color: "var(--text-main)", margin: 0 }}>
          <strong>Ma'lumot:</strong> Bu demo ma'lumotlar. Haqiqiy buyurtmalar tizimi uchun <code style={{ backgroundColor: "var(--bg-color)", padding: "2px 6px", borderRadius: "4px" }}>orders</code> jadvali yaratish va checkout jarayonini to'liq ishga tushirish kerak.
        </p>
      </div>

      {/* Orders Table */}
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
                  Buyurtma #
                </th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Mijoz
                </th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Mahsulotlar
                </th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Jami summa
                </th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Holat
                </th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Sana
                </th>
                <th style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {demoOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ color: "var(--text-main)", fontWeight: 600 }}>
                      {order.orderNumber}
                    </div>
                  </td>
                  <td style={{ padding: "16px", color: "var(--text-main)" }}>
                    {order.customer}
                  </td>
                  <td style={{ padding: "16px", color: "var(--text-main)" }}>
                    {order.items} ta mahsulot
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ color: "var(--text-main)", fontWeight: 600 }}>
                      {order.totalAmount.toLocaleString()} so'm
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    {getStatusBadge(order.status)}
                  </td>
                  <td style={{ padding: "16px", color: "var(--text-main)" }}>
                    {new Date(order.date).toLocaleDateString('uz-UZ')}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button 
                        style={{ 
                          padding: "8px 12px", 
                          backgroundColor: "var(--primary-light)", 
                          color: "var(--primary)",
                          borderRadius: "var(--radius-sm)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          fontWeight: 500
                        }}
                      >
                        <Eye size={14} />
                        Ko'rish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Implementation Guide */}
      <div style={{
        marginTop: "24px",
        padding: "20px",
        backgroundColor: "var(--card-bg)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-color)"
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "var(--text-main)" }}>
          Buyurtmalar tizimini ishga tushirish uchun:
        </h3>
        <ol style={{ paddingLeft: "24px", margin: 0, lineHeight: "1.8", color: "var(--text-muted)" }}>
          <li>Supabase'da <code>orders</code> jadvali yaratish</li>
          <li>Checkout sahifasida buyurtma yaratish funksiyasini qo'shish</li>
          <li>To'lov integratsiyasi (Click, Payme, uzum va h.k.)</li>
          <li>Order tracking (buyurtma kuzatish) tizimi</li>
          <li>Email/SMS bildirishnomalar</li>
        </ol>
      </div>

    </div>
  );
}
