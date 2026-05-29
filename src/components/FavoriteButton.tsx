"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";

export default function FavoriteButton({ product, isLarge }: { product: any, isLarge?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const favorite = isFavorite(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      image_url: product.image_url || '/placeholder.png',
      rating: product.rating
    });
  };

  if (isLarge) {
    return (
      <button 
        className="btn btn-secondary" 
        style={{ padding: "16px", color: favorite ? "var(--danger)" : "var(--text-main)" }} 
        aria-label="Saralanganlarga qo'shish"
        onClick={handleToggle}
      >
        <Heart size={24} fill={favorite ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        width: "34px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.92)",
        boxShadow: "0 2px 8px rgba(15,23,42,0.12)",
        color: favorite ? "var(--danger)" : "#64748b",
        cursor: "pointer",
        border: "none",
        zIndex: 2,
        transition: "transform 0.15s, color 0.2s",
      }}
      aria-label="Saralanganlarga qo'shish"
      onClick={handleToggle}
    >
      <Heart size={18} fill={favorite ? "currentColor" : "none"} />
    </button>
  );
}
