# 📧 Email Bildirishnomalar (Resend)

Email bildirishnomalar uchun [Resend](https://resend.com) API ishlatamiz.

## 1️⃣ Resend Account Yaratish

1. [https://resend.com](https://resend.com) ga kiring
2. **Sign up** qiling (GitHub yoki Google bilan)
3. Email'ni verify qiling

## 2️⃣ API Key Olish

1. Dashboard'da **API Keys** bo'limiga o'ting
2. **Create API Key** tugmasini bosing
3. Key name: `MedSupply Production`
4. Permission: **Full Access** (yoki **Sending access**)
5. **Create** bosing
6. API Key'ni copy qiling (faqat bir marta ko'rsatiladi!)

## 3️⃣ Environment Variables

`.env.local` faylida:

```env
# Resend API
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Email settings
EMAIL_FROM=noreply@medsupply.uz
```

**Muhim:** `.env.local` faylini `.gitignore` ga qo'shing!

## 4️⃣ Dependencies O'rnatish

```bash
npm install resend
```

## 5️⃣ Domain Sozlash (Production uchun)

### Free tier (Testing):
- `onboarding@resend.dev` dan email yuborishingiz mumkin
- Faqat o'zingizga email yuboriladi

### Production (Custom domain):
1. Resend dashboard'da **Domains** bo'limiga o'ting
2. **Add Domain** tugmasini bosing
3. Domain kiriting: `medsupply.uz`
4. DNS record'larni qo'shing:
   - MX record
   - TXT record (SPF)
   - TXT record (DKIM)
5. Verify qiling

## 6️⃣ Email Template'lar

Loyihada quyidagi email template'lar mavjud:

### Order Confirmation Email
Buyurtma yaratilganda mijozga yuboriladi:
- Buyurtma raqami
- Mahsulotlar ro'yxati
- Jami summa
- Yetkazib berish manzili

### Order Status Update Email
Buyurtma holati o'zgarganda:
- Yangi holat
- Tracking information
- Yetkazib berish vaqti

### Welcome Email (Optional)
Yangi foydalanuvchi ro'yxatdan o'tganda.

## 7️⃣ Test Qilish

### Development:
```bash
# Email yuborish testini ishga tushiring
npm run test:email
```

### Production:
1. Buyurtma yarating
2. Email'ni tekshiring
3. Spam folder'ni ham tekshiring

## 🔒 Xavfsizlik

- API Key'ni hech qachon frontend'da ishlatmang
- Faqat server-side (API routes) ishlatish
- Environment variable'larga saqlang
- Rate limiting qo'ying (100 emails/hour)

## 💰 Narxlar (Resend)

- **Free tier:** 3,000 emails/month
- **Pro:** $20/month - 50,000 emails
- **Enterprise:** Custom pricing

## 📊 Monitoring

Resend dashboard'da:
- Yuborilgan email'lar soni
- Delivery rate
- Bounce rate
- Click rate

## ✅ Checklist

- [ ] Resend account yaratildi
- [ ] API Key olindi
- [ ] `.env.local` ga qo'shildi
- [ ] `npm install resend` bajarildi
- [ ] Test email yuborildi
- [ ] Production domain sozlandi (optional)

## 🐛 Troubleshooting

### "Invalid API Key" xatoligi:
- API Key'ni tekshiring
- `.env.local` faylini restart qiling

### Email kelmayapti:
- Spam folder'ni tekshiring
- Resend dashboard'da logs'ni ko'ring
- Email address to'g'ri kiritilganmi?

### "Rate limit exceeded":
- 1 soatda 100 dan ortiq email yuborilmadi
- Pro plan'ga o'ting

## 📚 Qo'shimcha Ma'lumotlar

- [Resend Documentation](https://resend.com/docs)
- [Resend React Email](https://react.email)
- [Resend Status](https://status.resend.com)
