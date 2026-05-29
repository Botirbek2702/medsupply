"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MapPin, CreditCard, Building2, Loader2, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, getTotalPrice, clearCart } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Form state
  const [clinicName, setClinicName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("Toshkent shahri");
  const [district, setDistrict] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [customerNotes, setCustomerNotes] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      alert("Buyurtma berish uchun tizimga kirishingiz kerak!");
      router.push("/auth");
      return;
    }

    setUser(session.user);
    setEmail(session.user.email || "");
    
    // Pre-fill clinic name from user metadata if exists
    if (session.user.user_metadata?.clinic_name) {
      setClinicName(session.user.user_metadata.clinic_name);
    }
  };

  const handlePayWithClick = async (orderId: number) => {
    const CLICK_SERVICE_ID = process.env.NEXT_PUBLIC_CLICK_SERVICE_ID || "demo";
    const CLICK_MERCHANT_ID = process.env.NEXT_PUBLIC_CLICK_MERCHANT_ID || "demo";
    
    const { data: order } = await supabase
      .from('orders')
      .select('final_amount')
      .eq('id', orderId)
      .single();

    if (!order) return;

    const amount = order.final_amount;
    const returnUrl = `${window.location.origin}/profile?tab=orders`;
    
    // Redirect to Click payment page
    const clickUrl = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${amount}&transaction_param=${orderId}&return_url=${returnUrl}`;
    
    window.location.href = clickUrl;
  };

  const handlePayWithPayme = async (orderId: number) => {
    const PAYME_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYME_MERCHANT_ID || "demo";
    
    const { data: order } = await supabase
      .from('orders')
      .select('final_amount')
      .eq('id', orderId)
      .single();

    if (!order) return;

    const amount = Math.round(order.final_amount * 100); // Convert to tiyin
    const returnUrl = `${window.location.origin}/profile?tab=orders`;
    
    // Redirect to Payme payment page
    const paymeUrl = `https://checkout.paycom.uz/${Buffer.from(`m=${PAYME_MERCHANT_ID};ac.order_id=${orderId};a=${amount};c=${returnUrl}`).toString('base64')}`;
    
    window.location.href = paymeUrl;
  };

  const handleSubmitOrder = async () => {
    // Validation
    if (!clinicName || !contactPerson || !phone || !fullAddress) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Savatingiz bo'sh!");
      return;
    }

    setLoading(true);

    try {
      // Calculate totals
      const totalAmount = getTotalPrice();
      const shippingCost = 0; // Free shipping
      const finalAmount = totalAmount + shippingCost;

      // 1. Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: clinicName,
          customer_email: email,
          customer_phone: phone,
          shipping_address: fullAddress,
          shipping_city: district,
          shipping_region: region,
          total_amount: totalAmount,
          shipping_cost: shippingCost,
          final_amount: finalAmount,
          payment_method: paymentMethod,
          payment_status: 'pending',
          status: 'pending',
          customer_notes: customerNotes || null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_title: item.title,
        product_image_url: item.image_url,
        unit_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Update product stock
      for (const item of cartItems) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (product) {
          await supabase
            .from('products')
            .update({ stock: product.stock - item.quantity })
            .eq('id', item.id);
        }
      }

      // 4. Add to order history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderData.id,
          status: 'pending',
          notes: 'Buyurtma yaratildi',
          changed_by: user.id
        });

      // Success! Handle payment
      if (paymentMethod === 'click') {
        // Redirect to Click payment
        await handlePayWithClick(orderData.id);
        clearCart();
      } else if (paymentMethod === 'payme') {
        // Redirect to Payme payment
        await handlePayWithPayme(orderData.id);
        clearCart();
      } else {
        // Bank transfer - no immediate payment
        alert(`✅ Buyurtma muvaffaqiyatli yaratildi!\n\nBuyurtma raqami: ${orderData.order_number}\n\nTez orada sizga shartnoma va schyot-faktura yuboriladi.`);
        clearCart();
        router.push('/profile?tab=orders');
      }

    } catch (error: any) {
      console.error('Order creation error:', error);
      alert("Xatolik yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 16px", textAlign: "center" }}>
        <ShoppingCart size={64} color="var(--text-muted)" style={{ margin: "0 auto 24px" }} />
        <h2 style={{ fontSize: "24px", color: "var(--text-main)", marginBottom: "12px" }}>
          Savatingiz bo'sh
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
          Buyurtma berish uchun avval mahsulotlarni savatchaga qo'shing
        </p>
        <Link href="/" className="btn btn-primary">
          Mahsulotlarga qaytish
        </Link>
      </div>
    );
  }
  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/cart" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", display: "flex" }}>
          <ArrowLeft size={20} color="var(--text-main)" />
        </Link>
        <h1 style={{ fontSize: "24px", color: "var(--text-main)", margin: 0 }}>Buyurtmani rasmiylashtirish</h1>
      </div>

      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>

        {/* Forms Side */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={20} color="var(--primary)" /> Qabul qiluvchi (Klinika)
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Klinika nomi *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Masalan: Shifo-Nur klinikasi"
                  value={clinicName}
                  onChange={e => setClinicName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">STIR (INN)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="201 123 456"
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ma'sul shaxs (F.I.SH) *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ism va Familiya"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon raqam *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  readOnly
                  style={{ backgroundColor: "var(--bg-color)", cursor: "not-allowed" }}
                />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={20} color="var(--primary)" /> Yetkazib berish manzili
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Viloyat *</label>
                <select 
                  className="form-input"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                >
                  <option>Toshkent shahri</option>
                  <option>Toshkent viloyati</option>
                  <option>Samarqand viloyati</option>
                  <option>Buxoro viloyati</option>
                  <option>Andijon viloyati</option>
                  <option>Farg'ona viloyati</option>
                  <option>Namangan viloyati</option>
                  <option>Qashqadaryo viloyati</option>
                  <option>Surxondaryo viloyati</option>
                  <option>Xorazm viloyati</option>
                  <option>Navoiy viloyati</option>
                  <option>Jizzax viloyati</option>
                  <option>Sirdaryo viloyati</option>
                  <option>Qoraqalpog'iston Respublikasi</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tuman / Shahar *</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="Masalan: Yunusobod tumani"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">To'liq manzil *</label>
              <textarea 
                className="form-input" 
                rows={2} 
                placeholder="Ko'cha, uy raqami, mo'ljal..."
                value={fullAddress}
                onChange={e => setFullAddress(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Qo'shimcha izoh (ixtiyoriy)</label>
              <textarea 
                className="form-input" 
                rows={2} 
                placeholder="Yetkazib berish bo'yicha qo'shimcha ma'lumotlar..."
                value={customerNotes}
                onChange={e => setCustomerNotes(e.target.value)}
              ></textarea>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
                * Katta tibbiyot uskunalari (MRT, Rentgen) uchun aniq manzil va joylashuv ma'lumotlarini kiriting.
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={20} color="var(--primary)" /> To'lov usuli
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", border: `2px solid ${paymentMethod === 'bank_transfer' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: "var(--radius-md)", cursor: "pointer", backgroundColor: paymentMethod === 'bank_transfer' ? 'var(--primary-light)' : 'transparent' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ width: "20px", height: "20px", accentColor: "var(--primary)", marginTop: "2px" }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Pul o'tkazish yo'li bilan (Shartnoma)</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.4 }}>Buyurtma tasdiqlangandan so'ng, sizga shartnoma va schyot-faktura yuboriladi. Moliya bo'limi tomonidan to'lov amalga oshirilgach tovar yetkaziladi.</div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", border: `2px solid ${paymentMethod === 'click' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: "var(--radius-md)", cursor: "pointer", backgroundColor: paymentMethod === 'click' ? 'var(--primary-light)' : 'transparent' }}>
                <input 
                  type="radio" 
                  name="payment"
                  value="click"
                  checked={paymentMethod === 'click'}
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ width: "20px", height: "20px", accentColor: "var(--primary)", marginTop: "2px" }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                    Click to'lov tizimi
                    <span style={{ fontSize: "20px" }}>💳</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.4 }}>Uzcard, Humo yoki xalqaro kartalari orqali onlayn to'lov</div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", border: `2px solid ${paymentMethod === 'payme' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: "var(--radius-md)", cursor: "pointer", backgroundColor: paymentMethod === 'payme' ? 'var(--primary-light)' : 'transparent' }}>
                <input 
                  type="radio" 
                  name="payment"
                  value="payme"
                  checked={paymentMethod === 'payme'}
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ width: "20px", height: "20px", accentColor: "var(--primary)", marginTop: "2px" }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                    Payme
                    <span style={{ fontSize: "20px" }}>💰</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.4 }}>Payme ilovasi yoki kartalari orqali tez va xavfsiz to'lov</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary Side */}
        <div style={{ width: "350px", backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", position: "sticky", top: "100px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>Jami buyurtma</h2>

          {/* Cart Items */}
          <div style={{ marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-main)", marginBottom: "4px", lineHeight: 1.3 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {item.quantity} x {item.price.toLocaleString()} so'm
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-main)", marginTop: "4px" }}>
                    {(item.price * item.quantity).toLocaleString()} so'm
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
            <span>Mahsulotlar ({cartItems.length}):</span>
            <span>{getTotalPrice().toLocaleString()} so'm</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
            <span>Yetkazib berish:</span>
            <span style={{ color: "var(--success)" }}>Bepul</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
            <span>QQS (12%):</span>
            <span>Ichida</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", margin: "24px 0", paddingTop: "24px", borderTop: "1px solid var(--border-color)", fontWeight: 700, fontSize: "20px", color: "var(--text-main)" }}>
            <span>To'lash uchun:</span>
            <span>{getTotalPrice().toLocaleString()} so'm</span>
          </div>

          <button 
            onClick={handleSubmitOrder}
            disabled={loading}
            className="btn btn-primary" 
            style={{ 
              width: "100%", 
              padding: "16px", 
              fontSize: "16px", 
              marginBottom: "12px", 
              display: "flex", 
              gap: "8px", 
              justifyContent: "center",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Yuklanmoqda...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Buyurtmani tasdiqlash
              </>
            )}
          </button>

          <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
            Tasdiqlash tugmasini bosish orqali elektron shartnoma shakllantiriladi.
          </div>
        </div>

      </div>
    </div>
  );
}
