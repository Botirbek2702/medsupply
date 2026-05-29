"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [profileUrl, setProfileUrl] = useState("/auth");
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setProfileUrl(session.user.email?.toLowerCase().includes("admin") ? "/admin" : "/profile");
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setProfileUrl(session.user.email?.toLowerCase().includes("admin") ? "/admin" : "/profile");
      } else {
        setProfileUrl("/auth");
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Hide bottom nav inside admin panel and on the auth page
  // (centered forms there could otherwise be overlapped by the fixed nav)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) return null;

  const items = [
    { href: "/", icon: Home, label: t("home"), match: (p: string) => p === "/" },
    { href: "/search", icon: Search, label: t("catalog"), match: (p: string) => p.startsWith("/search") },
    { href: "/cart", icon: ShoppingCart, label: t("cart"), match: (p: string) => p.startsWith("/cart"), badge: mounted ? totalItems : 0 },
    { href: "/favorites", icon: Heart, label: t("favorites"), match: (p: string) => p.startsWith("/favorites") },
    { href: profileUrl, icon: User, label: t("account"), match: (p: string) => p.startsWith("/profile") || p.startsWith("/auth") },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item, index) => {
        const Icon = item.icon;
        const active = pathname ? item.match(pathname) : false;
        return (
          <Link
            key={index}
            href={item.href}
            className={`mobile-nav-item ${active ? "active" : ""}`}
          >
            <div style={{ position: "relative" }}>
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              {item.badge && item.badge > 0 ? (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -8,
                    background: "var(--danger)",
                    color: "#fff",
                    borderRadius: "50%",
                    minWidth: "16px",
                    height: "16px",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
