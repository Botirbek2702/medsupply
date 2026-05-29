-- ============================================
-- MedSupply Database Schema
-- ============================================

-- 1. ORDERS TABLE
-- Buyurtmalar asosiy jadvali
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
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
    payment_method VARCHAR(50), -- 'cash', 'card', 'bank_transfer', 'click', 'payme'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    
    -- Order status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- 2. ORDER ITEMS TABLE
-- Buyurtma mahsulotlari
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    
    -- Product snapshot (saqlab qolish uchun)
    product_title VARCHAR(500) NOT NULL,
    product_image_url TEXT,
    
    -- Pricing (buyurtma vaqtidagi narx)
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal NUMERIC(12, 2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDER STATUS HISTORY TABLE
-- Buyurtma holati tarixi
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order number
CREATE TRIGGER set_order_number
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Orders policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
USING (
    auth.jwt() ->> 'email' LIKE '%admin%'
);

-- Admins can update all orders
CREATE POLICY "Admins can update all orders"
ON orders FOR UPDATE
USING (
    auth.jwt() ->> 'email' LIKE '%admin%'
);

-- Order items policies
CREATE POLICY "Users can view own order items"
ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create order items"
ON order_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all order items"
ON order_items FOR SELECT
USING (
    auth.jwt() ->> 'email' LIKE '%admin%'
);

-- Order status history policies
CREATE POLICY "Users can view own order history"
ON order_status_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_status_history.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage order history"
ON order_status_history FOR ALL
USING (
    auth.jwt() ->> 'email' LIKE '%admin%'
);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample order (uncomment to use)
/*
INSERT INTO orders (
    user_id, customer_name, customer_email, customer_phone,
    shipping_address, shipping_city, total_amount, final_amount,
    payment_method, status
) VALUES (
    auth.uid(),
    'Test Klinikasi',
    'test@example.com',
    '+998901234567',
    'Toshkent shahar, Yunusobod tumani, 5-mavze',
    'Toshkent',
    15000000,
    15000000,
    'bank_transfer',
    'pending'
);
*/

-- ============================================
-- VIEWS (Optional)
-- ============================================

-- Orders summary view
CREATE OR REPLACE VIEW orders_summary AS
SELECT 
    o.id,
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.final_amount,
    o.status,
    o.payment_status,
    o.created_at,
    COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id;

-- ============================================
-- CLEANUP (Use with caution!)
-- ============================================

-- Drop tables (uncomment only if you want to reset)
/*
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP FUNCTION IF EXISTS generate_order_number CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
*/
