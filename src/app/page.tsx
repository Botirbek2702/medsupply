import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";

export const revalidate = 0;

export default async function Home() {
  const { data: products, error } = await supabase.from('products').select('*');
  return (
    <div className="container">
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Tibbiyot texnikalarini qulay narxlarda xarid qiling</h1>
          <p>Barcha turdagi tibbiy jihozlar va ularga sifatli servis xizmati.</p>
          <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '16px' }}>
            Katalogni ko'rish
          </button>
        </div>
        <div style={{ width: '300px', height: '200px', position: 'relative' }}>
          {/* We would typically put a hero graphic here */}
        </div>
      </div>

      <h2 className="section-title">Ommabop tovarlar</h2>
      
      <div className="product-grid">
        {products?.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="product-card">
            <div className="product-image-container">
              {/* Fallback styling in case image fails to load during dev */}
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image 
                  src={product.image_url || '/placeholder.png'} 
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <FavoriteButton product={product} />
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <div className="product-rating">
                <span className="star">★</span>
                <span>{product.rating}</span>
              </div>
              <div className="product-footer">
                <span className="product-price">{Number(product.price).toLocaleString('uz-UZ')} so'm</span>
                <AddToCartButton product={product} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <h2 className="section-title">Servis xizmatlari</h2>
      <div style={{ 
        padding: '32px', 
        backgroundColor: '#fff', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--border-color)',
        marginBottom: '60px'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Tibbiyot uskunangiz buzildimi?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Bizning malakali muhandislarimiz barcha turdagi meditsina texnikalarini ta'mirlaydi va xizmat ko'rsatadi.
        </p>
        <button className="btn btn-primary">Xizmatga buyurtma berish</button>
      </div>
    </div>
  );
}
