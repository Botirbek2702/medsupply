"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Search, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  old_price: number | null;
  stock: number;
  image_url: string;
  category_id: number;
  categories?: { name: string };
}

export default function AdminProductsPage() {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    // Filter products based on search
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user || !session.user.email?.toLowerCase().includes("admin")) {
      router.push("/auth");
      return;
    }

    await fetchProducts();
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name)
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Mahsulotni o'chirishni xohlaysizmi?")) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      toast.error("Xatolik: " + error.message);
    } else {
      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      fetchProducts();
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ color: "var(--text-muted)" }}>Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 16px", maxWidth: "1400px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ color: "var(--text-main)", fontSize: "24px", margin: 0 }}>Mahsulotlar</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
              Jami {products.length} ta mahsulot
            </p>
          </div>
        </div>
        <Link href="/admin/add-product" className="btn btn-primary" style={{ gap: "8px" }}>
          <Plus size={18} />
          Yangi mahsulot
        </Link>
      </div>

      {/* Search Bar */}
      <div style={{ 
        backgroundColor: "var(--card-bg)", 
        padding: "16px", 
        borderRadius: "var(--radius-lg)",
        marginBottom: "24px",
        border: "1px solid var(--border-color)"
      }}>
        <div style={{ position: "relative" }}>
          <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input 
            type="text"
            placeholder="Mahsulot nomi yoki ta'rif bo'yicha qidirish..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "44px" }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div style={{ 
        backgroundColor: "var(--card-bg)", 
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-color)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-color)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>ID</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Rasm</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Nomi</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Kategoriya</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Narx</th>
                <th style={{ padding: "16px", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Ombor</th>
                <th style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    {searchQuery ? "Hech narsa topilmadi" : "Hozircha mahsulotlar yo'q"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "16px", color: "var(--text-main)" }}>#{product.id}</td>
                    <td style={{ padding: "16px" }}>
                      <img 
                        src={product.image_url || "/placeholder.png"} 
                        alt={product.title}
                        style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                      />
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ maxWidth: "300px" }}>
                        <div style={{ color: "var(--text-main)", fontWeight: 500, marginBottom: "4px" }}>
                          {product.title}
                        </div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px", color: "var(--text-main)" }}>
                      {product.categories?.name || "—"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: "var(--text-main)", fontWeight: 600 }}>
                        {product.price.toLocaleString()} so'm
                      </div>
                      {product.old_price && (
                        <div style={{ color: "var(--text-muted)", fontSize: "12px", textDecoration: "line-through" }}>
                          {product.old_price.toLocaleString()} so'm
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "var(--radius-sm)", 
                        fontSize: "12px",
                        backgroundColor: product.stock > 5 ? "var(--success-light)" : "var(--danger-light)",
                        color: product.stock > 5 ? "var(--success)" : "var(--danger)"
                      }}>
                        {product.stock} dona
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <Link 
                          href={`/admin/products/edit/${product.id}`}
                          style={{ 
                            padding: "8px", 
                            backgroundColor: "var(--primary-light)", 
                            color: "var(--primary)",
                            borderRadius: "var(--radius-sm)",
                            display: "flex"
                          }}
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          style={{ 
                            padding: "8px", 
                            backgroundColor: "var(--danger-light)", 
                            color: "var(--danger)",
                            borderRadius: "var(--radius-sm)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex"
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
