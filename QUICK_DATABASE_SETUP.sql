-- ============================================
-- MEDSUPPLY - QUICK DATABASE SETUP
-- Barcha jadvallarni yaratish uchun
-- ============================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Customer information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    
    -- Shipping address
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100),
    shipping_region VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    
    -- Order details
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    shipping_cost NUMERIC(12, 2) DEFAULT 0,
    final_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    
    -- Payment
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Order status
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- 2. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    
    -- Product snapshot
    product_title VARCHAR(500) NOT NULL,
    product_image_url TEXT,
    
    -- Pricing
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal NUMERIC(12, 2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDER STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    
    provider VARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL,
    state INTEGER DEFAULT 1,
    
    create_time BIGINT NOT NULL,
    perform_time BIGINT,
    cancel_time BIGINT,
    
    reason INTEGER,
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON public.payment_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON public.payment_transactions(order_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();

-- Update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

DROP POLICY IF EXISTS "Users can view own order history" ON public.order_status_history;
DROP POLICY IF EXISTS "Admins can manage order history" ON public.order_status_history;

DROP POLICY IF EXISTS "Admins can view all transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.payment_transactions;

-- Orders policies
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%admin%'
);

CREATE POLICY "Admins can update all orders"
ON public.orders FOR UPDATE
USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%admin%'
);

-- Order items policies
CREATE POLICY "Users can view own order items"
ON public.order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create order items"
ON public.order_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all order items"
ON public.order_items FOR SELECT
USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%admin%'
);

-- Order status history policies
CREATE POLICY "Users can view own order history"
ON public.order_status_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_status_history.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage order history"
ON public.order_status_history FOR ALL
USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%admin%'
);

-- Payment transactions policies
CREATE POLICY "Admins can view all transactions"
ON public.payment_transactions FOR SELECT
USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%admin%'
);

CREATE POLICY "Users can view own transactions"
ON public.payment_transactions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = payment_transactions.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ MedSupply Database Setup Complete!';
    RAISE NOTICE '📋 Created tables: orders, order_items, order_status_history, payment_transactions';
    RAISE NOTICE '🔒 RLS policies enabled';
    RAISE NOTICE '⚡ Indexes created';
    RAISE NOTICE '🎉 Ready to use!';
END $$;
