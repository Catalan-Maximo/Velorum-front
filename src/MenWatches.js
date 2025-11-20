// 👨 **MENWATCHES.JS** - PÁGINA DE RELOJES PARA HOMBRE
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './FavoritesContext';
import { useCart } from './CartContext';
import { API_BASE_URL, fetchWithAuth } from './services';
import './Products.css'; // Reutilizamos los mismos estilos

function MenWatches() {
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
      'audemars': '/Hombre/Audemars piguet.png',
      'audemars piguet': '/Hombre/Audemars piguet.png',
      'cartier cuero': '/Hombre/Cartier Cuero.png',
      'cartier metalic': '/Hombre/Cartier Metalic.png',
      'cartier': '/Hombre/Cartier Metalic.png',
      'casio g shock': '/Hombre/Casio G shock.png',
      'g shock protection': '/Hombre/G Shock protection.png',
      'casio water': '/Hombre/Casio Water resist.png',
      'casio': '/Hombre/Casio G shock.png',
      'hamilton automatic': '/Hombre/Hamilton automatic.png',
      'hamilton': '/Hombre/Hamilton automatic.png',
      'omega sterany': '/Hombre/Omega sterany.png',
      'omega': '/Hombre/Omega sterany.png',
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
      'seiko': '/Hombre/Seiko mod.png'
    };
    if(map[key]) return map[key];
    const candidate = Object.keys(map)
      .sort((a,b)=> b.length - a.length)
      .find(k => key.includes(k));
    return candidate ? map[candidate] : '/logo192.png';
  };

  // 👨 RELOJES PARA HOMBRE - CON NUEVAS IMÁGENES ORGANIZADAS
  const menWatchesStatic = [
    {
      id: 1,
      name: "Audemars Piguet Royal Oak",
      price: 45999.99,
      originalPrice: 52999.99,
      image: "/Hombre/Audemars piguet.png",
      rating: 4.9,
      reviews: 234,
      category: "Lujo",
      description: "Reloj icónico de lujo con diseño octagonal distintivo y acabados excepcionales"
    },
    {
      id: 2,
      name: "Cartier Tank Cuero",
      price: 8999.99,
      originalPrice: 10999.99,
      image: "/Hombre/Cartier Cuero.png",
      rating: 4.8,
      reviews: 189,
      category: "Clásico",
      description: "Elegancia atemporal con correa de cuero genuino y diseño rectangular icónico"
    },
    {
      id: 3,
      name: "Cartier Tank Metálico",
      price: 12999.99,
      originalPrice: 15999.99,
      image: "/Hombre/Cartier Metalic.png",
      rating: 4.9,
      reviews: 156,
      category: "Lujo",
      description: "Versión metálica del clásico Tank con brazalete de acero inoxidable premium"
    },
    {
      id: 4,
      name: "Casio G-Shock",
      price: 399.99,
      originalPrice: 499.99,
      image: "/Hombre/Casio G shock.png",
      rating: 4.7,
      reviews: 892,
      category: "Deportivo",
      description: "Resistencia extrema y funciones deportivas para el hombre activo"
    },
    {
      id: 5,
      name: "Casio Water Resist",
      price: 299.99,
      originalPrice: 389.99,
      image: "/Hombre/Casio Water resist.png",
      rating: 4.6,
      reviews: 567,
      category: "Deportivo",
      description: "Resistente al agua con múltiples funciones para deportes acuáticos"
    },
    {
      id: 6,
      name: "G-Shock Protection",
      price: 449.99,
      originalPrice: 549.99,
      image: "/Hombre/G Shock protection.png",
      rating: 4.8,
      reviews: 423,
      category: "Deportivo",
      description: "Máxima protección contra impactos con tecnología avanzada"
    },
    {
      id: 7,
      name: "Hamilton Automatic",
      price: 1899.99,
      originalPrice: 2299.99,
      image: "/Hombre/Hamilton automatic.png",
      rating: 4.7,
      reviews: 234,
      category: "Clásico",
      description: "Movimiento automático suizo con diseño vintage refinado"
    },
    {
      id: 8,
      name: "Omega Seamaster",
      price: 6999.99,
      originalPrice: 8999.99,
      image: "/Hombre/Omega sterany.png",
      rating: 4.9,
      reviews: 345,
      category: "Lujo",
      description: "Reloj profesional con resistencia extrema y precisión suiza"
    },
    {
      id: 9,
      name: "Patek Philippe Calatrava",
      price: 32999.99,
      originalPrice: 39999.99,
      image: "/Hombre/Patek Philippe.png",
      rating: 5.0,
      reviews: 89,
      category: "Lujo",
      description: "La cúspide de la relojería suiza con artesanía excepcional"
    },
    {
      id: 10,
      name: "Poedagar 930",
      price: 199.99,
      originalPrice: 299.99,
      image: "/Hombre/poedagar 930.png",
      rating: 4.5,
      reviews: 678,
      category: "Casual",
      description: "Reloj casual moderno con excelente relación calidad-precio"
    },
    {
      id: 11,
      name: "Richard Mille",
      price: 89999.99,
      originalPrice: 105999.99,
      image: "/Hombre/Richard Mille.png",
      rating: 4.9,
      reviews: 45,
      category: "Lujo",
      description: "Innovación y lujo extremo en relojería deportiva de alta gama"
    },
    {
      id: 12,
      name: "Rolex Submariner",
      price: 18999.99,
      originalPrice: 22999.99,
      image: "/Hombre/Rolex Submarino.png",
      rating: 4.9,
      reviews: 567,
      category: "Lujo",
      description: "El icónico reloj de buceo con prestigio y funcionalidad excepcional"
    },
    {
      id: 13,
      name: "Seiko Mod",
      price: 599.99,
      originalPrice: 799.99,
      image: "/Hombre/Seiko mod.png",
      rating: 4.6,
      reviews: 234,
      category: "Casual",
      description: "Diseño modificado con estilo urbano y calidad japonesa confiable"
    }
  ];

  // Estado para los relojes (cargados desde backend o fallback a estáticos)
  const [menWatches, setMenWatches] = useState(menWatchesStatic);

  // Cargar relojes desde backend al montar el componente
  useEffect(() => {
    let mounted = true;
    const loadMenWatches = async () => {
      try {
        // Intentar petición pública primero
        let res = await fetch(`${API_BASE_URL}/main/model/watches/`);
        if (res.ok) {
          const data = await res.json();
          const list = data.results || data || [];
          if (mounted && Array.isArray(list) && list.length > 0) {
            // Mapear y filtrar solo relojes de hombre (IDs 1-12 según populate_watches.py)
            const mapped = list
              .filter(w => w.id >= 1 && w.id <= 12) // Relojes de hombre
              .map(w => ({
                id: w.id,
                watch_id: w.id,
                id_backend: w.id,
                name: w.marca ? `${w.marca} ${w.modelo || ''}`.trim() : w.modelo || 'Reloj',
                price: Number(w.precio) || 0,
                image: resolveWatchImage(w.marca, w.modelo),
                rating: 4.7,
                reviews: Math.floor(Math.random() * 500) + 50,
                category: getCategoryFromPrice(Number(w.precio)),
                description: w.descripcion || `Reloj ${w.marca} ${w.modelo} de alta calidad`
              }));
            
            if (mapped.length > 0) {
              setMenWatches(mapped);
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
              .filter(w => w.id >= 1 && w.id <= 12)
              .map(w => ({
                id: w.id,
                watch_id: w.id,
                id_backend: w.id,
                name: w.marca ? `${w.marca} ${w.modelo || ''}`.trim() : w.modelo || 'Reloj',
                price: Number(w.precio) || 0,
                image: resolveWatchImage(w.marca, w.modelo),
                rating: 4.7,
                reviews: Math.floor(Math.random() * 500) + 50,
                category: getCategoryFromPrice(Number(w.precio)),
                description: w.descripcion || `Reloj ${w.marca} ${w.modelo} de alta calidad`
              }));
            
            if (mapped.length > 0) {
              setMenWatches(mapped);
            }
          }
        }
      } catch (e) {
        console.error('Error cargando relojes de hombre:', e);
      }
    };
    
    loadMenWatches();
    return () => { mounted = false; };
  }, []);

  // Helper para determinar categoría según precio
  const getCategoryFromPrice = (price) => {
    if (price >= 20000) return 'Lujo';
    if (price >= 5000) return 'Premium';
    if (price >= 1000) return 'Clásico';
    if (price >= 500) return 'Casual';
    return 'Deportivo';
  };

  // 🔧 FUNCIONES DE FILTRADO
  const categories = ['Todos', 'Clásico', 'Deportivo', 'Lujo', 'Casual'];
  
  const filteredWatches = menWatches.filter(watch => 
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
  <div className="products-page men-page">
      {/* 🎯 HEADER DE LA PÁGINA */}
      <div className="products-header">
        <div className="header-content">
          <h1 className="page-title">Relojes para Hombre</h1>
          <p className="page-subtitle">
            Descubre nuestra colección exclusiva de relojes masculinos, diseñados 
            para el hombre moderno que busca estilo y funcionalidad.
          </p>
        </div>
      </div>

      {/* 📱 GRID DE PRODUCTOS */}
      <div className="products-container">
        {/* 🔍 SECCIÓN DE FILTROS */}
        <div className="products-filters">
          <h3>Filtros</h3>
          
          <div className="filter-group">
            <h4>Categoría</h4>
            <div className="filter-option">
              <input type="checkbox" id="luxury" />
              <label htmlFor="luxury">Lujo</label>
            </div>
            <div className="filter-option">
              <input type="checkbox" id="sport" />
              <label htmlFor="sport">Deportivo</label>
            </div>
            <div className="filter-option">
              <input type="checkbox" id="classic" />
              <label htmlFor="classic">Clásico</label>
            </div>
          </div>

          <div className="filter-group">
            <h4>Precio</h4>
            <div className="filter-option">
              <input type="checkbox" id="price1" />
              <label htmlFor="price1">Menos de $10,000</label>
            </div>
            <div className="filter-option">
              <input type="checkbox" id="price2" />
              <label htmlFor="price2">$10,000 - $30,000</label>
            </div>
            <div className="filter-option">
              <input type="checkbox" id="price3" />
              <label htmlFor="price3">Más de $30,000</label>
            </div>
          </div>
        </div>

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
                </div>
                <div className="product-actions-bottom">
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(watch);
                    }}
                  >
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xOSAyMGMwIDEuMTEtLjg5IDItMiAyYTIgMiAwIDAgMS0yLTJjMC0xLjExLjg5LTIgMi0yYTIgMiAwIDAgMSAyIDJNNyAxOGMtMS4xMSAwLTIgLjg5LTIgMmEyIDIgMCAwIDAgMiAyYzEuMTEgMCAyLS44OSAyLTJzLS44OS0yLTItMm0uMi0zLjM3bC0uMDMuMTJjMCAuMTQuMTEuMjUuMjUuMjVIMTl2Mkg3YTIgMiAwIDAgMS0yLTJjMC0uMzUuMDktLjY4LjI0LS45NmwxLjM2LTIuNDVMMyA0SDFWMmgzLjI3bC45NCAySDIwYy41NSAwIDEgLjQ1IDEgMWMwIC4xNy0uMDUuMzQtLjEyLjVsLTMuNTggNi40N2MtLjM0LjYxLTEgMS4wMy0xLjc1IDEuMDNIOC4xek04LjUgMTFIMTBWOUg3LjU2ek0xMSA5djJoM1Y5em0zLTFWNmgtM3Yyem0zLjExIDFIMTV2Mmgxem0xLjY3LTNIMTV2MmgyLjY3ek02LjE0IDZsLjk0IDJIMTBWNnoiLz48L3N2Zz4=" alt="Agregar al carrito" style={{width: '20px', height: '20px'}} />
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
            <span className="stat-number">{menWatches.length}</span>
            <span className="stat-label">Modelos Disponibles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.7</span>
            <span className="stat-label">Calificación Promedio</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1,047</span>
            <span className="stat-label">Reseñas Totales</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenWatches;
