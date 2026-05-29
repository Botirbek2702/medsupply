-- ============================================
-- PRODUCT REVIEWS (Sharhlar va Reyting)
-- ============================================

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Review content
    reviewer_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,

    -- Moderation
    is_approved BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bir foydalanuvchi bitta mahsulotga faqat bitta sharh qoldiradi
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_product_review
ON public.product_reviews(product_id, user_id);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);

-- ============================================
-- RLS
-- ============================================

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.product_reviews;

-- Hamma tasdiqlangan sharhlarni ko'ra oladi
CREATE POLICY "Anyone can view approved reviews"
ON public.product_reviews FOR SELECT
USING (is_approved = true OR (auth.jwt() ->> 'email') LIKE '%admin%');

-- Ro'yxatdan o'tgan foydalanuvchilar sharh qoldira oladi
CREATE POLICY "Authenticated users can create reviews"
ON public.product_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Foydalanuvchilar o'z sharhini tahrirlay oladi
CREATE POLICY "Users can update own reviews"
ON public.product_reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Foydalanuvchilar o'z sharhini o'chira oladi (admin ham)
CREATE POLICY "Users can delete own reviews"
ON public.product_reviews FOR DELETE
USING (auth.uid() = user_id OR (auth.jwt() ->> 'email') LIKE '%admin%');

-- ============================================
-- SUCCESS
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ product_reviews jadvali yaratildi!';
    RAISE NOTICE '⭐ Endi mahsulotlarga sharh qoldirish mumkin';
END $$;
