import React, { useState, useEffect } from 'react';
import { apiRequest } from './services';
import './AdminProductsPanel.css';

function AdminProductsPanel() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [filtro, setFiltro] = useState('todos'); // todos, disponibles, sin-stock
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
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
            <div className="products-header">
                <h2>Gestión de Productos</h2>
                <div className="products-stats">
                    <span className="stat">Total: {productos.length}</span>
                    <span className="stat">Disponibles: {productos.filter(p => p.stock_ilimitado || p.stock_proveedor > 0).length}</span>
                    <span className="stat">Sin stock: {productos.filter(p => !p.stock_ilimitado && p.stock_proveedor === 0).length}</span>
                </div>
            </div>

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
                                    {producto.stock_ilimitado ? '♾️ Ilimitado' : producto.stock_proveedor}
                                </td>
                                <td>{producto.stock_vendido || 0}</td>
                                <td>
                                    <span className={`stock-badge ${(producto.stock_ilimitado || producto.stock_proveedor > 0) ? 'disponible' : 'agotado'}`}>
                                        {(producto.stock_ilimitado || producto.stock_proveedor > 0) ? '✅' : '❌'}
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
                                            >
                                                Editar Precio
                                            </button>
                                            {producto.stock_vendido > 0 && (
                                                <button 
                                                    onClick={() => handleResetearStock(producto.id)}
                                                    className="btn-reset"
                                                >
                                                    Resetear Stock
                                                </button>
                                            )}
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

export default AdminProductsPanel;
