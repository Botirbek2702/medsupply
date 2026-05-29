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
      style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "transparent", color: favorite ? "var(--danger)" : "var(--text-muted)", cursor: "pointer", border: "none" }} 
      onClick={handleToggle}
    >
      <Heart size={20} fill={favorite ? "currentColor" : "none"} />
    </button>
  );
}
