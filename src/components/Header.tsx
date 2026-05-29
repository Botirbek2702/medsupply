"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronRight, Sun, Moon } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
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
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileUrl, setProfileUrl] = useState("/auth");
  const totalItems = useCartStore(state => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
    // Check initial preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Check user auth state
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setProfileUrl(session.user.email?.toLowerCase().includes("admin") ? "/admin/add-product" : "/profile");
      }
    };
    checkUser();

    // Listen to changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setProfileUrl(session.user.email?.toLowerCase().includes("admin") ? "/admin/add-product" : "/profile");
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
            <span>Katalog</span>
          </button>

          <div className="search-bar">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Mahsulotlarni izlash..." 
            />
            <Link href="/search">
              <button className="search-btn">
                <Search size={20} />
              </button>
            </Link>
          </div>

          <div className="header-actions">
            <button onClick={toggleDarkMode} className="action-item" style={{ backgroundColor: 'transparent', border: 'none' }}>
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
              <span>{isDark ? 'Yorug\'' : 'Tungi'}</span>
            </button>
            <Link href={profileUrl} className="action-item">
              <User size={24} />
              <span>Kabinet</span>
            </Link>
            <Link href="/favorites" className="action-item">
              <Heart size={24} />
              <span>Saralangan</span>
            </Link>
            <Link href="/cart" className="action-item" style={{ position: 'relative' }}>
              <ShoppingCart size={24} />
              <span>Savat</span>
              {mounted && totalItems > 0 && (
                <span style={{ position: 'absolute', top: -5, right: 10, background: 'var(--danger)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        <nav className="header-nav">
          <a href="#">Aksiyalar</a>
          <a href="#">Elektronika</a>
          <a href="#">Xirurgiya</a>
          <a href="#">Stomatologiya</a>
          <a href="#">Laboratoriya</a>
          <a href="#">Servis xizmatlari</a>
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
