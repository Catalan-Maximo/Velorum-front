// 🏠 **HOME.JS** - PÁGINA DE INICIO (SIN NAVBAR)

// 📦 IMPORTACIONES NECESARIAS
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useFavorites } from './FavoritesContext';
import './Home.css';

function Home({ user, isLoggedIn }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Detectar tamaño para condicionalmente ocultar el círculo
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const { addToCart, isInCart, getItemQuantity, setIsCartOpen } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Array de imágenes de relojes elegantes - RELOJES REALES
  const watchImages = [
    '/Hombre/Rolex Submarino.png', // Rolex Submariner icónico
    '/Mujer/Cartier oro 18k.png', // Cartier oro para mujer
    '/Hombre/Patek Philippe.png', // Patek Philippe lujo
    '/Mujer/Chopard.png', // Chopard Happy Diamonds
    '/Hombre/Omega sterany.png', // Omega Seamaster
    '/Mujer/Tag heuer Aquaracer.png' // TAG Heuer deportivo
  ];

  // Cambiar imagen cada 4 segundos (más tiempo para apreciar cada reloj)
  useEffect(() => {
    if (isMobile) return; // no rotar en móvil para ahorrar recursos
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % watchImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMobile, watchImages.length]);

  // Texto del hero
  const heroText = {
    subtitle: "COLECCIÓN PREMIUM 2025",
    title: "El tiempo habla por ti",
    description: "Relojes suizos de lujo que combinan artesanía tradicional con diseño contemporáneo. Cada pieza cuenta tu historia única.",
    primaryButton: "Productos", // Cambiado de "Explorar Colección"
    // secondaryButton eliminado
  };

  // Elementos flotantes
  const floatingElements = [
    "🇨🇭 Swiss Made",
    "⚙️ Movimiento Suizo", 
    "💎 Cristal Zafiro",
    "🛡️ Garantía Vitalicia"
  ];

  return (
    <div className="home-minimal">
      {/* 🎭 HERO PRINCIPAL */}
      <section className="hero-minimal">
        {/* 🎬 VIDEO DE FONDO */}
        <video 
          className="hero-background-video"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/videotest.webm" type="video/webm" />
          Tu navegador no soporta video HTML5.
        </video>

        {/* 📦 NUEVO CONTENIDO HERO */}
        <div className="hero-container">
          <div className="hero-text">
            <h1 className="hero-title" style={{ color: '#D3D3CE', textTransform: 'uppercase' }}>
              PREMIUM<br />WATCHES
            </h1>
            <p className="hero-description" style={{ color: '#D3D3CE' }}>Discover Modern Luxury</p>
            <button className="btn-primary" style={{ color: '#D3D3CE' }}>Shop Now</button>
          </div>
          <img
            src="/relojdelhero.png"
            alt="Reloj del Hero"
            className="hero-watch-image"
          />
        </div>
      </section>
 
      {/* ⭐ PRODUCTOS DESTACADOS */}
      <section className="featured-minimal">
        <div className="featured-container">
          <div className="section-header">
            <div>
              <h2>Relojes Destacados</h2>
              <p className="section-subtitle">Los más elegidos por nuestros clientes</p>
            </div>
            <button className="view-all-btn" onClick={() => navigate('/products')}>
              Ver catálogo completo →
            </button>
          </div>
          <div className="products-carousel">
            {(
              // Featured products list — limited to first 4 to keep a single row of 4 columns
              [
                {
                  id: 1,
                  name: "Rolex Submariner",
                  price: 18999,
                  originalPrice: 22999,
                  image: "/Hombre/Rolex Submarino.png",
                  badge: "Bestseller",
                  reviews: 567
                },
                {
                  id: 2,
                  name: "Cartier Oro 18k",
                  price: 15999,
                  originalPrice: 18999,
                  image: "/Mujer/Cartier oro 18k.png",
                  badge: "Premium",
                  reviews: 187
                },
                {
                  id: 3,
                  name: "Patek Philippe",
                  price: 32999,
                  originalPrice: 39999,
                  image: "/Hombre/Patek Philippe.png",
                  badge: "Exclusivo",
                  reviews: 89
                },
                {
                  id: 4,
                  name: "Chopard Happy Diamonds",
                  price: 12999,
                  originalPrice: 15999,
                  image: "/Mujer/Chopard.png",
                  badge: "Elegante",
                  reviews: 298
                },
                {
                  id: 5,
                  name: "Casio G-Shock",
                  price: 399,
                  originalPrice: 499,
                  image: "/Hombre/Casio G shock.png",
                  badge: "Deportivo",
                  reviews: 892
                },
                {
                  id: 6,
                  name: "TAG Heuer Aquaracer",
                  price: 2999,
                  originalPrice: 3999,
                  image: "/Mujer/Tag heuer Aquaracer.png",
                  badge: "Nuevo",
                  reviews: 234
                }
              ]
            ).slice(0,4).map(product => (
              <div key={product.id} className="product-card-new">
                <div className={`product-badge ${product.badge.toLowerCase()}`}>
                  {product.badge}
                </div>
                <div className="product-image-new">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button className="quick-view-btn" onClick={() => navigate(`/product/${product.id}`)}>
                      Vista rápida
                    </button>
                    <button 
                      className={`wishlist-btn ${isFavorite && isFavorite(product.id) ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite && toggleFavorite(product); }}
                      title={isFavorite && isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      {isFavorite && isFavorite(product.id) ? '❤️' : '♡'}
                    </button>
                  </div>
                </div>
                <div className="product-info-new">
                  <div className="product-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-text">({product.reviews})</span>
                  </div>
                  <h4>{product.name}</h4>
                  <div className="product-pricing">
                    <p className="product-price">${product.price.toLocaleString()}</p>
                    {/* original price removed */}
                  </div>
                  <button
                    className={`add-to-cart-new ${isInCart && isInCart(product.id) ? 'in-cart' : ''}`}
                    onClick={() => {
                      if (!isLoggedIn) {
                        navigate('/login');
                        return;
                      }
                      if (isInCart && isInCart(product.id)) {
                        // Ya está: abrir carrito para que lo vea
                        setIsCartOpen(true);
                      } else {
                        // Mapear badge a categoría visible (fallback a badge)
                        const categoryMap = {
                          Bestseller: 'Bestseller',
                          Premium: 'Premium',
                          Exclusivo: 'Exclusivo',
                          Elegante: 'Elegante',
                          Deportivo: 'Deportivo',
                          Nuevo: 'Nuevo'
                        };
                        const withCategory = { ...product, category: categoryMap[product.badge] || product.badge };
                        addToCart(withCategory);
                        setIsCartOpen(true); // abrir inmediatamente para feedback visual
                      }
                    }}
                  >
                    {isInCart && isInCart(product.id)
                      ? `En carrito (${getItemQuantity(product.id)})`
                      : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories section removed per request */}
    </div>
  );
}

export default Home;