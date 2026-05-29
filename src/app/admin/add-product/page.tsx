"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AddProductPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [specs, setSpecs] = useState([{ name: "", value: "" }]);
  
  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [imageUrl, setImageUrl] = useState("/placeholder.png");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories on load
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const addSpec = () => setSpecs([...specs, { name: "", value: "" }]);

  const removeSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  const handleSpecChange = (index: number, field: "name" | "value", val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const handleSave = async () => {
    if (!title || !price || !categoryId) {
      alert("Iltimos, mahsulot nomi, narxi va kategoriyasini kiriting!");
      return;
    }

    setLoading(true);
    try {
      // 1. Insert Product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          title,
          description,
          price: Number(price),
          old_price: oldPrice ? Number(oldPrice) : null,
          category_id: Number(categoryId),
          stock: Number(stock),
          image_url: imageUrl,
          rating: 5.0
        })
        .select()
        .single();

      if (productError) throw productError;

      // 2. Insert Specs (if any exist)
      const validSpecs = specs.filter(s => s.name.trim() !== "" && s.value.trim() !== "");
      if (validSpecs.length > 0 && productData) {
        const specsToInsert = validSpecs.map(s => ({
          product_id: productData.id,
          spec_name: s.name,
          spec_value: s.value
        }));
        
        const { error: specsError } = await supabase.from('product_specs').insert(specsToInsert);
        if (specsError) throw specsError;
      }

      alert("Mahsulot muvaffaqiyatli bazaga qo'shildi! 🎉");
      
      // Clear form
      setTitle("");
      setDescription("");
      setPrice("");
      setOldPrice("");
      setCategoryId("");
      setSpecs([{ name: "", value: "" }]);

    } catch (error: any) {
      console.error(error);
      alert("Xatolik yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "32px 16px", maxWidth: "1000px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ color: "var(--text-main)", fontSize: "24px", margin: 0 }}>Yangi mahsulot qo'shish</h1>
      </div>

      <div className="responsive-flex" style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        
        {/* Main Form */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Asosiy ma'lumotlar</h2>
            
            <div className="form-group">
              <label className="form-label">Mahsulot nomi</label>
              <input type="text" className="form-input" placeholder="Masalan: Philips Achieva 1.5T MRT apparati" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Kategoriya</label>
              <select className="form-input" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">Kategoriyani tanlang</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Ta'rif (Description)</label>
              <textarea className="form-input" rows={5} placeholder="Mahsulot haqida batafsil ma'lumot..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
          </div>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Rasm (URL)</h2>
            
            <div className="form-group">
              <input type="text" className="form-input" placeholder="Rasm havolasi (masalan: /mri_machine.png yoki https://...)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>* Hozircha rasmni to'g'ridan-to'g'ri URL manzil orqali kiritish mumkin.</div>
          </div>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", margin: 0 }}>Texnik xususiyatlari</h2>
              <button className="btn btn-secondary" onClick={addSpec} style={{ padding: "6px 12px", fontSize: "12px", gap: "4px", display: "flex" }}>
                <Plus size={14} /> Qo'shish
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {specs.map((spec, index) => (
                <div key={index} style={{ display: "flex", gap: "12px" }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Masalan: Kafolat" 
                    value={spec.name}
                    onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Masalan: 2 yil" 
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <button 
                    style={{ padding: "0 12px", backgroundColor: "var(--bg-color)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--danger)", cursor: "pointer" }}
                    onClick={() => removeSpec(index)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar / Settings */}
        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Narx va Ombor</h2>
            
            <div className="form-group">
              <label className="form-label">Asosiy narxi (so'm)</label>
              <input type="number" className="form-input" placeholder="Masalan: 12000000" value={price} onChange={e => setPrice(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Eski narxi (chegirma uchun)</label>
              <input type="number" className="form-input" placeholder="Ixtiyoriy" value={oldPrice} onChange={e => setOldPrice(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
              <label className="form-label">Ombordagi qoldiq (dona)</label>
              <input type="number" className="form-input" placeholder="Masalan: 15" value={stock} onChange={e => setStock(e.target.value)} />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ width: "100%", padding: "16px", fontSize: "16px", display: "flex", gap: "8px", justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
            <Save size={20} />
            {loading ? "Saqlanmoqda..." : "Saqlash va Nashr qilish"}
          </button>
          
        </div>

      </div>
    </div>
  );
}
