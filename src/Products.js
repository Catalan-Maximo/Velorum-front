import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from './FavoritesContext';
import { useCart } from './CartContext';
import './Products.css';
import { API_BASE_URL } from './services';

function Products() {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  const [allProducts, setAllProducts] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(1000000);
  const [precioMinInput, setPrecioMinInput] = useState(0);
  const [precioMaxInput, setPrecioMaxInput] = useState(1000000);
  const priceTrackRef = useRef(null);
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('destacados');
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const PRODUCTOS_POR_PAGINA = 12;

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        console.log('🔍 Cargando productos desde:', `${API_BASE_URL}/market/model/products/`);
        const res = await fetch(`${API_BASE_URL}/market/model/products/`);
        
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.results || []);
          
          const mappedProducts = list.map((p, index) => {
            if (index === 0) {
              console.log('📦 Primer producto completo:', p);
              console.log('  - imagenes field:', p.imagenes);
              console.log('  - es array?', Array.isArray(p.imagenes));
              console.log('  - length:', p.imagenes?.length);
            }
            
            let imagen = '/logo192.png';
            if (p.imagenes && Array.isArray(p.imagenes) && p.imagenes.length > 0) {
              imagen = p.imagenes[0];
              if (index === 0) console.log('  ✅ Imagen asignada:', imagen);
            } else {
              if (index === 0) console.log('  ⚠️ Usando imagen por defecto');
            }
            
            let genero = 'Unisex';
            const nombreLower = (p.nombre || '').toLowerCase();
            const categoriaLower = (p.categoria?.nombre || '').toLowerCase();
            
            if (nombreLower.includes('mujer') || nombreLower.includes('woman') || nombreLower.includes('women') ||
                categoriaLower.includes('mujer') || categoriaLower.includes('woman') || categoriaLower.includes('women')) {
              genero = 'Mujer';
            } else if (nombreLower.includes('hombre') || nombreLower.includes('man') || nombreLower.includes('men') ||
                       categoriaLower.includes('hombre') || categoriaLower.includes('man') || categoriaLower.includes('men')) {
              genero = 'Hombre';
            }
            
            return {
              id: p.id,
              watch_id: p.id,
              id_backend: p.id,
              name: p.nombre || 'Producto',
              price: Number(p.precio) || 0,
              image: imagen,
              category: p.categoria?.nombre || 'Relojes',
              genero: genero,
              badge: p.en_oferta ? 'Oferta' : 'Nuevo',
              reviews: 0,
              description: p.descripcion || '',
              stock: p.stock_disponible || 0
            };
          });
          
          console.log('✅ Productos cargados:', mappedProducts.length);
          setAllProducts(mappedProducts);
          
          if (mappedProducts.length > 0) {
            const precios = mappedProducts.map(p => p.price);
            const min = Math.floor(Math.min(...precios));
            const max = Math.ceil(Math.max(...precios));
            setPrecioMin(min);
            setPrecioMax(max);
            setPrecioMinInput(min);
            setPrecioMaxInput(max);
          }
        }
      } catch (e) {
        console.error('❌ Error cargando productos:', e);
      } finally {
        setLoading(false);
      }
    };
    
    cargarProductos();
  }, []);

  useEffect(() => {
    if (!priceTrackRef.current || precioMax <= precioMin) return;
    const range = precioMax - precioMin || 1;
    const minPct = ((precioMinInput - precioMin) / range) * 100;
    const maxPct = ((precioMaxInput - precioMin) / range) * 100;
    priceTrackRef.current.style.background = `linear-gradient(90deg, #e2e8f0 0%, #e2e8f0 ${minPct}%, #0d4ca3 ${minPct}%, #1e5bb8 ${maxPct}%, #e2e8f0 ${maxPct}%, #e2e8f0 100%)`;
  }, [precioMinInput, precioMaxInput, precioMin, precioMax]);

  let productosFiltrados = allProducts.filter(p => {
    if (categoriaFiltro !== 'Todos' && p.category !== categoriaFiltro) return false;
    if (p.price < precioMinInput || p.price > precioMaxInput) return false;
    if (busqueda && !p.name.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  switch (ordenamiento) {
    case 'precio-asc':
      productosFiltrados = [...productosFiltrados].sort((a, b) => a.price - b.price);
      break;
    case 'precio-desc':
      productosFiltrados = [...productosFiltrados].sort((a, b) => b.price - a.price);
      break;
    case 'nombre-asc':
      productosFiltrados = [...productosFiltrados].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'nombre-desc':
      productosFiltrados = [...productosFiltrados].sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const indiceFin = indiceInicio + PRODUCTOS_POR_PAGINA;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  const categorias = ['Todos', ...Array.from(new Set(allProducts.map(p => p.category).filter(c => c && c.toLowerCase() !== 'relojes')))];

  const limpiarFiltros = () => {
    setCategoriaFiltro('Todos');
    setPrecioMinInput(precioMin);
    setPrecioMaxInput(precioMax);
    setBusqueda('');
    setOrdenamiento('destacados');
    setPaginaActual(1);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-header">
          <h1>Cargando productos...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <div className="products-header-content">
          <h1>Catálogo de Productos</h1>
          <p>Descubre nuestra colección completa de relojes</p>
          <div className="products-stats">
            {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'} encontrados
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="products-container">
        {/* FILTROS LATERALES */}
        <aside className="products-filters">
          {/* 🏷️ TÍTULO + SEPARADOR AZUL */}
          <div className="filters-header">
            <h3 className="filters-title">Filtros</h3>
            <div className="filters-divider" />
          </div>

          {filtersOpen && (
            <div className="filters-content">
              {/* 🔍 Búsqueda */}
              <div className="filter-group">
                <h4>Buscar</h4>
                <input
                  type="text"
                  className="search-filter-input"
                  placeholder="Nombre del producto..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                  }}
                />
              </div>

              {/* 📂 Categoría */}
              <div className="filter-group">
                <h4>Categoría</h4>
                <div className="filter-options-list">
                  {categorias.map(cat => (
                    <label key={cat} className="filter-checkbox-label">
                      <input
                        type="radio"
                        name="categoria"
                        checked={categoriaFiltro === cat}
                        onChange={() => {
                          setCategoriaFiltro(cat);
                          setPaginaActual(1);
                        }}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 💰 Rango de Precio */}
              <div className="filter-group">
                <h4>Rango de Precio</h4>
                <div className="price-range-display">
                  <span>${precioMinInput.toLocaleString()}</span>
                  <span>${precioMaxInput.toLocaleString()}</span>
                </div>

                <div className="price-slider-container" ref={priceTrackRef}>
                  <input
                    type="range"
                    min={precioMin}
                    max={precioMax}
                    value={precioMinInput}
                    className="price-slider price-slider-min"
                    onChange={(e) => {
                      const value = Math.min(Number(e.target.value), precioMaxInput - 1);
                      setPrecioMinInput(value);
                      setPaginaActual(1);
                    }}
                  />

                  <input
                    type="range"
                    min={precioMin}
                    max={precioMax}
                    value={precioMaxInput}
                    className="price-slider price-slider-max"
                    onChange={(e) => {
                      const value = Math.max(Number(e.target.value), precioMinInput + 1);
                      setPrecioMaxInput(value);
                      setPaginaActual(1);
                    }}
                  />
                </div>
              </div>

              {/* ↕ Ordenamiento */}
              <div className="filter-group">
                <h4>Ordenar por</h4>
                <select
                  className="sort-select-filter"
                  value={ordenamiento}
                  onChange={(e) => {
                    setOrdenamiento(e.target.value);
                    setPaginaActual(1);
                  }}
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                  <option value="nombre-asc">Nombre: A-Z</option>
                  <option value="nombre-desc">Nombre: Z-A</option>
                </select>
              </div>

              {/* 🧹 BOTÓN LIMPIAR ABAJO */}
              <div className="filters-footer">
                <button
                  className="clear-filters-btn"
                  onClick={limpiarFiltros}
                  disabled={
                    categoriaFiltro === 'Todos' &&
                    precioMinInput === precioMin &&
                    precioMaxInput === precioMax &&
                    !busqueda
                  }
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* GRID DE PRODUCTOS */}
        <div className="products-grid-container">
          <div className="products-grid">
            {productosPaginados.map(product => (
              <div key={product.id} className="product-card">
                <div className={`product-badge ${product.badge.toLowerCase()}`}>
                  {product.badge}
                </div>
                
                <div className="product-image" onClick={() => navigate(`/product/${product.id}`)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = '/logo192.png';
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
                    >
                      {isFavorite(product.id) ? '❤️' : '♡'}
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <div className="product-rating">
                    <span className="stars">★★★★★</span>
                  </div>
                  <h3>{product.name}</h3>
                  {product.description && (
                    <p 
                      className="product-desc-short"
                      dangerouslySetInnerHTML={{
                        __html: product.description.slice(0, 100) + '...'
                      }}
                    />
                  )}
                  <div className="product-pricing">
                    <span className="product-price">${product.price.toLocaleString()}</span>
                  </div>
                  <div className="product-actions-bottom">
                    <button 
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? (
                        <>
                          <img 
                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xOSAyMGMwIDEuMTEtLjg5IDItMiAyYTIgMiAwIDAgMS0yLTJjMC0xLjExLjg5LTIgMi0yYTIgMiAwIDAgMSAyIDJNNyAxOGMtMS4xMSAwLTIgLjg5LTIgMmEyIDIgMCAwIDAgMiAyYzEuMTEgMCAyLS44OSAyLTJzLS44OS0yLTItMm0uMi0zLjM3bC0uMDMuMTJjMCAuMTQuMTEuMjUuMjUuMjVIMTl2Mkg3YTIgMiAwIDAgMS0yLTJjMC0uMzUuMDktLjY4LjI0LS45NmwxLjM2LTIuNDVMMyA0SDFWMmgzLjI3bC45NCAySDIwYy41NSAwIDEgLjQ1IDEgMWMwIC4xNy0uMDUuMzQtLjEyLjVsLTMuNTggNi40N2MtLjM0LjYxLTEgMS4wMy0xLjc1IDEuMDNIOC4xek04LjUgMTFIMTBWOUg3LjU2ek0xMSA5djJoM1Y5em0zLTFWNmgtM3Yyem0zLjExIDFIMTV2Mmgxem0xLjY3LTNIMTV2MmgyLjY3ek02LjE0IDZsLjk0IDJIMTBWNnoiLz48L3N2Zz4="
                            alt="Cart"
                            style={{ width: '20px', height: '20px' }}
                          />
                        </>
                      ) : 'No hay stock'}
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
            ))}
          </div>

          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div className="pagination">
              <button
                onClick={() => {
                  setPaginaActual(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={paginaActual === 1}
                className="pagination-btn"
              >
                ← Anterior
              </button>
              
              {(() => {
                const maxVisible = 8;
                let startPage = Math.max(1, paginaActual - Math.floor(maxVisible / 2));
                let endPage = Math.min(totalPaginas, startPage + maxVisible - 1);
                
                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }
                
                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => {
                        setPaginaActual(i);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`pagination-btn ${paginaActual === i ? 'active' : ''}`}
                    >
                      {i}
                    </button>
                  );
                }
                return pages;
              })()}
              
              <button
                onClick={() => {
                  setPaginaActual(p => Math.min(totalPaginas, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={paginaActual === totalPaginas}
                className="pagination-btn"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
