"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StatsData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalProducts: number;
  productsChange: number;
  totalCustomers: number;
  customersChange: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminStats() {
  const [stats, setStats] = useState<StatsData>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalProducts: 0,
    productsChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total revenue (all paid orders)
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('final_amount')
        .eq('payment_status', 'paid');

      const totalRevenue = paidOrders?.reduce((sum, order) => sum + Number(order.final_amount), 0) || 0;

      // Get total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get orders from last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const { count: lastMonthOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString());

      // Calculate change percentage
      const ordersChange = lastMonthOrders && totalOrders 
        ? Math.round(((lastMonthOrders / totalOrders) * 100) - 100)
        : 0;

      // Get total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get unique customers count
      const { data: customers } = await supabase
        .from('orders')
        .select('user_id')
        .not('user_id', 'is', null);

      const uniqueCustomers = new Set(customers?.map(c => c.user_id)).size;

      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get top products (most ordered) — barcha order_items'ni olib, keyin guruhlaymiz
      const { data: topProducts } = await supabase
        .from('order_items')
        .select('product_id, product_title, quantity');

      // Aggregate top products
      const productMap: any = {};
      topProducts?.forEach((item) => {
        if (productMap[item.product_id]) {
          productMap[item.product_id].quantity += item.quantity;
        } else {
          productMap[item.product_id] = {
            title: item.product_title,
            quantity: item.quantity,
          };
        }
      });

      const topProductsList = Object.values(productMap)
        .sort((a: any, b: any) => b.quantity - a.quantity)
        .slice(0, 5);

      setStats({
        totalRevenue,
        revenueChange: 12, // Mock data
        totalOrders: totalOrders || 0,
        ordersChange,
        totalProducts: totalProducts || 0,
        productsChange: 5, // Mock data
        totalCustomers: uniqueCustomers,
        customersChange: 8, // Mock data
        recentOrders: recentOrders || [],
        topProducts: topProductsList,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Yuklanmoqda...</div>;
  }

  const statsCards = [
    {
      icon: DollarSign,
      label: "Jami Tushum",
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: stats.revenueChange,
      color: "#f59e0b",
      bgColor: "#fef3c7",
    },
    {
      icon: ShoppingCart,
      label: "Buyurtmalar",
      value: stats.totalOrders,
      change: stats.ordersChange,
      color: "#10b981",
      bgColor: "#d1fae5",
    },
    {
      icon: Package,
      label: "Mahsulotlar",
      value: stats.totalProducts,
      change: stats.productsChange,
      color: "#3b82f6",
      bgColor: "#dbeafe",
    },
    {
      icon: Users,
      label: "Mijozlar",
      value: stats.totalCustomers,
      change: stats.customersChange,
      color: "#8b5cf6",
      bgColor: "#ede9fe",
    },
  ];

  return (
    <div>
      {/* Stats Cards Grid */}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>
                    {stat.label}
                  </p>
                  <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "var(--text-main)", margin: 0 }}>
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
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Top Products */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "24px" 
      }}>
        {/* Recent Orders */}
        <div style={{ 
          backgroundColor: "var(--card-bg)", 
          padding: "24px", 
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border-color)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>
            Oxirgi buyurtmalar
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {stats.recentOrders.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                Hozircha buyurtmalar yo'q
              </p>
            ) : (
              stats.recentOrders.map((order) => (
                <div 
                  key={order.id}
                  style={{ 
                    padding: "12px", 
                    backgroundColor: "var(--bg-color)", 
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-main)" }}>
                      {order.order_number}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {order.customer_name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>
                      {order.final_amount.toLocaleString()} so'm
                    </div>
                    <div style={{ 
                      fontSize: "11px", 
                      color: order.payment_status === 'paid' ? "var(--success)" : "var(--warning)" 
                    }}>
                      {order.payment_status === 'paid' ? "To'landi" : "Kutilmoqda"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div style={{ 
          backgroundColor: "var(--card-bg)", 
          padding: "24px", 
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border-color)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>
            Eng ko'p sotiladigan mahsulotlar
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {stats.topProducts.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                Ma'lumot yo'q
              </p>
            ) : (
              stats.topProducts.map((product: any, index: number) => (
                <div 
                  key={index}
                  style={{ 
                    padding: "12px", 
                    backgroundColor: "var(--bg-color)", 
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-main)" }}>
                      {product.title}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: "14px", 
                    fontWeight: 600, 
                    color: "var(--primary)",
                    padding: "4px 12px",
                    backgroundColor: "var(--primary-light)",
                    borderRadius: "var(--radius-sm)"
                  }}>
                    {product.quantity} dona
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
