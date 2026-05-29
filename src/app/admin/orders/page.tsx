"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Clock, CheckCircle, Eye, Search, Filter, X, Truck, Ban, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  final_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  shipping_address: string;
  shipping_city: string;
  user_id?: string;
}

interface OrderItem {
  id: number;
  product_title: string;
  product_image_url: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user || !session.user.email?.toLowerCase().includes("admin")) {
      router.push("/auth");
      return;
    }

    await fetchOrders();
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);

    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (!error && data) {
      setOrderItems(data);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!selectedOrder) return;

    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", selectedOrder.id);

      if (error) throw error;

      await supabase.from("order_status_history").insert({
        order_id: selectedOrder.id,
        status: newStatus,
        notes: `Status o'zgartirildi: ${newStatus}`,
      });

      const statusLabels: Record<string, string> = {
        pending: "Kutilmoqda",
        processing: "Jarayonda",
        shipped: "Yetkazilmoqda",
        delivered: "Yetkazildi",
        cancelled: "Bekor qilindi",
      };

      if (selectedOrder.user_id) {
        await supabase.from("notifications").insert({
          user_id: selectedOrder.user_id,
          title: `Buyurtma holati yangilandi`,
          message: `${selectedOrder.order_number} raqamli buyurtmangiz holati: "${statusLabels[newStatus] || newStatus}"`,
          type: "order",
          link: "/profile?tab=orders",
        });
      }

      toast.success("Buyurtma holati yangilandi!");
      setShowOrderModal(false);
      fetchOrders();
    } catch (error: any) {
      toast.error("Xatolik: " + error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending: { label: "Kutilmoqda", icon: Clock, color: "var(--warning)", bgColor: "var(--warning-light)" },
      processing: { label: "Jarayonda", icon: Package, color: "var(--primary)", bgColor: "var(--primary-light)" },
      shipped: { label: "Yetkazilmoqda", icon: Truck, color: "#17a2b8", bgColor: "#d1ecf1" },
      delivered: { label: "Yetkazildi", icon: CheckCircle, color: "var(--success)", bgColor: "var(--success-light)" },
      cancelled: { label: "Bekor qilindi", icon: Ban, color: "var(--danger)", bgColor: "var(--danger-light)" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "var(--radius-sm)",
          fontSize: "12px",
          fontWeight: 600,
          backgroundColor: config.bgColor,
          color: config.color,
        }}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors: any = {
      pending: { bg: "var(--warning-light)", color: "var(--warning)" },
      paid: { bg: "var(--success-light)", color: "var(--success)" },
      failed: { bg: "var(--danger-light)", color: "var(--danger)" },
    };
    const config = colors[status] || colors.pending;

    return (
      <span
        style={{
          padding: "4px 8px",
          borderRadius: "var(--radius-sm)",
          fontSize: "11px",
          fontWeight: 600,
          backgroundColor: config.bg,
          color: config.color,
          textTransform: "uppercase",
        }}
      >
        {status === "pending" ? "Kutilmoqda" : status === "paid" ? "To'landi" : "Xatolik"}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ color: "var(--text-muted)" }}>Yuklanmoqda...</div>
      </div>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Jami buyurtmalar", value: stats.total, color: "var(--primary)" },
          { label: "Kutilmoqda", value: stats.pending, color: "var(--warning)" },
          { label: "Jarayonda", value: stats.processing, color: "var(--primary)" },
          { label: "Yetkazildi", value: stats.delivered, color: "var(--success)" },
        ].map((stat, index) => (
          <div key={index} style={{ backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
              {stat.label}
            </p>
            <h3 style={{ fontSize: "28px", fontWeight: "bold", color: stat.color, margin: 0 }}>
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "var(--radius-lg)", marginBottom: "24px", border: "1px solid var(--border-color)", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
          <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buyurtma raqami, mijoz nomi yoki email..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "44px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Filter size={18} color="var(--text-muted)" />
          <select className="form-input" style={{ width: "auto", minWidth: "150px" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Barcha holat</option>
            <option value="pending">Kutilmoqda</option>
            <option value="processing">Jarayonda</option>
            <option value="shipped">Yetkazilmoqda</option>
            <option value="delivered">Yetkazildi</option>
            <option value="cancelled">Bekor qilindi</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-color)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-color)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Buyurtma #</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Mijoz</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Jami summa</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>To'lov</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Holat</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Sana</th>
                <th style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
                    {searchQuery || statusFilter !== "all" ? "Hech narsa topilmadi" : "Hozircha buyurtmalar yo'q"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: "var(--text-main)", fontWeight: 600 }}>{order.order_number}</div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: "var(--text-main)", fontWeight: 500, marginBottom: "4px" }}>{order.customer_name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{order.customer_email}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{order.customer_phone}</div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: "var(--text-main)", fontWeight: 600 }}>{order.final_amount.toLocaleString()} so'm</div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      {getPaymentStatusBadge(order.payment_status)}
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {order.payment_method === "bank_transfer" ? "Pul o'tkazish" : order.payment_method === "click" ? "Click" : order.payment_method === "payme" ? "Payme" : "Karta"}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>{getStatusBadge(order.status)}</td>
                    <td style={{ padding: "16px", color: "var(--text-main)" }}>
                      {new Date(order.created_at).toLocaleDateString("uz-UZ", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          style={{ padding: "8px 12px", backgroundColor: "var(--primary-light)", color: "var(--primary)", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 500 }}
                        >
                          <Eye size={14} />
                          Ko'rish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px", overflow: "auto" }}>
          <div style={{ backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-lg)", maxWidth: "900px", width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "var(--shadow-lg)" }}>
            {/* Modal Header */}
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "20px", color: "var(--text-main)", margin: 0, marginBottom: "4px" }}>
                  Buyurtma #{selectedOrder.order_number}
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
                  {new Date(selectedOrder.created_at).toLocaleString("uz-UZ")}
                </p>
              </div>
              <button onClick={() => setShowOrderModal(false)} style={{ padding: "8px", backgroundColor: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              {/* Customer Info */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>Mijoz ma'lumotlari</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", backgroundColor: "var(--bg-color)", padding: "16px", borderRadius: "var(--radius-md)" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Klinika nomi</div>
                    <div style={{ fontSize: "14px", color: "var(--text-main)", fontWeight: 500 }}>{selectedOrder.customer_name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Email</div>
                    <div style={{ fontSize: "14px", color: "var(--text-main)" }}>{selectedOrder.customer_email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Telefon</div>
                    <div style={{ fontSize: "14px", color: "var(--text-main)" }}>{selectedOrder.customer_phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Manzil</div>
                    <div style={{ fontSize: "14px", color: "var(--text-main)" }}>
                      {selectedOrder.shipping_city}, {selectedOrder.shipping_address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>Mahsulotlar</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orderItems.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: "16px", padding: "12px", backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-md)" }}>
                      <img src={item.product_image_url || "/placeholder.png"} alt={item.product_title} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-main)", marginBottom: "8px" }}>{item.product_title}</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                          {item.quantity} x {item.unit_price.toLocaleString()} so'm
                        </div>
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-main)" }}>{item.subtotal.toLocaleString()} so'm</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)" }}>Jami:</span>
                  <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--primary)" }}>{selectedOrder.final_amount.toLocaleString()} so'm</span>
                </div>
              </div>

              {/* Order Status Update */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "var(--text-main)" }}>Buyurtma holatini o'zgartirish</h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(status)}
                      disabled={updatingStatus || selectedOrder.status === status}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: selectedOrder.status === status ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                        backgroundColor: selectedOrder.status === status ? "var(--primary-light)" : "var(--bg-color)",
                        color: "var(--text-main)",
                        cursor: selectedOrder.status === status || updatingStatus ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        opacity: selectedOrder.status === status || updatingStatus ? 0.6 : 1,
                      }}
                    >
                      {status === "pending" && "Kutilmoqda"}
                      {status === "processing" && "Jarayonda"}
                      {status === "shipped" && "Yetkazilmoqda"}
                      {status === "delivered" && "Yetkazildi"}
                      {status === "cancelled" && "Bekor qilindi"}
                    </button>
                  ))}
                </div>

                <Link href={`/invoice/${selectedOrder.id}`} target="_blank" className="btn btn-secondary" style={{ gap: "8px" }}>
                  <FileText size={18} />
                  Hisob-fakturani ochish (PDF)
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
