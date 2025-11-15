import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from './FavoritesContext';
import { useCart } from './CartContext';
import './Products.css';
import { API_BASE_URL, fetchWithAuth } from './services';

function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  // 🔍 Resolver imagen según marca + modelo (normaliza y busca coincidencias)
  const resolveWatchImage = (marca, modelo) => {
    const key = `${marca || ''} ${modelo || ''}`.toLowerCase().trim();
    if(!key) return '/logo192.png';
    const map = {
      'audemars': '/Hombre/Audemars piguet.png',
      'audemars piguet': '/Hombre/Audemars piguet.png',
      'cartier cuero': '/Hombre/Cartier Cuero.png',
      'cartier metalic': '/Hombre/Cartier Metalic.png',
      'cartier oro': '/Mujer/Cartier oro 18k.png',
      'cartier': '/Hombre/Cartier Metalic.png',
      'casio g shock': '/Hombre/Casio G shock.png',
      'g shock protection': '/Hombre/G Shock protection.png',
      'casio water': '/Hombre/Casio Water resist.png',
      'casio': '/Hombre/Casio G shock.png',
      'hamilton automatic': '/Hombre/Hamilton automatic.png',
      'hamilton': '/Hombre/Hamilton automatic.png',
      'omega sterany': '/Hombre/Omega sterany.png',
      'omega constellation': '/Mujer/Omega complelltion.png',
      'omega': '/Hombre/Omega sterany.png',
      'patek philippe geneve': '/Mujer/Patek Philippe geneve.png',
      'patek philippe calatrava': '/Hombre/Patek Philippe.png',
      'patek philippe': '/Hombre/Patek Philippe.png',
      'patek': '/Hombre/Patek Philippe.png',
      'poedagar 930': '/Hombre/poedagar 930.png',
      'poedagar': '/Hombre/poedagar 930.png',
      'richard mille': '/Hombre/Richard Mille.png',
      'richard': '/Hombre/Richard Mille.png',
      'rolex submarino': '/Hombre/Rolex Submarino.png',
      'rolex': '/Hombre/Rolex Submarino.png',
      'seiko mod': '/Hombre/Seiko mod.png',
      'seiko': '/Hombre/Seiko mod.png',
      'tag heuer aquaracer': '/Mujer/Tag heuer Aquaracer.png',
      'tag heuer': '/Mujer/Tag heuer Aquaracer.png',
      'chopard': '/Mujer/Chopard.png'
    };
    // Búsqueda exacta primero
    if(map[key]) return map[key];
    // Luego buscar la clave cuyo texto esté incluido en key (más larga primero)
    const candidate = Object.keys(map)
      .sort((a,b)=> b.length - a.length)
      .find(k => key.includes(k));
    return candidate ? map[candidate] : '/logo192.png';
  };
  
  // Lista estática completa de fallback (la original extensa)
  const STATIC_PRODUCTS = [
    { id: 1, name: "Audemars Piguet Royal Oak", price: 45999, originalPrice: 52999, image: "/Hombre/Audemars piguet.png", category: "luxury", badge: "Premium", reviews: 234, gender: "men", description: "Diseño octogonal icónico en acero de alta gama con movimiento automático de precisión" },
    { id: 2, name: "Cartier Tank Cuero", price: 8999, originalPrice: 10999, image: "/Hombre/Cartier Cuero.png", category: "classic", badge: "Elegante", reviews: 189, gender: "men", description: "Clásico atemporal con caja rectangular y correa de cuero genuino" },
    { id: 3, name: "Cartier Tank Metálico", price: 12999, originalPrice: 15999, image: "/Hombre/Cartier Metalic.png", category: "luxury", badge: "Premium", reviews: 156, gender: "men", description: "Versión con brazalete metálico pulido y estética refinada" },
    { id: 4, name: "Casio G-Shock", price: 399, originalPrice: 499, image: "/Hombre/Casio G shock.png", category: "sport", badge: "Bestseller", reviews: 892, gender: "men", description: "Resistencia extrema a impactos y funcionalidades digitales avanzadas" },
    { id: 5, name: "Casio Water Resist", price: 299, originalPrice: 389, image: "/Hombre/Casio Water resist.png", category: "sport", badge: "Nuevo", reviews: 567, gender: "men", description: "Modelo fiable resistente al agua ideal para uso diario activo" },
    { id: 6, name: "G-Shock Protection", price: 449, originalPrice: 549, image: "/Hombre/G Shock protection.png", category: "sport", badge: "Resistente", reviews: 423, gender: "men", description: "Protección reforzada y diseño robusto con estética táctica" },
    { id: 7, name: "Hamilton Automatic", price: 1899, originalPrice: 2299, image: "/Hombre/Hamilton automatic.png", category: "classic", badge: "Automático", reviews: 234, gender: "men", description: "Movimiento automático suizo con esfera limpia de inspiración vintage" },
    { id: 8, name: "Omega Seamaster", price: 6999, originalPrice: 8999, image: "/Hombre/Omega sterany.png", category: "luxury", badge: "Profesional", reviews: 345, gender: "men", description: "Reloj de buceo profesional con excelente legibilidad y calibre de alta precisión" },
    { id: 9, name: "Patek Philippe Calatrava", price: 32999, originalPrice: 39999, image: "/Hombre/Patek Philippe.png", category: "luxury", badge: "Exclusivo", reviews: 89, gender: "men", description: "Minimalismo elegante con acabados artesanales excepcionales" },
    { id: 10, name: "Poedagar 930", price: 199, originalPrice: 299, image: "/Hombre/poedagar 930.png", category: "casual", badge: "Oferta", reviews: 678, gender: "men", description: "Estética moderna económica con presencia llamativa en muñeca" },
    { id: 11, name: "Richard Mille", price: 89999, originalPrice: 105999, image: "/Hombre/Richard Mille.png", category: "luxury", badge: "Ultra Premium", reviews: 45, gender: "men", description: "Ingeniería avanzada en materiales compuestos y diseño esquelético" },
    { id: 12, name: "Rolex Submariner", price: 18999, originalPrice: 22999, image: "/Hombre/Rolex Submarino.png", category: "luxury", badge: "Icónico", reviews: 567, gender: "men", description: "El estándar de relojes de buceo: robusto, preciso y reconocible" },
    { id: 13, name: "Seiko Mod", price: 599, originalPrice: 799, image: "/Hombre/Seiko mod.png", category: "casual", badge: "Moderno", reviews: 234, gender: "men", description: "Customización estilo diver con fiabilidad japonesa" },
    { id: 14, name: "Cartier Oro 18k", price: 15999, originalPrice: 18999, image: "/Mujer/Cartier oro 18k.png", category: "luxury", badge: "Oro 18k", reviews: 187, gender: "women", description: "Caja y detalles en oro 18k que irradian sofisticación" },
    { id: 15, name: "Chopard Happy Diamonds", price: 12999, originalPrice: 15999, image: "/Mujer/Chopard.png", category: "luxury", badge: "Diamantes", reviews: 298, gender: "women", description: "Diamantes móviles emblemáticos que aportan brillo dinámico" },
    { id: 16, name: "Omega Constellation", price: 4999, originalPrice: 6999, image: "/Mujer/Omega complelltion.png", category: "elegant", badge: "Elegante", reviews: 156, gender: "women", description: "Diseño con garras laterales y precisión certificada" },
    { id: 17, name: "Patek Philippe Genève", price: 28999, originalPrice: 34999, image: "/Mujer/Patek Philippe geneve.png", category: "luxury", badge: "Exclusivo", reviews: 67, gender: "women", description: "Alta relojería femenina con detalles artesanales de lujo" },
    { id: 18, name: "TAG Heuer Aquaracer", price: 2999, originalPrice: 3999, image: "/Mujer/Tag heuer Aquaracer.png", category: "sport", badge: "Deportivo", reviews: 234, gender: "women", description: "Rendimiento deportivo y elegancia funcional para uso acuático" }
  ];
  const [products, setProducts] = useState(STATIC_PRODUCTS);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // Primero intentamos una petición pública (sin Authorization)
        let res = await fetch(`${API_BASE_URL}/main/model/watches/`);
        if (res.ok) {
          const data = await res.json();
          const list = data.results || data || [];
          if (mounted && Array.isArray(list) && list.length > 0) {
            setProducts(list.map(w => ({
              id: w.id,
              watch_id: w.id, // 🔑 Agregar watch_id explícitamente para el checkout
              id_backend: w.id, // 🔑 También id_backend como respaldo
              name: w.marca ? `${w.marca} ${w.modelo || ''}`.trim() : w.modelo || 'Reloj',
              price: Number(w.precio) || 0,
              image: resolveWatchImage(w.marca, w.modelo), // 🖼️ Resolver imagen según marca+modelo
              category: w.categoria?.nombre || w.categoria || 'general', // Manejar category como objeto o string
              badge: 'Nuevo', // Badge por defecto
              reviews: w.reviews || 0,
              description: w.descripcion || ''
            })));
            return;
          }
        }

        // Si la petición pública falla (403/401) intentamos con fetchWithAuth
        res = await fetchWithAuth(`${API_BASE_URL}/main/model/watches/`, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          const list = data.results || data || [];
          if (mounted && Array.isArray(list) && list.length > 0) {
            setProducts(list.map(w => ({
              id: w.id,
              watch_id: w.id, // 🔑 Agregar watch_id explícitamente para el checkout
              id_backend: w.id, // 🔑 También id_backend como respaldo
              name: w.marca ? `${w.marca} ${w.modelo || ''}`.trim() : w.modelo || 'Reloj',
              price: Number(w.precio) || 0,
              image: resolveWatchImage(w.marca, w.modelo), // 🖼️ Resolver imagen según marca+modelo
              category: w.categoria?.nombre || w.categoria || 'general', // Manejar category como objeto o string
              badge: 'Nuevo', // Badge por defecto
              reviews: w.reviews || 0,
              description: w.descripcion || ''
            })));
            return;
          }
        }

        // Fallback: dejar STATIC_PRODUCTS
        console.warn('Falling back to static product list');
      } catch (e) {
        console.error('Error cargando relojes desde backend:', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Map para marcar primera tarjeta por categoría
  const firstCategoryRendered = useRef({});

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById('cat-' + location.hash.substring(1));
      if (target) {
        setTimeout(()=> target.scrollIntoView({behavior:'smooth', block:'start'}), 80);
      }
    }
  }, [location]);

  return (
    <div className="products-page">
      {/* 🎯 HEADER DE PRODUCTOS */}
      <div className="products-header">
        <div className="products-header-content">
          <h1>Catálogo de Productos</h1>
          <p>Aquí verás todos nuestros relojes</p>
          <div className="products-stats">
            {products.length} productos disponibles
          </div>
        </div>
      </div>

      {/* 📦 CONTENEDOR PRINCIPAL */}
      <div className="products-container">
        {/* 🛍️ GRID DE PRODUCTOS - 3 COLUMNAS */}
        <div className="products-grid">
          {products.map(product => {
            // Convertir category a string y manejar null/undefined
            const cat = product.category ? String(product.category).toLowerCase() : 'general';
            const anchorId = !firstCategoryRendered.current[cat] ? 'cat-' + cat : undefined;
            if (!firstCategoryRendered.current[cat]) firstCategoryRendered.current[cat] = true;
            return (
            <div key={product.id} className="product-card" id={anchorId}>
              {/* 🏷️ BADGE */}
              <div className={`product-badge ${product.originalPrice ? 'discount' : (product.badge || 'nuevo').toLowerCase()}`}>
                {product.originalPrice ? `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%` : (product.badge || 'Nuevo')}
              </div>
              
              {/* 🖼️ IMAGEN */}
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name || 'Reloj de lujo'}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJNMjI1IDE5MEgxNzVMMTUwIDIxMEwxMTAgMTcwTDEyNSAxNTVMMTUwIDE4MEwxNjUgMTY1SDIyNVYxOTBaIiBmaWxsPSIjY2NjIi8+PC9zdmc+';
                  }}
                />
                <div className="product-actions">
                  <button className="quick-view-btn" onClick={() => navigate(`/product/${product.id}`)}>
                    👁️
                  </button>
                  <button 
                    className={`wishlist-btn ${isFavorite(product.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                    title={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {isFavorite(product.id) ? '❤️' : '♡'}
                  </button>
                </div>
              </div>
              
              {/* 📋 INFORMACIÓN */}
              <div className="product-info">
                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-text">({product.reviews})</span>
                </div>
                <h3>{product.name}</h3>
                {product.description && (
                  <p className="product-desc-short">
                    {product.description}
                  </p>
                )}
                <div className="product-pricing">
                  <span className="product-price">${product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="product-actions-bottom">
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    🛒 Agregar al Carrito
                  </button>
                  <button 
                    className="view-details-btn"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          )})}
          {/* Anchor vacío para smart (no hay productos aún) */}
          <div id="cat-smart" style={{width:'100%', gridColumn:'1 / -1', padding:'40px 0', textAlign:'center', opacity:.7}}>
            Próximamente relojes inteligentes.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;