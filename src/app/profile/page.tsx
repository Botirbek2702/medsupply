"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, CheckCircle, Truck, User, Bell, Settings, LogOut, Clock, Ban, Eye, X, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Order {
  id: number;
  order_number: string;
  final_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: string;
  customer_notes: string | null;
}

interface OrderItem {
  id: number;
  product_title: string;
  product_image_url: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";
  
  const [activeTab, setActiveTab] = useState<"orders" | "details" | "notifications" | "settings">(initialTab as any);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
      } else {
        setUserData(session.user);
        await fetchOrders(session.user.id);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);

    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (!error && data) {
      setOrderItems(data);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending: { label: "Kutilmoqda", icon: Clock, color: "var(--warning)" },
      processing: { label: "Jarayonda", icon: Package, color: "var(--primary)" },
      shipped: { label: "Yetkazilmoqda", icon: Truck, color: "#17a2b8" },
      delivered: { label: "Yetkazildi", icon: CheckCircle, color: "var(--success)" },
      cancelled: { label: "Bekor qilindi", icon: Ban, color: "var(--danger)" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: config.color, fontWeight: 500 }}>
        <Icon size={18} />
        <span>{config.label}</span>
      </div>
    );
  };

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
              <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "var(--text-main)" }}>
                Buyurtmalarim ({orders.length})
              </h2>
              
              {orders.length === 0 ? (
                <div style={{ 
                  backgroundColor: "var(--card-bg)", 
                  padding: "64px 24px", 
                  borderRadius: "var(--radius-lg)", 
                  boxShadow: "var(--shadow-sm)",
                  textAlign: "center"
                }}>
                  <Package size={64} color="var(--text-muted)" style={{ opacity: 0.3, margin: "0 auto 16px" }} />
                  <h3 style={{ fontSize: "20px", color: "var(--text-main)", marginBottom: "8px" }}>
                    Hozircha buyurtmalar yo'q
                  </h3>
                  <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
                    Mahsulotlarni ko'rib chiqing va birinchi buyurtmangizni bering
                  </p>
                  <button 
                    onClick={() => router.push('/')}
                    className="btn btn-primary"
                  >
                    Mahsulotlarga o'tish
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      style={{ 
                        backgroundColor: "var(--card-bg)", 
                        padding: "24px", 
                        borderRadius: "var(--radius-lg)", 
                        boxShadow: "var(--shadow-sm)" 
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        marginBottom: "16px", 
                        paddingBottom: "16px", 
                        borderBottom: "1px solid var(--border-color)",
                        flexWrap: "wrap",
                        gap: "12px"
                      }}>
                        <div>
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                            Buyurtma #{order.order_number}
                          </span>
                          <span style={{ color: "var(--text-muted)", fontSize: "14px", marginLeft: "12px" }}>
                            {new Date(order.created_at).toLocaleDateString('uz-UZ', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                          <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px" }}>
                            Jami summa
                          </div>
                          <div style={{ fontWeight: 600, fontSize: "18px", color: "var(--text-main)" }}>
                            {order.final_amount.toLocaleString()} so'm
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: order.payment_status === 'paid' ? "var(--success)" : "var(--warning)",
                            marginTop: "4px"
                          }}>
                            To'lov: {order.payment_status === 'paid' ? "To'landi" : "Kutilmoqda"}
                          </div>
                        </div>
                        <button 
                          onClick={() => viewOrderDetails(order)}
                          className="btn btn-secondary"
                          style={{ gap: "8px" }}
                        >
                          <Eye size={16} />
                          Tafsilotlar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
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
          padding: "16px",
          overflow: "auto"
        }}>
          <div style={{
            backgroundColor: "var(--card-bg)",
            borderRadius: "var(--radius-lg)",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "var(--shadow-lg)"
          }}>
            <div style={{ 
              padding: "24px", 
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: "20px", color: "var(--text-main)", margin: 0, marginBottom: "4px" }}>
                  Buyurtma #{selectedOrder.order_number}
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
                  {new Date(selectedOrder.created_at).toLocaleString('uz-UZ')}
                </p>
              </div>
              <button 
                onClick={() => setShowOrderModal(false)}
                style={{ 
                  padding: "8px", 
                  backgroundColor: "transparent", 
                  border: "none", 
                  cursor: "pointer",
                  color: "var(--text-muted)"
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Status */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "var(--text-main)" }}>
                  Buyurtma holati
                </h3>
                {getStatusBadge(selectedOrder.status)}
                <div style={{ 
                  marginTop: "8px", 
                  fontSize: "13px", 
                  color: selectedOrder.payment_status === 'paid' ? "var(--success)" : "var(--warning)" 
                }}>
                  To'lov: {selectedOrder.payment_status === 'paid' ? "To'landi ✓" : "Kutilmoqda"}
                </div>
              </div>

              {/* Shipping Address */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "var(--text-main)" }}>
                  Yetkazib berish manzili
                </h3>
                <div style={{ 
                  backgroundColor: "var(--bg-color)", 
                  padding: "16px", 
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  color: "var(--text-main)"
                }}>
                  {selectedOrder.shipping_address}
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "var(--text-main)" }}>
                  Mahsulotlar
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orderItems.map((item) => (
                    <div key={item.id} style={{ 
                      display: "flex", 
                      gap: "16px", 
                      padding: "12px",
                      backgroundColor: "var(--bg-color)",
                      borderRadius: "var(--radius-md)"
                    }}>
                      <img 
                        src={item.product_image_url || "/placeholder.png"} 
                        alt={item.product_title}
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-main)", marginBottom: "4px" }}>
                          {item.product_title}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                          {item.quantity} x {item.unit_price.toLocaleString()} so'm
                        </div>
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-main)" }}>
                        {item.subtotal.toLocaleString()} so'm
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "2px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)" }}>Jami:</span>
                  <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--primary)" }}>
                    {selectedOrder.final_amount.toLocaleString()} so'm
                  </span>
                </div>
              </div>

              {/* Invoice link */}
              <Link
                href={`/invoice/${selectedOrder.id}`}
                target="_blank"
                className="btn btn-secondary"
                style={{ gap: "8px", marginBottom: "24px" }}
              >
                <FileText size={18} />
                Hisob-fakturani yuklab olish (PDF)
              </Link>

              {/* Customer Notes */}
              {selectedOrder.customer_notes && (
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "var(--text-main)" }}>
                    Izohlar
                  </h3>
                  <div style={{ 
                    backgroundColor: "var(--bg-color)", 
                    padding: "16px", 
                    borderRadius: "var(--radius-md)",
                    fontSize: "14px",
                    color: "var(--text-main)",
                    fontStyle: "italic"
                  }}>
                    {selectedOrder.customer_notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
