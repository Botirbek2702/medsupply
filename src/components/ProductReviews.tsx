"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";

interface Review {
  id: number;
  user_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductReviews({ productId }: { productId: number }) {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    init();
  }, [productId]);

  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    await fetchReviews();
  };

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (!error && data) setReviews(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.warning("Sharh qoldirish uchun tizimga kiring!");
      return;
    }
    if (rating === 0) {
      toast.warning("Iltimos, reyting (yulduz) tanlang!");
      return;
    }

    setSubmitting(true);
    try {
      const reviewerName =
        user.user_metadata?.clinic_name || user.email?.split("@")[0] || "Foydalanuvchi";

      const { error } = await supabase.from("product_reviews").upsert(
        {
          product_id: productId,
          user_id: user.id,
          reviewer_name: reviewerName,
          rating,
          comment: comment.trim() || null,
        },
        { onConflict: "product_id,user_id" }
      );

      if (error) throw error;

      toast.success("Sharhingiz uchun rahmat!");
      setRating(0);
      setComment("");
      await fetchReviews();
    } catch (error: any) {
      toast.error("Xatolik: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Sharhni o'chirishni xohlaysizmi?")) return;
    const { error } = await supabase.from("product_reviews").delete().eq("id", id);
    if (error) {
      toast.error("Xatolik: " + error.message);
    } else {
      await fetchReviews();
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  const userReview = reviews.find((r) => r.user_id === user?.id);

  return (
    <div
      style={{
        marginTop: "32px",
        backgroundColor: "var(--card-bg)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <MessageSquare size={22} color="var(--primary)" />
        <h2 style={{ fontSize: "20px", margin: 0, color: "var(--text-main)" }}>
          Sharhlar va baholar
        </h2>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          padding: "20px",
          backgroundColor: "var(--bg-color)",
          borderRadius: "var(--radius-md)",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", fontWeight: 700, color: "var(--text-main)", lineHeight: 1 }}>
            {averageRating}
          </div>
          <div style={{ display: "flex", gap: "2px", marginTop: "8px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                color="#ffc107"
                fill={s <= Math.round(Number(averageRating)) ? "#ffc107" : "none"}
              />
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-main)" }}>
            {reviews.length} ta sharh
          </div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Mijozlarning fikrlariga asoslangan
          </div>
        </div>
      </div>

      {/* Review Form */}
      {user ? (
        <div
          style={{
            padding: "20px",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--text-main)" }}>
            {userReview ? "Sharhingizni yangilang" : "Sharh qoldiring"}
          </h3>

          {/* Star selector */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <Star
                  size={28}
                  color="#ffc107"
                  fill={s <= (hoverRating || rating) ? "#ffc107" : "none"}
                />
              </button>
            ))}
          </div>

          <textarea
            className="form-input"
            rows={3}
            placeholder="Mahsulot haqida fikringizni yozing... (ixtiyoriy)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ marginBottom: "12px" }}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-primary"
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Yuborilmoqda..." : userReview ? "Yangilash" : "Sharh yuborish"}
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--primary-light)",
            borderRadius: "var(--radius-md)",
            marginBottom: "24px",
            fontSize: "14px",
            color: "var(--text-main)",
          }}
        >
          💡 Sharh qoldirish uchun{" "}
          <a href="/auth" style={{ color: "var(--primary)", fontWeight: 600 }}>
            tizimga kiring
          </a>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
          Yuklanmoqda...
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
          Hozircha sharhlar yo'q. Birinchi bo'lib sharh qoldiring!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: "16px",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                      fontWeight: 600,
                    }}
                  >
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, color: "var(--text-main)" }}>
                      {review.reviewer_name}
                    </div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          color="#ffc107"
                          fill={s <= review.rating ? "#ffc107" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {new Date(review.created_at).toLocaleDateString("uz-UZ")}
                  </span>
                  {review.user_id === user?.id && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              {review.comment && (
                <p style={{ marginTop: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
