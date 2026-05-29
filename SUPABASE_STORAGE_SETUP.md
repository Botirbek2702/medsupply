# 📦 Supabase Storage Sozlash

Rasm yuklash funksiyasi uchun Supabase Storage'ni sozlash kerak.

## 1️⃣ Supabase Dashboard'ga Kiring

1. [https://supabase.com](https://supabase.com) ga kiring
2. O'z proyektingizni tanlang (medsupply)

## 2️⃣ Storage Bucket Yarating

1. Chap sidebar'dan **Storage** bo'limiga o'ting
2. **"New bucket"** tugmasini bosing
3. Quyidagi sozlamalarni kiriting:

### Bucket Settings:

```
Name: product-images
Public bucket: ✅ (checked - rasm public bo'lishi uchun)
File size limit: 5 MB (yoki kerakli hajm)
Allowed MIME types: image/* (yoki image/png, image/jpeg, image/webp)
```

4. **"Create bucket"** ni bosing

## 3️⃣ Bucket Policies Sozlash

Storage bucket yaratilgandan keyin, uni public qilish kerak:

### Avtomatik Public Policy:

1. Bucket ro'yxatida `product-images` ni toping
2. Bucket ustiga bosing
3. **"Policies"** tab'ga o'ting
4. **"New Policy"** ni bosing

### Policy Configuration:

**Option 1: Simple Public Access (Tavsiya etiladi)**

```sql
-- Public access for viewing images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### Yoki UI orqali:

1. **Policy name:** `Public Access`
2. **Target roles:** `public`
3. **Policy command:** `SELECT`
4. **Policy definition:** `true`

5. Yana yangi policy yarating:
   - **Policy name:** `Authenticated Upload`
   - **Target roles:** `authenticated`
   - **Policy command:** `INSERT`
   - **Policy definition:** `true`

## 4️⃣ Test Qilish

1. Loyihangizda admin sifatida kiring
2. `/admin/add-product` sahifasiga o'ting
3. Rasm yuklash bo'limiga rasm tashlang yoki file tanlang
4. Agar muvaffaqiyatli bo'lsa, rasm yuklandi xabari chiqadi

## 5️⃣ Bucket URL

Yuklangan rasmlar quyidagi URL formatida bo'ladi:

```
https://[PROJECT_ID].supabase.co/storage/v1/object/public/product-images/products/[filename].jpg
```

## 🔒 Xavfsizlik

**Production uchun:**
- File size limit qo'ying (5MB)
- Allowed MIME types cheklang (faqat image/*)
- Rate limiting qo'shing
- Virus scanning integration qiling

## 🐛 Troubleshooting

### "Storage bucket not found" xatoligi:
- Bucket nomini tekshiring: `product-images` (to'g'ri yozilganmi?)
- Bucket yaratilganmi?

### "Policy violation" xatoligi:
- Bucket policies'ni tekshiring
- Public access yoqilganmi?
- Authenticated user sifatida kirganmisiz?

### "File too large" xatoligi:
- Bucket file size limit'ni oshiring
- Yoki rasmni compress qiling (< 5MB)

### Rasm yuklanmaydi:
1. Browser console'ni oching (F12)
2. Network tab'da xatoliklarni ko'ring
3. Supabase logs'ni tekshiring

## ✅ Tugallandi!

Endi rasm yuklash funksiyasi ishlashi kerak. Test qiling va natijani ko'ring! 🎉
