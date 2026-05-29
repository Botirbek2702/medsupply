// Email utility functions using Resend
// Note: This requires RESEND_API_KEY in .env.local

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: string;
}

interface StatusUpdateEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  oldStatus: string;
  newStatus: string;
}

// Order Confirmation Email Template
export function generateOrderConfirmationEmail(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toLocaleString()} so'm</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${(item.price * item.quantity).toLocaleString()} so'm</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buyurtma tasdiqlandi</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f5f7; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a58ca, #084298); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">MedSupply UZ</h1>
              <p style="color: #e7f1ff; margin: 10px 0 0; font-size: 14px;">Tibbiyot texnikalari va uskunalari</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="width: 64px; height: 64px; background-color: #d1e7dd; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#198754" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 style="color: #212529; margin: 0 0 10px; font-size: 24px;">Buyurtma qabul qilindi!</h2>
              <p style="color: #6c757d; margin: 0; font-size: 16px;">Buyurtma raqami: <strong style="color: #0a58ca;">${data.orderNumber}</strong></p>
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #212529; margin: 0 0 15px; font-size: 18px;">Qabul qiluvchi</h3>
                <p style="margin: 5px 0; color: #495057;"><strong>Klinika:</strong> ${data.customerName}</p>
                <p style="margin: 5px 0; color: #495057;"><strong>Yetkazib berish manzili:</strong> ${data.shippingAddress}</p>
              </div>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="color: #212529; margin: 0 0 15px; font-size: 18px;">Buyurtma tarkibi</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; color: #6c757d; text-transform: uppercase;">Mahsulot</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; color: #6c757d; text-transform: uppercase;">Soni</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #6c757d; text-transform: uppercase;">Narxi</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #6c757d; text-transform: uppercase;">Jami</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr>
                    <td colspan="3" style="padding: 16px; text-align: right; font-size: 16px; font-weight: 600; color: #212529;">Jami to'lov:</td>
                    <td style="padding: 16px; text-align: right; font-size: 20px; font-weight: 700; color: #0a58ca;">${data.totalAmount.toLocaleString()} so'm</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 40px;">
              <div style="background-color: #e7f1ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0a58ca;">
                <h3 style="color: #212529; margin: 0 0 10px; font-size: 16px;">📋 Keyingi qadamlar:</h3>
                <ol style="margin: 0; padding-left: 20px; color: #495057; line-height: 1.8;">
                  <li>Tez orada sizga shartnoma va schyot-faktura yuboriladi</li>
                  <li>To'lovni amalga oshiring</li>
                  <li>Mahsulotlar yetkazib beriladi</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6c757d; font-size: 14px;">Savollar bo'lsa, biz bilan bog'laning:</p>
              <p style="margin: 0; color: #495057; font-size: 14px;">
                📧 <a href="mailto:info@medsupply.uz" style="color: #0a58ca; text-decoration: none;">info@medsupply.uz</a> | 
                📞 <a href="tel:+998712345678" style="color: #0a58ca; text-decoration: none;">+998 71 123 45 67</a>
              </p>
              <p style="margin: 15px 0 0; color: #adb5bd; font-size: 12px;">© 2024 MedSupply UZ. Barcha huquqlar himoyalangan.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Order Status Update Email Template
export function generateStatusUpdateEmail(data: StatusUpdateEmailData): string {
  const statusLabels: Record<string, string> = {
    pending: "Kutilmoqda",
    processing: "Jarayonda",
    shipped: "Yetkazilmoqda",
    delivered: "Yetkazildi",
    cancelled: "Bekor qilindi",
  };

  const statusColors: Record<string, string> = {
    pending: "#ffc107",
    processing: "#0a58ca",
    shipped: "#17a2b8",
    delivered: "#198754",
    cancelled: "#dc3545",
  };

  return `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buyurtma holati o'zgarti</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f5f7; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0a58ca, #084298); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">MedSupply UZ</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #212529; margin: 0 0 20px; font-size: 24px;">Buyurtma holati o'zgartirildi</h2>
              <p style="color: #6c757d; margin: 0 0 30px; font-size: 16px;">Buyurtma: <strong style="color: #0a58ca;">${data.orderNumber}</strong></p>
              
              <div style="display: inline-block; background-color: ${statusColors[data.newStatus]}20; padding: 20px 40px; border-radius: 8px; border: 2px solid ${statusColors[data.newStatus]};">
                <p style="margin: 0 0 5px; color: #6c757d; font-size: 14px;">Yangi holat:</p>
                <p style="margin: 0; color: ${statusColors[data.newStatus]}; font-size: 24px; font-weight: 700;">${statusLabels[data.newStatus]}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 40px;">
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                <p style="margin: 0; color: #495057; text-align: center; line-height: 1.6;">
                  ${
                    data.newStatus === "delivered"
                      ? "🎉 Buyurtmangiz muvaffaqiyatli yetkazib berildi! Xizmatimizdan foydalanganingiz uchun rahmat!"
                      : data.newStatus === "shipped"
                      ? "📦 Buyurtmangiz yo'lda! Tez orada sizga yetkaziladi."
                      : data.newStatus === "processing"
                      ? "⚙️ Buyurtmangiz tayyorlanmoqda."
                      : data.newStatus === "cancelled"
                      ? "❌ Buyurtmangiz bekor qilindi. Tafsilotlar uchun biz bilan bog'laning."
                      : "Buyurtmangiz holati yangilandi."
                  }
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6c757d; font-size: 14px;">Savollar bo'lsa:</p>
              <p style="margin: 0; color: #495057; font-size: 14px;">
                📧 <a href="mailto:info@medsupply.uz" style="color: #0a58ca; text-decoration: none;">info@medsupply.uz</a> | 
                📞 <a href="tel:+998712345678" style="color: #0a58ca; text-decoration: none;">+998 71 123 45 67</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send email function (server-side only)
export async function sendEmail(to: string, subject: string, html: string) {
  // This function should be called from API routes only
  // Client-side calls will fail for security reasons
  
  if (typeof window !== "undefined") {
    console.error("sendEmail should only be called from server-side!");
    return { error: "Client-side email sending not allowed" };
  }

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    return { error: "Failed to send email" };
  }
}
