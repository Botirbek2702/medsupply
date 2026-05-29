"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_region: string;
  total_amount: number;
  shipping_cost: number;
  final_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: number;
  product_title: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [orderId]);

  const fetchInvoice = async () => {
    setLoading(true);
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderData) {
      setOrder(orderData);
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);
      if (itemsData) setItems(itemsData);
    }
    setLoading(false);
  };

  if (loading) {
    return <div style={{ padding: "64px", textAlign: "center", color: "var(--text-muted)" }}>Yuklanmoqda...</div>;
  }

  if (!order) {
    return (
      <div style={{ padding: "64px", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>Buyurtma topilmadi</p>
        <button onClick={() => router.back()} className="btn btn-secondary">Orqaga</button>
      </div>
    );
  }

  const paymentLabel =
    order.payment_method === "bank_transfer"
      ? "Pul o'tkazish (Shartnoma)"
      : order.payment_method === "click"
      ? "Click"
      : order.payment_method === "payme"
      ? "Payme"
      : "Karta";

  return (
    <div style={{ backgroundColor: "var(--bg-color)", minHeight: "100vh", padding: "24px 16px" }}>
      {/* Action bar - hidden when printing */}
      <div
        className="no-print"
        style={{
          maxWidth: "800px",
          margin: "0 auto 20px",
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => router.back()} className="btn btn-secondary" style={{ gap: "8px" }}>
          <ArrowLeft size={18} /> Orqaga
        </button>
        <button onClick={() => window.print()} className="btn btn-primary" style={{ gap: "8px" }}>
          <Printer size={18} /> Chop etish / PDF saqlash
        </button>
      </div>

      {/* Invoice sheet */}
      <div
        id="invoice-sheet"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          color: "#0f172a",
          borderRadius: "12px",
          boxShadow: "var(--shadow-md)",
          padding: "48px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #0958d9", paddingBottom: "24px", marginBottom: "32px" }}>
          <div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#0958d9", letterSpacing: "-0.5px" }}>
              MedSupply <span style={{ color: "#0f172a" }}>UZ</span>
            </div>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
              Tibbiyot texnikalari va uskunalari
            </p>
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px", lineHeight: 1.6 }}>
              Toshkent sh., Mirzo Ulug'bek tumani<br />
              info@medsupply.uz | +998 71 123 45 67
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0, color: "#0f172a" }}>HISOB-FAKTURA</h1>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>№ {order.order_number}</p>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
              Sana: {new Date(order.created_at).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* Bill to */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "32px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "#94a3b8", marginBottom: "8px", letterSpacing: "0.5px" }}>
              Buyurtmachi
            </h3>
            <p style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>{order.customer_name}</p>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
              {order.customer_phone}<br />
              {order.customer_email}
            </p>
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "#94a3b8", marginBottom: "8px", letterSpacing: "0.5px" }}>
              Yetkazib berish manzili
            </h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
              {order.shipping_region}, {order.shipping_city}<br />
              {order.shipping_address}
            </p>
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>№</th>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>Mahsulot</th>
              <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>Soni</th>
              <th style={{ padding: "12px", textAlign: "right", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>Narxi</th>
              <th style={{ padding: "12px", textAlign: "right", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>Jami</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px", fontSize: "14px", color: "#64748b" }}>{idx + 1}</td>
                <td style={{ padding: "12px", fontSize: "14px", color: "#0f172a" }}>{item.product_title}</td>
                <td style={{ padding: "12px", fontSize: "14px", color: "#0f172a", textAlign: "center" }}>{item.quantity}</td>
                <td style={{ padding: "12px", fontSize: "14px", color: "#0f172a", textAlign: "right" }}>{item.unit_price.toLocaleString()}</td>
                <td style={{ padding: "12px", fontSize: "14px", color: "#0f172a", textAlign: "right", fontWeight: 600 }}>{item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
          <div style={{ width: "280px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "14px", color: "#475569" }}>
              <span>Mahsulotlar:</span>
              <span>{order.total_amount.toLocaleString()} so'm</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "14px", color: "#475569" }}>
              <span>Yetkazib berish:</span>
              <span>{order.shipping_cost > 0 ? `${order.shipping_cost.toLocaleString()} so'm` : "Bepul"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", marginTop: "8px", borderTop: "2px solid #0958d9", fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
              <span>Jami:</span>
              <span>{order.final_amount.toLocaleString()} so'm</span>
            </div>
          </div>
        </div>

        {/* Payment status + footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px", borderTop: "1px solid #e2e8f0", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontSize: "13px", color: "#475569" }}>
            <strong>To'lov usuli:</strong> {paymentLabel}<br />
            <strong>To'lov holati:</strong>{" "}
            <span style={{ color: order.payment_status === "paid" ? "#16a34a" : "#f59e0b", fontWeight: 600 }}>
              {order.payment_status === "paid" ? "To'langan" : "Kutilmoqda"}
            </span>
          </div>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#94a3b8" }}>
            Hujjat elektron shakllantirildi<br />
            MedSupply UZ © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
