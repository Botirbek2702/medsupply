"use client";

import { useLanguage } from "@/context/LanguageContext";

export function HeroBanner() {
  const { t } = useLanguage();
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h1>{t("hero_title")}</h1>
        <p>{t("hero_subtitle")}</p>
        <button className="btn btn-primary" style={{ padding: "12px 24px", fontSize: "16px" }}>
          {t("view_catalog")}
        </button>
      </div>
      <div style={{ width: "300px", height: "200px", position: "relative" }}></div>
    </div>
  );
}

export function SectionTitle({ tkey }: { tkey: "popular_products" | "service_section" }) {
  const { t } = useLanguage();
  return <h2 className="section-title">{t(tkey)}</h2>;
}

export function ServiceSection() {
  const { t } = useLanguage();
  return (
    <div
      style={{
        padding: "32px",
        backgroundColor: "var(--card-bg)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-color)",
        marginBottom: "60px",
      }}
    >
      <h3 style={{ marginBottom: "16px" }}>{t("service_title")}</h3>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>{t("service_desc")}</p>
      <button className="btn btn-primary">{t("order_service")}</button>
    </div>
  );
}
