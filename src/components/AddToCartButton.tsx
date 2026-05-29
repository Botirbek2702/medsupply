"use client";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/context/ToastContext";

export default function AddToCartButton({ product, fullWidth }: { product: any, fullWidth?: boolean }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const toast = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      image_url: product.image_url || '/placeholder.png'
    });
    toast.success("Savatga qo'shildi!");
  };

  if (fullWidth) {
    return (
      <button className="btn btn-primary" style={{ flex: 1, padding: "16px", fontSize: "16px" }} onClick={handleAdd}>
        Savatchaga qo'shish
      </button>
    );
  }

  return (
    <button className="add-to-cart-btn" aria-label="Savatga qo'shish" onClick={handleAdd}>
      <ShoppingCart size={16} />
    </button>
  );
}
