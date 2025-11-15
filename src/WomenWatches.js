// 👩 **WOMENWATCHES.JS** - PÁGINA DE RELOJES PARA MUJER
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './FavoritesContext';
import { useCart } from './CartContext';
import { API_BASE_URL, fetchWithAuth } from './services';
import './Products.css'; // Reutilizamos los mismos estilos

function WomenWatches() {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  // 🔧 ESTADOS PARA FILTROS
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured');

  // 🔍 Resolver imagen según marca + modelo
  const resolveWatchImage = (marca, modelo) => {
    const key = `${marca || ''} ${modelo || ''}`.toLowerCase().trim();
    if(!key) return '/logo192.png';
    const map = {
      'cartier oro': '/Mujer/Cartier oro 18k.png',
      'chopard': '/Mujer/Chopard.png',
      'omega constellation': '/Mujer/Omega complelltion.png',
      'omega': '/Mujer/Omega complelltion.png',
      'patek philippe geneve': '/Mujer/Patek Philippe geneve.png',
      'patek philippe': '/Mujer/Patek Philippe geneve.png',
      'patek': '/Mujer/Patek Philippe geneve.png',
      'tag heuer aquaracer': '/Mujer/Tag heuer Aquaracer.png',
      'tag heuer': '/Mujer/Tag heuer Aquaracer.png'
    };
    if(map[key]) return map[key];
    const candidate = Object.keys(map)
      .sort((a,b)=> b.length - a.length)
      .find(k => key.includes(k));
    return candidate ? map[candidate] : '/logo192.png';
  };

  // 👩 RELOJES PARA MUJER - CON NUEVAS IMÁGENES ORGANIZADAS
  const womenWatchesStatic = [
    {
      id: 7,
      name: "Cartier Oro 18k",
      price: 15999.99,
      originalPrice: 18999.99,
      image: "/Mujer/Cartier oro 18k.png",
      rating: 4.9,
      reviews: 187,
      category: "Lujo",
      description: "Elegancia suprema en oro de 18 quilates con diseño atemporal francés"
    },
    {
      id: 8,
      name: "Chopard Happy Diamonds",
      price: 12999.99,
      originalPrice: 15999.99,
      image: "/Mujer/Chopard.png",
      rating: 4.8,
      reviews: 298,
      category: "Lujo",
      description: "Icónico diseño con diamantes flotantes, símbolo de alegría y elegancia"
    },
    {
      id: 9,
      name: "Omega Constellation",
      price: 4999.99,
      originalPrice: 6999.99,
      image: "/Mujer/Omega complelltion.png",
      rating: 4.7,
      reviews: 156,
      category: "Elegante",
      description: "Precisión suiza combinada con sofisticación femenina excepcional"
    },
    {
      id: 10,
      name: "Patek Philippe Genève",
      price: 28999.99,
      originalPrice: 34999.99,
      image: "/Mujer/Patek Philippe geneve.png",
      rating: 5.0,
      reviews: 67,
      category: "Lujo",
      description: "La cúspide de la relojería femenina con artesanía suiza incomparable"
    },
    {
      id: 11,
      name: "TAG Heuer Aquaracer",
      price: 2999.99,
      originalPrice: 3999.99,
      image: "/Mujer/Tag heuer Aquaracer.png",
      rating: 4.6,
      reviews: 234,
      category: "Deportivo",
      description: "Elegancia deportiva con resistencia al agua para la mujer activa"
    }
  ];

  // Estado para los relojes (cargados desde backend o fallback a estáticos)
  const [womenWatches, setWomenWatches] = useState(womenWatchesStatic);

  // Cargar relojes desde backend al montar el componente
  useEffect(() => {
    let mounted = true;
    const loadWomenWatches = async () => {
      try {
        // Intentar petición pública primero
        let res = await fetch(`${API_BASE_URL}/main/model/watches/`);
        if (res.ok) {
          const data = await res.json();
          const list = data.results || data || [];
          if (mounted && Array.isArray(list) && list.length > 0) {
            // Mapear y filtrar solo relojes de mujer (IDs 13-17 según populate_watches.py)
            const mapped = list
              .filter(w => w.id >= 13 && w.id <= 17) // Relojes de mujer
              .map(w => ({
                id: w.id,
                watch_id: w.id,
                id_backend: w.id,
                name: w.marca ? `${w.marca} ${w.modelo || ''}`.trim() : w.modelo || 'Reloj',
                price: Number(w.precio) || 0,
                image: resolveWatchImage(w.marca, w.modelo),
                rating: 4.7,
                reviews: Math.floor(Math.random() * 300) + 50,
                category: getCategoryFromPrice(Number(w.precio)),
                description: w.descripcion || `Reloj ${w.marca} ${w.modelo} de alta calidad`
              }));
            
            if (mapped.length > 0) {
              setWomenWatches(mapped);
              return;
            }
          }
        }

        // Si falla, intentar con autenticación
        res = await fetchWithAuth(`${API_BASE_URL}/main/model/watches/`, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          const list = data.results || data || [];
          if (mounted && Array.isArray(list) && list.length > 0) {
            const mapped = list
              .filter(w => w.id >= 13 && w.id <= 17)
              .map(w => ({
                id: w.id,
                watch_id: w.id,
                id_backend: w.id,
                name: w.marca ? `${w.marca} ${w.modelo || ''}`.trim() : w.modelo || 'Reloj',
                price: Number(w.precio) || 0,
                image: resolveWatchImage(w.marca, w.modelo),
                rating: 4.7,
                reviews: Math.floor(Math.random() * 300) + 50,
                category: getCategoryFromPrice(Number(w.precio)),
                description: w.descripcion || `Reloj ${w.marca} ${w.modelo} de alta calidad`
              }));
            
            if (mapped.length > 0) {
              setWomenWatches(mapped);
            }
          }
        }
      } catch (e) {
        console.error('Error cargando relojes de mujer:', e);
      }
    };
    
    loadWomenWatches();
    return () => { mounted = false; };
  }, []);

  // Helper para determinar categoría según precio
  const getCategoryFromPrice = (price) => {
    if (price >= 20000) return 'Lujo';
    if (price >= 5000) return 'Elegante';
    if (price >= 2000) return 'Premium';
    return 'Deportivo';
  };

  // 🔧 FUNCIONES DE FILTRADO
  const categories = ['Todos', 'Elegante', 'Lujo', 'Deportivo'];
  
  const filteredWatches = womenWatches.filter(watch => 
    selectedCategory === 'Todos' || watch.category === selectedCategory
  );

  const sortedWatches = [...filteredWatches].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
  <div className="products-page">
      {/* 🎯 HEADER DE LA PÁGINA */}
      <div className="products-header">
        <div className="header-content">
          <h1 className="page-title">Relojes para Mujer</h1>
          <p className="page-subtitle">
            Explora nuestra exquisita colección femenina, donde la elegancia 
            y la funcionalidad se encuentran en perfecta armonía.
          </p>
        </div>
      </div>

      {/* 🔧 FILTROS Y ORDENAMIENTO */}
      <div className="products-controls">
        <div className="controls-container">
          <div className="filters-section">
            <h3>Categorías</h3>
            <div className="filter-buttons">
              {categories.map(category => (
                <button 
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="sort-section">
            <label htmlFor="sort">Ordenar por:</label>
            <select 
              id="sort" 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Destacados</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
              <option value="newest">Más Nuevos</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📱 GRID DE PRODUCTOS */}
      <div className="products-container">
        <div className="products-grid">
          {sortedWatches.map(watch => (
            <div key={watch.id} className="product-card">
              {/* 🏷️ BADGE */}
              <div className={`product-badge ${watch.originalPrice ? 'discount' : watch.category.toLowerCase()}`}>
                {watch.originalPrice ? `-${Math.round(((watch.originalPrice - watch.price) / watch.originalPrice) * 100)}%` : watch.category}
              </div>
              
              {/* 🖼️ IMAGEN */}
              <div className="product-image">
                <img 
                  src={watch.image} 
                  alt={watch.name}
                />
                <div className={`product-actions ${isFavorite(watch.id) ? 'show' : ''}`}>
                  <button
                    className={`fav-btn ${isFavorite(watch.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(watch); }}
                    title={isFavorite(watch.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <span className="visually-hidden">{isFavorite(watch.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}</span>
                    {isFavorite(watch.id) ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-1-.7-2.5-2C6 16 3 13.2 3 9.8 3 7.1 5.1 5 7.8 5c1.5 0 3 .7 4.2 1.9C13.2 5.7 14.7 5 16.2 5 18.9 5 21 7.1 21 9.8c0 3.4-3 6.2-6.5 9.2-1.5 1.3-2.5 2-2.5 2Z" fill="currentColor"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-1-.7-2.5-2C6 16 3 13.2 3 9.8 3 7.1 5.1 5 7.8 5c1.5 0 3 .7 4.2 1.9C13.2 5.7 14.7 5 16.2 5 18.9 5 21 7.1 21 9.8c0 3.4-3 6.2-6.5 9.2-1.5 1.3-2.5 2-2.5 2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* � INFORMACIÓN */}
              <div className="product-info">
                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-text">({watch.reviews})</span>
                </div>
                <h3>{watch.name}</h3>
                <div className="product-pricing">
                  <span className="product-price">${watch.price}</span>
                  {watch.originalPrice && (
                    <span className="original-price">${watch.originalPrice}</span>
                  )}
                </div>
                <div className="product-actions-bottom">
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(watch);
                    }}
                  >
                    🛒 Agregar al Carrito
                  </button>
                  <button 
                    className="view-details-btn"
                    onClick={() => navigate(`/product/${watch.id}`)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 ESTADÍSTICAS DE LA COLECCIÓN */}
      <div className="collection-stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{womenWatches.length}</span>
            <span className="stat-label">Modelos Disponibles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.7</span>
            <span className="stat-label">Calificación Promedio</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1,075</span>
            <span className="stat-label">Reseñas Totales</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WomenWatches;
