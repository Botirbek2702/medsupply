import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import { HeroBanner, SectionTitle, ServiceSection } from "@/components/HomeSections";

export const revalidate = 0;

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*');
  return (
    <div className="container">
      <HeroBanner />

      <SectionTitle tkey="popular_products" />

      <div className="product-grid">
        {products?.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="product-card">
            <div className="product-image-container">
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
      
      <SectionTitle tkey="service_section" />
      <ServiceSection />
    </div>
  );
}
