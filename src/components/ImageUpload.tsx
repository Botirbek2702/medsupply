"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, folder = "products" }: ImageUploadProps) {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.warning("Faqat rasm fayllari yuklash mumkin!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        toast.error("Rasm yuklashda xatolik: " + error.message);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;
      setPreview(publicUrl);
      onChange(publicUrl);

      toast.success("Rasm muvaffaqiyatli yuklandi!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Xatolik yuz berdi: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a mock input event
      const mockEvent = {
        target: { files: [file] },
      } as any;
      handleFileSelect(mockEvent);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {preview ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "400px",
            aspectRatio: "16/9",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-color)",
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "8px",
            }}
          />
          <button
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.7)";
            }}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            width: "100%",
            maxWidth: "400px",
            aspectRatio: "16/9",
            border: "2px dashed var(--border-color)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            cursor: uploading ? "not-allowed" : "pointer",
            backgroundColor: "var(--bg-color)",
            transition: "all 0.2s",
            padding: "24px",
          }}
          onMouseEnter={(e) => {
            if (!uploading) {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.backgroundColor = "var(--primary-light)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.backgroundColor = "var(--bg-color)";
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={48} color="var(--primary)" className="animate-spin" />
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Yuklanmoqda...
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageIcon size={32} color="var(--primary)" />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 500, color: "var(--text-main)", marginBottom: "4px" }}>
                  Rasm yuklash
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Bosing yoki rasmni bu yerga tashlang
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                  PNG, JPG, WEBP (maks. 5MB)
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ gap: "8px", fontSize: "13px", padding: "8px 16px" }}
              >
                <Upload size={16} />
                Fayl tanlash
              </button>
            </>
          )}
        </div>
      )}

      {!preview && (
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
          💡 Yoki URL orqali: mahsulot qo'shish formida URL maydonini to'ldiring
        </p>
      )}
    </div>
  );
}
