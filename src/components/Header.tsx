"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronRight, Sun, Moon, Globe } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";
import { supabase } from "@/lib/supabase";

const categories = [
  { id: 1, name: "Diagnostika uskunalari", sub: ["MRT va KT", "Rentgen apparatlari", "UZI (Ultratovush)", "Endoskopiya"] },
  { id: 2, name: "Jarrohlik jihozlari", sub: ["Xirurgiya stollari", "Elektrokoagulyatorlar", "Jarrohlik asboblari", "Laparoskopiya"] },
  { id: 3, name: "Reanimatsiya va intensiv terapiya", sub: ["O'pkani sun'iy shamollatish", "Defibrillyatorlar", "Bemor monitorlari", "Infuzion nasoslar"] },
  { id: 4, name: "Laboratoriya jihozlari", sub: ["Gematologik analizatorlar", "Biokimyoviy analizatorlar", "Mikroskoplar", "Sentrifugalar"] },
  { id: 5, name: "Stomatologiya", sub: ["Stomatologik qurilmalar", "Rentgen (Viziograf)", "Sterilizatorlar", "Stomatologik asboblar"] },
  { id: 6, name: "Sterilizatsiya va dezinfeksiya", sub: ["Avtoklavlar", "Quruq havo shkaflari", "Ultratovushli moykalar"] },
  { id: 7, name: "Kasalxona mebellari", sub: ["Kasalxona yotoqlari", "Nogironlik aravachalari", "Tibbiyot shkaflari", "Kushetkalar"] },
];

export default function Header() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileUrl, setProfileUrl] = useState("/auth");
  const [searchTerm, setSearchTerm] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());

  const langLabels: Record<Language, string> = { uz: "O'z", ru: "Ру", en: "En" };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Read saved theme (set by the inline script in layout). Fall back to OS preference.
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('medsupply-theme');
    } catch (e) {}
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkNow = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDark(isDarkNow);
    if (isDarkNow) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Check user auth state
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setProfileUrl(session.user.email?.toLowerCase().includes("admin") ? "/admin" : "/profile");
      }
    };
    checkUser();

    // Listen to changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setProfileUrl(session.user.email?.toLowerCase().includes("admin") ? "/admin" : "/profile");
      } else {
        setProfileUrl("/auth");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('medsupply-theme', newDark ? 'dark' : 'light');
    } catch (e) {}
  };

  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="container">
        <div className="header-top">
          <Link href="/" className="logo">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '8px' }}>
              Med
            </div>
            <span className="logo-text">Supply</span>
          </Link>
          
          <button 
            className={`btn catalog-btn ${isCatalogOpen ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ marginLeft: '24px', display: 'flex', gap: '8px', zIndex: 102 }}
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
          >
            {isCatalogOpen ? <X size={18} /> : <Menu size={18} />}
            <span>{t("catalog")}</span>
          </button>

          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="search-input" 
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={20} />
            </button>
          </form>

          <div className="header-actions">
            {/* Language Switcher */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="action-item"
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <Globe size={24} />
                <span>{langLabels[language]}</span>
              </button>
              {langOpen && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 200 }}
                    onClick={() => setLangOpen(false)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-md)",
                      zIndex: 201,
                      overflow: "hidden",
                      minWidth: "140px",
                    }}
                  >
                    {([
                      { code: "uz", label: "O'zbekcha" },
                      { code: "ru", label: "Русский" },
                      { code: "en", label: "English" },
                    ] as { code: Language; label: string }[]).map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 16px",
                          background: language === l.code ? "var(--primary-light)" : "transparent",
                          color: language === l.code ? "var(--primary)" : "var(--text-main)",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: language === l.code ? 600 : 400,
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button onClick={toggleDarkMode} className="action-item" style={{ backgroundColor: 'transparent', border: 'none' }}>
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
              <span>{isDark ? t("light_mode") : t("dark_mode")}</span>
            </button>
            <Link href={profileUrl} className="action-item header-hide-mobile">
              <User size={24} />
              <span>{t("account")}</span>
            </Link>
            <Link href="/favorites" className="action-item header-hide-mobile">
              <Heart size={24} />
              <span>{t("favorites")}</span>
            </Link>
            <Link href="/cart" className="action-item header-hide-mobile" style={{ position: 'relative' }}>
              <ShoppingCart size={24} />
              <span>{t("cart")}</span>
              {mounted && totalItems > 0 && (
                <span style={{ position: 'absolute', top: -5, right: 10, background: 'var(--danger)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        <nav className="header-nav">
          <a href="#">{t("promotions")}</a>
          <a href="#">{t("electronics")}</a>
          <a href="#">{t("surgery")}</a>
          <a href="#">{t("dentistry")}</a>
          <a href="#">{t("laboratory")}</a>
          <a href="#">{t("services")}</a>
        </nav>
      </div>

      {/* Catalog Dropdown Overlay */}
      {isCatalogOpen && (
        <>
          <div 
            className="catalog-overlay" 
            onClick={() => setIsCatalogOpen(false)}
          ></div>
          <div className="catalog-dropdown container">
            <div className="catalog-sidebar">
              <ul>
                {categories.map(category => (
                  <li 
                    key={category.id} 
                    className={activeCategory.id === category.id ? "active" : ""}
                    onMouseEnter={() => setActiveCategory(category)}
                  >
                    {category.name}
                    <ChevronRight size={16} className="chevron" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="catalog-content">
              <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>{activeCategory.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeCategory.sub.map((subItem, index) => (
                  <a href="#" key={index} style={{ color: 'var(--text-main)', fontSize: '15px' }} className="catalog-sub-item">
                    {subItem}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
