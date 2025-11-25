import React, { useState, useEffect } from 'react';
import { apiRequest } from './services';
import { useProducts } from './ProductsContext';
import './AdminProductsPanel.css';

function AdminProductsPanel() {
    const { refreshProducts } = useProducts();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [filtro, setFiltro] = useState('todos'); // todos, disponibles, sin-stock
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [resetGlobalLoading, setResetGlobalLoading] = useState(false);
    const [resetIndividualLoading, setResetIndividualLoading] = useState({});
    const [showResetModal, setShowResetModal] = useState(false);
    const PRODUCTOS_POR_PAGINA = 20;

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const data = await apiRequest('/market/model/products/');
            // Asegurar que siempre sea un array
            const productosArray = Array.isArray(data) ? data : (data.results || []);
            setProductos(productosArray);
        } catch (error) {
            console.error('Error cargando productos:', error);
            setProductos([]); // En caso de error, array vacío
        } finally {
            setLoading(false);
        }
    };

    const handleEditarPrecio = async (productoId) => {
        try {
            await apiRequest(`/market/products/${productoId}/update-price/`, {
                method: 'PATCH',
                body: JSON.stringify({ precio: parseFloat(nuevoPrecio) })
            });
            setEditando(null);
            setNuevoPrecio('');
            cargarProductos();
            alert('Precio actualizado correctamente');
        } catch (error) {
            alert('Error al actualizar precio: ' + error.message);
        }
    };

    const handleResetearStock = async (productoId) => {
        if (!window.confirm('¿Resetear el stock vendido de este producto?')) return;

        try {
            await apiRequest(`/market/products/${productoId}/reset-stock/`, {
                method: 'POST'
            });
            cargarProductos();
            alert('Stock reseteado correctamente');
        } catch (error) {
            alert('Error al resetear stock: ' + error.message);
        }
    };

    const handleResetearTodosPrecios = async () => {
        setResetGlobalLoading(true);
        try {
            const response = await apiRequest('/market/model/products/reset_all_prices/', {
                method: 'POST'
            });
            
            await cargarProductos();
            await refreshProducts();
            
            setShowResetModal(false);
            alert(`✅ ${response.actualizados} productos actualizados de ${response.total} totales`);
        } catch (error) {
            alert('❌ Error al resetear precios: ' + error.message);
        } finally {
            setResetGlobalLoading(false);
        }
    };

    const handleResetearPrecioIndividual = async (productoId) => {
        setResetIndividualLoading(prev => ({ ...prev, [productoId]: true }));
        try {
            const response = await apiRequest(`/market/model/products/${productoId}/reset_price/`, {
                method: 'POST'
            });
            
            await cargarProductos();
            await refreshProducts();
            
            alert(`✅ Precio reseteado: $${response.precio_proveedor} × 2 = $${response.precio_nuevo}`);
        } catch (error) {
            alert('❌ Error: ' + error.message);
        } finally {
            setResetIndividualLoading(prev => ({ ...prev, [productoId]: false }));
        }
    };

    const productosFiltrados = productos.filter(p => {
        // Filtro por disponibilidad
        if (filtro === 'disponibles' && !p.stock_ilimitado && p.stock_proveedor <= 0) return false;
        if (filtro === 'sin-stock' && (p.stock_ilimitado || p.stock_proveedor > 0)) return false;

        // Búsqueda por nombre
        if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;

        return true;
    });

    // Paginación
    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
    const indiceInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const indiceFin = indiceInicio + PRODUCTOS_POR_PAGINA;
    const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

    if (loading) {
        return <div className="admin-products-panel loading">Cargando productos...</div>;
    }

    return (
        <div className="admin-products-panel">
            <div className="products-filters">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(1);
                    }}
                    className="search-input"
                />

                <select 
                    value={filtro} 
                    onChange={(e) => {
                        setFiltro(e.target.value);
                        setPaginaActual(1);
                    }} 
                    className="filter-select"
                >
                    <option value="todos">Todos los productos</option>
                    <option value="disponibles">Solo disponibles</option>
                    <option value="sin-stock">Sin stock</option>
                </select>
                
                <span className="stat">Total: {productos.length}</span>
                <span className="stat">Disponibles: {productos.filter(p => p.stock_ilimitado || p.stock_proveedor > 0).length}</span>
                <span className="stat">Sin stock: {productos.filter(p => !p.stock_ilimitado && p.stock_proveedor === 0).length}</span>
                
                <button 
                    className="btn-reset-all-prices"
                    onClick={() => setShowResetModal(true)}
                    title="Resetear todos los precios a precio_proveedor × 2"
                >
                    ⟲ Resetear Todos los Precios (×2)
                </button>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Subcategoría</th>
                            <th>Precio Prov.</th>
                            <th>Tu Precio</th>
                            <th>Stock Prov.</th>
                            <th>Stock Vendido</th>
                            <th>Disponible</th>
                            <th>Última Sync</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosPaginados.map(producto => (
                            <tr key={producto.id}>
                                <td className="product-name">{producto.nombre}</td>
                                <td className="category-cell">{typeof producto.categoria === 'object' ? producto.categoria.nombre : producto.categoria}</td>
                                <td className="subcategory-cell">
                                    {producto.subcategoria ? (typeof producto.subcategoria === 'object' ? producto.subcategoria.nombre : producto.subcategoria) : '-'}
                                </td>
                                <td>${producto.precio_proveedor || '-'}</td>
                                <td>
                                    {editando === producto.id ? (
                                        <input
                                            type="number"
                                            value={nuevoPrecio}
                                            onChange={(e) => setNuevoPrecio(e.target.value)}
                                            className="price-input"
                                        />
                                    ) : (
                                        <span className={producto.precio_manual ? 'manual-price' : ''}>
                                            ${producto.precio}
                                            {producto.precio_manual && ' ✏️'}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {producto.stock_ilimitado ? (
                                        <span className="stock-badge ilimitado">
                                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0xOC42IDYuNjJDMjEuNTggNi42MiAyNCA5IDI0IDEyYzAgMi45Ni0yLjQyIDUuMzctNS40IDUuMzdjLTEuNDUgMC0yLjgtLjU2LTMuODItMS41N0wxMiAxMy4zNGwtMi44MyAyLjUxYy0uOTcuOTctMi4zMyAxLjUzLTMuNzcgMS41M0MyLjQyIDE3LjM4IDAgMTQuOTYgMCAxMnMyLjQyLTUuMzggNS40LTUuMzhjMS40NCAwIDIuOC41NiAzLjgyIDEuNThMMTIgMTAuNjZsMi44My0yLjUxYy45Ny0uOTcgMi4zMy0xLjUzIDMuNzctMS41M003LjggMTQuMzlMMTAuNSAxMkw3Ljg0IDkuNjVjLS42OC0uNjgtMS41My0xLjAzLTIuNDQtMS4wM0MzLjUzIDguNjIgMiAxMC4xMyAyIDEyczEuNTMgMy4zOCAzLjQgMy4zOGMuOTEgMCAxLjc2LS4zNSAyLjQtLjk5bTguNC00Ljc4TDEzLjUgMTJsMi42NiAyLjM1Yy42OC42OCAxLjU0IDEuMDMgMi40NCAxLjAzYzEuODcgMCAzLjQtMS41MSAzLjQtMy4zOHMtMS41My0zLjM4LTMuNC0zLjM4Yy0uOTEgMC0xLjc2LjM1LTIuNC45OSIvPjwvc3ZnPg==" alt="Ilimitado" style={{width: '20px', height: '20px'}} />
                                        </span>
                                    ) : producto.stock_proveedor}
                                </td>
                                <td>{producto.stock_vendido || 0}</td>
                                <td>
                                    <span className={`stock-badge ${(producto.stock_ilimitado || producto.stock_proveedor > 0) ? 'disponible' : 'agotado'}`}>
                                        {(producto.stock_ilimitado || producto.stock_proveedor > 0) ? 
                                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Im05LjU1IDE4bC01LjctNS43bDEuNDI1LTEuNDI1TDkuNTUgMTUuMTVsOS4xNzUtOS4xNzVMMjAuMTUgNy40eiIvPjwvc3ZnPg==" alt="Disponible" style={{width: '20px', height: '20px'}} /> : 
                                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0xMiAyMGE4IDggMCAwIDEtOC04SDJjMCA1LjUyMyA0LjQ3NyAxMCAxMCAxMHptMC0xNmE4IDggMCAwIDEgOCA4aDJjMC01LjUyMy00LjQ3Ny0xMC0xMC0xMHptLTggOGE3Ljk3IDcuOTcgMCAwIDEgMi4zNDMtNS42NTdMNC45MyA0LjkzQTkuOTcgOS45NyAwIDAgMCAyIDExLjk5OXptMi4zNDMtNS42NTdBNy45NyA3Ljk3IDAgMCAxIDEyIDRWMmE5Ljk3IDkuOTcgMCAwIDAtNy4wNzEgMi45Mjl6bS0xLjQxNCAwbDEyLjcyOCAxMi43MjhsMS40MTQtMS40MTRMNi4zNDMgNC45Mjl6TTIwIDEyYTcuOTcgNy45NyAwIDAgMS0yLjM0MyA1LjY1N2wxLjQxNCAxLjQxNEE5Ljk3IDkuOTcgMCAwIDAgMjIgMTJ6bS0yLjM0MyA1LjY1N0E3Ljk3IDcuOTcgMCAwIDEgMTIgMjB2MmE5Ljk3IDkuOTcgMCAwIDAgNy4wNzEtMi45Mjl6Ii8+PC9zdmc+" alt="No disponible" style={{width: '20px', height: '20px'}} />
                                        }
                                    </span>
                                </td>
                                <td className="last-sync">
                                    {producto.last_sync ? new Date(producto.last_sync).toLocaleString() : '-'}
                                </td>
                                <td className="actions">
                                    {editando === producto.id ? (
                                        <>
                                            <button 
                                                onClick={() => handleEditarPrecio(producto.id)}
                                                className="btn-save"
                                            >
                                                Guardar
                                            </button>
                                            <button 
                                                onClick={() => setEditando(null)}
                                                className="btn-cancel"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    setEditando(producto.id);
                                                    setNuevoPrecio(producto.precio);
                                                }}
                                                className="btn-edit"
                                                title="Editar precio manualmente"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleResetearPrecioIndividual(producto.id)}
                                                className="btn-reset-price"
                                                disabled={resetIndividualLoading[producto.id] || !producto.precio_proveedor}
                                                title={producto.precio_proveedor ? `Resetear a $${producto.precio_proveedor} × 2` : 'Sin precio de proveedor'}
                                            >
                                                {resetIndividualLoading[producto.id] ? '⏳' : '↻'}
                                            </button>
                                            <button 
                                                onClick={() => handleResetearStock(producto.id)}
                                                className="btn-reset"
                                                title="Resetear stock vendido"
                                            >
                                                🔄
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {productosFiltrados.length === 0 && (
                <div className="no-products">
                    No se encontraron productos
                </div>
            )}

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
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
                                    onClick={() => setPaginaActual(i)}
                                    className={`pagination-btn ${paginaActual === i ? 'active' : ''}`}
                                >
                                    {i}
                                </button>
                            );
                        }
                        return pages;
                    })()}
                    
                    <button
                        onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                        disabled={paginaActual === totalPaginas}
                        className="pagination-btn"
                    >
                        Siguiente →
                    </button>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN RESET GLOBAL */}
            {showResetModal && (
                <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>⚠️ Resetear Todos los Precios</h2>
                            <button className="btn-close" onClick={() => setShowResetModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{marginBottom: '16px', fontSize: '15px', lineHeight: '1.6'}}>
                                Estás por <strong>resetear el precio de TODOS los productos</strong> a su valor predeterminado:
                            </p>
                            <div style={{
                                background: '#f8f9fa', 
                                padding: '12px 16px', 
                                borderRadius: '8px',
                                marginBottom: '16px',
                                borderLeft: '4px solid #0d6efd'
                            }}>
                                <code style={{fontSize: '14px', fontWeight: '600'}}>
                                    Precio Final = Precio Proveedor × 2
                                </code>
                            </div>
                            <p style={{marginBottom: '8px', fontSize: '14px', color: '#dc3545'}}>
                                ⚠️ Esta acción afectará <strong>{productos.length} productos</strong> y <strong>no se puede deshacer</strong>.
                            </p>
                            <p style={{margin: '0', fontSize: '14px', color: '#6c757d'}}>
                                Los precios editados manualmente volverán al valor automático.
                            </p>
                        </div>
                        <div className="modal-footer" style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                            <button 
                                className="btn-secondary" 
                                onClick={() => setShowResetModal(false)}
                                disabled={resetGlobalLoading}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-danger" 
                                onClick={handleResetearTodosPrecios}
                                disabled={resetGlobalLoading}
                            >
                                {resetGlobalLoading ? 'Reseteando...' : '✓ Confirmar Reset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProductsPanel;
