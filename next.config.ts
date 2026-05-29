import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Admin ixtiyoriy rasm URL (Supabase Storage yoki tashqi havola) kiritishi mumkin.
  // unoptimized=true har qanday manbadagi rasm muammosiz ko'rinishini ta'minlaydi
  // ("hostname not configured" xatosi bo'lmaydi).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
