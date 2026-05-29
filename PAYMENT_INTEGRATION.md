# 💳 To'lov Integratsiyasi - O'zbekiston

O'zbekiston to'lov tizimlari bilan integratsiya qilish bo'yicha to'liq yo'riqnoma.

## 🏦 Qo'llab-quvvatlanadigan To'lov Tizimlari

### 1. **Click** 
- O'zbekistonda eng mashhur
- Bank kartasi to'lovlari
- Mobile payments

### 2. **Payme**
- Uzcard va Humo kartalari
- QR code to'lovlar
- Mobile app

### 3. **Uzum Bank**
- Yangi va tez o'sib borayotgan
- Nasiya to'lovlar
- QR payments

---

## 🔧 Click Integration

### 1. Merchant Registration
1. [https://my.click.uz](https://my.click.uz) ga kiring
2. Merchant account yarating
3. Hujjatlar taqdim qiling (STIR, Litsenziya)
4. Tasdiqlashni kuting (3-5 kun)

### 2. API Credentials
Click merchant account'dan oling:
- **Merchant ID** (service_id)
- **Secret Key** (merchant_key)
- **User ID** (merchant_user_id)

### 3. Environment Variables
```env
# Click Payment
CLICK_MERCHANT_ID=your_merchant_id
CLICK_SERVICE_ID=your_service_id
CLICK_SECRET_KEY=your_secret_key
CLICK_MERCHANT_USER_ID=your_user_id
```

### 4. Payment Flow

**Step 1: Prepare**
```typescript
// Buyurtma yaratish
const order = await createOrder({...});

// Click payment URL yaratish
const clickUrl = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${order.amount}&transaction_param=${order.id}`;
```

**Step 2: Redirect**
Mijozni Click sahifasiga yo'naltirish

**Step 3: Callback**
Click sizning server'ingizga so'rov yuboradi:
- `prepare` - to'lovni tekshirish
- `complete` - to'lovni tasdiqlash

### 5. Webhook Endpoint
```
POST /api/payment/click/webhook
```

---

## 💰 Payme Integration

### 1. Merchant Registration
1. [https://business.payme.uz](https://business.payme.uz)
2. Merchant account yarating
3. Test credentials oling

### 2. API Credentials
```env
# Payme Payment
PAYME_MERCHANT_ID=your_merchant_id
PAYME_KEY=your_key
```

---

## 🔐 Xavfsizlik

### 1. Signature Validation
- **Har doim** signature tekshiring
- MD5 yoki SHA256 hash
- Secret key server-side'da saqlang

### 2. Amount Verification
- Mijoz tomonidan kelgan amount'ni tekshiring
- Database'dagi order amount bilan solishtiring

### 3. HTTPS Required
- Production'da faqat HTTPS
- SSL sertifikat o'rnating

---

## ✅ Checklist

- [ ] Click merchant account yaratildi
- [ ] Payme merchant account yaratildi
- [ ] API credentials olindi
- [ ] Environment variables sozlandi
- [ ] Webhook endpoints yaratildi
- [ ] Signature validation test qilindi
- [ ] Test to'lov amalga oshirildi
- [ ] Production'ga deploy qilindi
