import React, { useState, useEffect } from 'react';
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
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const PRODUCTOS_POR_PAGINA = 10;

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
            
            return {
              id: p.id,
              watch_id: p.id,
              id_backend: p.id,
              name: p.nombre || 'Producto',
              price: Number(p.precio) || 0,
              image: imagen,
              category: p.categoria?.nombre || 'Relojes',
              badge: p.en_oferta ? 'Oferta' : 'Nuevo',
              reviews: 0,
              description: p.descripcion || '',
              stock: p.stock_disponible || 0
            };
          });
          
          console.log('✅ Productos cargados:', mappedProducts.length);
          setAllProducts(mappedProducts);
        }
      } catch (e) {
        console.error('❌ Error cargando productos:', e);
      } finally {
        setLoading(false);
      }
    };
    
    cargarProductos();
  }, []);

  // Filtrar productos por categoría
  const productosFiltrados = categoriaFiltro === 'Todos' 
    ? allProducts 
    : allProducts.filter(p => p.category === categoriaFiltro);

  // Calcular paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const indiceFin = indiceInicio + PRODUCTOS_POR_PAGINA;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  // Categorías disponibles
  const categorias = ['Todos', ...new Set(allProducts.map(p => p.category))];

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
          <p>Todos nuestros relojes disponibles</p>
          <div className="products-stats">
            {productosFiltrados.length} productos {categoriaFiltro !== 'Todos' && `en ${categoriaFiltro}`}
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="products-filters" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px',
        flexWrap: 'wrap'
      }}>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setCategoriaFiltro(cat);
              setPaginaActual(1);
            }}
            style={{
              padding: '10px 20px',
              border: categoriaFiltro === cat ? '2px solid #d4af37' : '1px solid #ddd',
              background: categoriaFiltro === cat ? '#d4af37' : 'white',
              color: categoriaFiltro === cat ? 'white' : '#333',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: categoriaFiltro === cat ? 'bold' : 'normal'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="products-container">
        <div className="products-grid">
          {productosPaginados.map(product => (
            <div key={product.id} className="product-card">
              <div className={`product-badge ${product.badge.toLowerCase()}`}>
                {product.badge}
              </div>
              
              <div className="product-image">
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
                    {product.stock > 0 ? '🛒 Agregar al Carrito' : '❌ Sin Stock'}
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
      </div>

      {/* PAGINACIÓN */}
      
      {totalPaginas > 1 && (
        <div className="pagination" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          padding: '40px 20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              background: paginaActual === 1 ? '#eee' : 'white',
              cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '5px'
            }}
          >
            ← Anterior
          </button>
          
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPaginaActual(i + 1)}
              style={{
                padding: '10px 15px',
                border: paginaActual === i + 1 ? '2px solid #d4af37' : '1px solid #ddd',
                background: paginaActual === i + 1 ? '#d4af37' : 'white',
                color: paginaActual === i + 1 ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '5px',
                fontWeight: paginaActual === i + 1 ? 'bold' : 'normal'
              }}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              background: paginaActual === totalPaginas ? '#eee' : 'white',
              cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
              borderRadius: '5px'
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
