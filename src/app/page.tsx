"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Placeholder data for products
const products = [
  {
    id: 1,
    title: "Philips Achieva 1.5T MRT apparati, yuqori sifatli tasvirlash",
    price: "450 000 000 so'm",
    rating: 4.8,
    reviews: 12,
    image: "/images/mri_machine.png",
  },
  {
    id: 2,
    title: "Zamonaviy elektron kasalxona yotog'i, pult bilan boshqariladi",
    price: "12 500 000 so'm",
    rating: 4.5,
    reviews: 84,
    image: "/images/hospital_bed.png",
  },
  {
    id: 3,
    title: "Jarrohlik uskunalari to'plami, zanglamas po'latdan",
    price: "3 200 000 so'm",
    rating: 4.9,
    reviews: 156,
    image: "/images/surgical_tools.png",
  },
  {
    id: 4,
    title: "Portativ kardiomonitor, sensorli ekran bilan",
    price: "18 000 000 so'm",
    rating: 4.7,
    reviews: 45,
    image: "/images/hospital_bed.png", // Reusing image as placeholder
  },
  {
    id: 5,
    title: "Ultratovush tekshiruv apparati (UZI), rangli Doppler",
    price: "120 000 000 so'm",
    rating: 4.6,
    reviews: 23,
    image: "/images/mri_machine.png", // Reusing image as placeholder
  },
];

export default function Home() {
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
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="product-card">
            <div className="product-image-container">
              {/* Fallback styling in case image fails to load during dev */}
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image 
                  src={product.image} 
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <div className="product-rating">
                <span className="star">★</span>
                <span>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviews} ta sharh)</span>
              </div>
              <div className="product-footer">
                <span className="product-price">{product.price}</span>
                <button className="add-to-cart-btn" aria-label="Savatga qo'shish" onClick={(e) => e.preventDefault()}>
                  <ShoppingCart size={16} />
                </button>
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
