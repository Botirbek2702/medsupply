# 🏥 MedSupply UZ - Tibbiyot Texnikalari B2B E-commerce

Modern Next.js asosida qurilgan tibbiy uskunalar va asbob-uskuna savdosi uchun B2B e-commerce platformasi.

## 🚀 Texnologiyalar

- **Frontend:** Next.js 16 + TypeScript + React
- **Styling:** Tailwind CSS (custom CSS variables)
- **Backend:** Supabase (PostgreSQL)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Authentication:** Supabase Auth

## 📦 O'rnatish

```bash
# Dependencies'larni o'rnatish
npm install

# Development server'ni ishga tushirish
npm run dev
```

Server [http://localhost:3000](http://localhost:3000) da ishga tushadi.

## 🗂️ Loyiha Strukturasi

```
src/
├── app/
│   ├── admin/                 # Admin panel sahifalari
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/         # Mahsulotlar boshqaruvi
│   │   ├── add-product/      # Yangi mahsulot qo'shish
│   │   ├── categories/       # Kategoriyalar
│   │   ├── admins/           # Admin foydalanuvchilar
│   │   ├── orders/           # Buyurtmalar
│   │   └── settings/         # Sozlamalar
│   ├── auth/                  # Authentication
│   ├── cart/                  # Savatcha
│   ├── checkout/              # To'lov sahifasi
│   ├── favorites/             # Tanlanganlar
│   ├── product/[id]/         # Mahsulot batafsil
│   ├── profile/               # Foydalanuvchi profili
│   └── search/                # Qidiruv natijasi
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AddToCartButton.tsx
│   └── FavoriteButton.tsx
├── lib/
│   └── supabase.ts            # Supabase konfiguratsiyasi
└── store/
    ├── useCartStore.ts        # Savatcha store
    └── useFavoritesStore.ts   # Tanlanganlar store
```

## 👨‍💼 Admin Panel

### Kirish
Admin sifatida kirish uchun email'da **"admin"** so'zi bo'lishi kerak.

**Misol:** `admin@klinika.uz`

### Admin Panel Funksiyalari

1. **Dashboard** (`/admin`)
   - Umumiy statistika
   - Mahsulotlar, kategoriyalar, buyurtmalar soni
   - Tez harakatlar

2. **Mahsulotlar** (`/admin/products`)
   - Barcha mahsulotlarni ko'rish
   - Qidiruv va filtrlash
   - Tahrirlash va o'chirish

3. **Yangi Mahsulot** (`/admin/add-product`)
   - Mahsulot ma'lumotlarini kiritish
   - Texnik xususiyatlar qo'shish
   - Kategoriya tanlash

4. **Mahsulot Tahrirlash** (`/admin/products/edit/[id]`)
   - Mavjud mahsulotni yangilash
   - Narx va ombor ma'lumotlarini o'zgartirish

5. **Kategoriyalar** (`/admin/categories`)
   - Yangi kategoriya qo'shish
   - Mavjud kategoriyalarni tahrirlash
   - Kategoriyalarni o'chirish

6. **Adminlar** (`/admin/admins`)
   - Yangi admin qo'shish
   - Admin ro'yxati

7. **Buyurtmalar** (`/admin/orders`)
   - Barcha buyurtmalarni ko'rish (demo)
   - Buyurtma holati

8. **Sozlamalar** (`/admin/settings`)
   - Sayt sozlamalari
   - Aloqa ma'lumotlari
   - Tizim sozlamalari

## 🗄️ Ma'lumotlar Bazasi

### Supabase Jadvallar

#### `products`
```sql
- id (bigint, primary key)
- title (text)
- description (text)
- price (numeric)
- old_price (numeric, nullable)
- category_id (bigint, foreign key)
- stock (integer)
- image_url (text)
- rating (numeric)
- created_at (timestamp)
```

#### `categories`
```sql
- id (bigint, primary key)
- name (text)
- description (text, nullable)
- created_at (timestamp)
```

#### `product_specs`
```sql
- id (bigint, primary key)
- product_id (bigint, foreign key)
- spec_name (text)
- spec_value (text)
- created_at (timestamp)
```

## 🎨 Dizayn Tizimi

Loyihada custom CSS variables ishlatilgan:

```css
--primary: #0a58ca
--success: #198754
--danger: #dc3545
--warning: #ffc107
```

## 🔒 Autentifikatsiya

- Supabase Auth ishlatiladi
- Email/Parol orqali kirish
- Admin va oddiy foydalanuvchilar
- Admin: email'da "admin" so'zi bo'lishi kerak

## 📝 Keyingi Qadamlar

- [ ] Buyurtmalar tizimini to'liq ishga tushirish
- [ ] To'lov integratsiyasi (Click, Payme, Uzum)
- [ ] Email bildirishnomalar
- [ ] Rasm yuklash (file upload)
- [ ] Advanced filtrlash va qidiruv
- [ ] Dashboard statistikasi (real-time)
- [ ] Order tracking tizimi

## 🤝 Hissa qo'shish

Pull request'lar qabul qilinadi!

## 📄 Litsenziya

MIT

---

**Muallif:** MedSupply UZ Team
**Versiya:** 1.0.0
