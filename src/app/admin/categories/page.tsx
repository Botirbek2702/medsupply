"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Plus, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: number;
  name: string;
  description: string | null;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user || !session.user.email?.toLowerCase().includes("admin")) {
      router.push("/auth");
      return;
    }

    await fetchCategories();
  };

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setCategoryName("");
    setCategoryDescription("");
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const handleEdit = (category: Category) => {
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert("Kategoriya nomini kiriting!");
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update({ 
            name: categoryName, 
            description: categoryDescription || null 
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        alert("Kategoriya muvaffaqiyatli yangilandi!");
      } else {
        // Insert
        const { error } = await supabase
          .from('categories')
          .insert({ 
            name: categoryName, 
            description: categoryDescription || null 
          });

        if (error) throw error;
        alert("Kategoriya muvaffaqiyatli qo'shildi!");
      }

      setShowAddModal(false);
      fetchCategories();
    } catch (error: any) {
      console.error(error);
      alert("Xatolik: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Kategoriyani o'chirishni xohlaysizmi? (Bu kategoriyaga tegishli mahsulotlar ham ta'sir ko'rishi mumkin)")) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);
    
    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      alert("Kategoriya muvaffaqiyatli o'chirildi!");
      fetchCategories();
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
    <div className="container" style={{ padding: "32px 16px", maxWidth: "1200px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ color: "var(--text-main)", fontSize: "24px", margin: 0 }}>Kategoriyalar</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
              Jami {categories.length} ta kategoriya
            </p>
          </div>
        </div>
        <button onClick={handleAdd} className="btn btn-primary" style={{ gap: "8px" }}>
          <Plus size={18} />
          Yangi kategoriya
        </button>
      </div>

      {/* Categories Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "20px" 
      }}>
        {categories.map((category) => (
          <div 
            key={category.id}
            style={{
              backgroundColor: "var(--card-bg)",
              padding: "20px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)", marginBottom: "8px" }}>
                {category.name}
              </h3>
              {category.description && (
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  {category.description}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
              <button 
                onClick={() => handleEdit(category)}
                className="btn btn-secondary"
                style={{ flex: 1, gap: "6px", padding: "8px", fontSize: "14px" }}
              >
                <Edit size={16} />
                Tahrirlash
              </button>
              <button 
                onClick={() => handleDelete(category.id)}
                style={{ 
                  padding: "8px 12px", 
                  backgroundColor: "var(--danger-light)", 
                  color: "var(--danger)",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "var(--card-bg)",
            padding: "32px",
            borderRadius: "var(--radius-lg)",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "var(--shadow-lg)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", color: "var(--text-main)", margin: 0 }}>
                {editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ 
                  padding: "8px", 
                  backgroundColor: "transparent", 
                  border: "none", 
                  cursor: "pointer",
                  color: "var(--text-muted)"
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Kategoriya nomi *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Masalan: Diagnostika uskunalari"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Ta'rif (ixtiyoriy)</label>
              <textarea 
                className="form-input" 
                rows={3}
                placeholder="Kategoriya haqida qisqacha ma'lumot..."
                value={categoryDescription}
                onChange={e => setCategoryDescription(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={saving}
              >
                Bekor qilish
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
                style={{ flex: 1, gap: "8px", opacity: saving ? 0.7 : 1 }}
                disabled={saving}
              >
                <Save size={18} />
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
