-- ============================================
-- FIX: "permission denied for table users"
-- ============================================
-- Muammo: RLS policy'lar auth.users jadvaliga to'g'ridan-to'g'ri
-- murojaat qilgani uchun oddiy foydalanuvchilar buyurtma bera olmaydi.
--
-- Yechim: auth.users o'rniga auth.jwt() dan email olamiz.
-- ============================================

-- 1. Eski (xato) policy'larni o'chiramiz
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

DROP POLICY IF EXISTS "Users can view own order history" ON public.order_status_history;
DROP POLICY IF EXISTS "Users can create order history" ON public.order_status_history;
DROP POLICY IF EXISTS "Admins can manage order history" ON public.order_status_history;

DROP POLICY IF EXISTS "Admins can view all transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.payment_transactions;

-- ============================================
-- 2. YANGI (to'g'ri) POLICY'LAR
-- auth.jwt() ->> 'email' JWT token'dan o'qiydi, jadval kerak emas
-- ============================================

-- ----- ORDERS -----
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (
    auth.uid() = user_id 
    OR (auth.jwt() ->> 'email') LIKE '%admin%'
);

CREATE POLICY "Users can create own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING ((auth.jwt() ->> 'email') LIKE '%admin%');

-- ----- ORDER ITEMS -----
CREATE POLICY "View order items"
ON public.order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR (auth.jwt() ->> 'email') LIKE '%admin%')
    )
);

CREATE POLICY "Create order items"
ON public.order_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- ----- ORDER STATUS HISTORY -----
CREATE POLICY "View order history"
ON public.order_status_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_status_history.order_id 
        AND (orders.user_id = auth.uid() OR (auth.jwt() ->> 'email') LIKE '%admin%')
    )
);

CREATE POLICY "Create order history"
ON public.order_status_history FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_status_history.order_id 
        AND orders.user_id = auth.uid()
    )
    OR (auth.jwt() ->> 'email') LIKE '%admin%'
);

-- ----- PAYMENT TRANSACTIONS -----
CREATE POLICY "View transactions"
ON public.payment_transactions FOR SELECT
USING (
    (auth.jwt() ->> 'email') LIKE '%admin%'
    OR EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = payment_transactions.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- ============================================
-- SUCCESS
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ RLS Policy''lar tuzatildi!';
    RAISE NOTICE '🔓 Endi foydalanuvchilar buyurtma bera oladi';
    RAISE NOTICE '👨‍💼 Adminlar barcha buyurtmalarni ko''ra oladi';
    RAISE NOTICE '🎉 Tayyor!';
END $$;
