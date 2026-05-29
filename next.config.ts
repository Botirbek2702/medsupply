import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lint xatolari production build'ni to'xtatmasligi uchun (kosmetik qoidalar).
  // Kod sifatini tekshirish uchun alohida `npm run lint` ishlatiladi.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Admin ixtiyoriy rasm URL (Supabase Storage yoki tashqi havola) kiritishi mumkin.
  // unoptimized=true har qanday manbadagi rasm muammosiz ko'rinishini ta'minlaydi
  // ("hostname not configured" xatosi bo'lmaydi).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
