-- ============================================
-- NOTIFICATIONS (Bildirishnomalar)
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info', -- 'info', 'order', 'success', 'warning'
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================
-- RLS
-- ============================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated can create notifications" ON public.notifications;

-- Foydalanuvchilar o'z bildirishnomalarini ko'radi
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- O'z bildirishnomasini o'qilgan deb belgilash / yangilash
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- O'z bildirishnomasini o'chirish
CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- Ro'yxatdan o'tgan foydalanuvchilar (admin yoki tizim) bildirishnoma yaratishi mumkin.
-- Admin buyurtma holatini o'zgartirganda mijozga bildirishnoma yuboradi.
CREATE POLICY "Authenticated can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- SUCCESS
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ notifications jadvali yaratildi!';
    RAISE NOTICE '🔔 Endi mijozlar buyurtma holati haqida bildirishnoma oladi';
END $$;
