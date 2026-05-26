"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, Trash2, Save } from "lucide-react";

export default function AddProductPage() {
  const [specs, setSpecs] = useState([{ name: "", value: "" }]);

  const addSpec = () => {
    setSpecs([...specs, { name: "", value: "" }]);
  };

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

  return (
    <div className="container" style={{ padding: "32px 16px", maxWidth: "1000px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/admin" style={{ padding: "8px", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
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
              <input type="text" className="form-input" placeholder="Masalan: Philips Achieva 1.5T MRT apparati" />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Kategoriya</label>
              <select className="form-input">
                <option value="">Kategoriyani tanlang</option>
                <option value="diagnostika">Diagnostika uskunalari</option>
                <option value="jarrohlik">Jarrohlik jihozlari</option>
                <option value="reanimatsiya">Reanimatsiya va intensiv terapiya</option>
                <option value="laboratoriya">Laboratoriya jihozlari</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Ta'rif (Description)</label>
              <textarea className="form-input" rows={5} placeholder="Mahsulot haqida batafsil ma'lumot..."></textarea>
            </div>
          </div>

          <div style={{ backgroundColor: "var(--card-bg)", padding: "24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Rasmlar</h2>
            
            <div style={{ border: "2px dashed var(--border-color)", padding: "40px", textAlign: "center", borderRadius: "var(--radius-md)", cursor: "pointer", backgroundColor: "var(--bg-color)" }}>
              <Upload size={32} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>Rasmlarni yuklash uchun bosing</div>
              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>yoki rasmlarni shu yerga tashlang (PNG, JPG)</div>
            </div>
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
                    placeholder="Xususiyat nomi (masalan: Kafolat)" 
                    value={spec.name}
                    onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Qiymati (masalan: 2 yil)" 
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
              <input type="number" className="form-input" placeholder="0" />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Eski narxi (chegirma uchun)</label>
              <input type="number" className="form-input" placeholder="0" />
            </div>

            <div className="form-group" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
              <label className="form-label">Ombordagi qoldiq (dona)</label>
              <input type="number" className="form-input" placeholder="Masalan: 15" />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "16px", display: "flex", gap: "8px", justifyContent: "center" }}>
            <Save size={20} />
            Saqlash va Nashr qilish
          </button>
          
        </div>

      </div>
    </div>
  );
}
