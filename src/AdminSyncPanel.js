import React, { useState, useEffect } from 'react';
import { apiRequest } from './services';
import './AdminSyncPanel.css';

function AdminSyncPanel() {
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProductos: 0,
        ultimaSync: null
    });

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            console.log('📊 Cargando estadísticas...');
            const data = await apiRequest('/market/model/products/');
            console.log('📦 Data recibida:', data);
            
            // Asegurar que sea un array
            const productos = Array.isArray(data) ? data : (data.results || []);
            console.log('✅ Productos:', productos.length);
            const conSync = productos.filter(p => p.last_sync);
            console.log('🔄 Con sync:', conSync.length);
            
            if (conSync.length > 0) {
                const ultimaFecha = new Date(Math.max(...conSync.map(p => new Date(p.last_sync))));
                console.log('📅 Última fecha:', ultimaFecha);
            }
            
            setStats({
                totalProductos: productos.length,
                ultimaSync: conSync.length > 0 
                    ? new Date(Math.max(...conSync.map(p => new Date(p.last_sync)))).toLocaleString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : 'Nunca'
            });
            console.log('✅ Stats actualizadas:', stats);
        } catch (err) {
            console.error('Error cargando estadísticas:', err);
        }
    };

    const handleSync = async () => {
        setLoading(true);
        setError(null);
        setResultado(null);

        try {
            const data = await apiRequest('/market/sync-external/', {
                method: 'POST'
            });

            setResultado(data);
            // Esperar un poco y recargar estadísticas
            setTimeout(() => {
                cargarEstadisticas();
            }, 500);

        } catch (err) {
            setError(err.message || 'Error al sincronizar productos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-sync-panel">
            <div className="sync-header">
                <h2>Sincronización de Productos</h2>
                <p className="sync-subtitle">
                    Sincroniza automáticamente los productos desde el proveedor externo
                </p>
            </div>

            <div className="sync-stats">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalProductos}</div>
                        <div className="stat-label">Productos Totales</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.ultimaSync}</div>
                        <div className="stat-label">Última Sincronización</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-content">
                        <div className="stat-value">1 hora</div>
                        <div className="stat-label">Frecuencia Automática</div>
                    </div>
                </div>
            </div>

            <div className="sync-actions">
                <button 
                    onClick={handleSync} 
                    disabled={loading}
                    className="sync-button"
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Sincronizando...
                        </>
                    ) : (
                        <>
                            <span className="sync-icon">🔄</span>
                            Sincronizar Ahora
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="sync-error">
                    <span className="error-icon">❌</span>
                    <span>{error}</span>
                </div>
            )}

            {resultado && resultado.success && (
                <div className="sync-result success">
                    <h3>✅ Sincronización Completada</h3>
                    <div className="result-details">
                        <div className="result-item">
                            <span className="result-label">Productos Nuevos:</span>
                            <span className="result-value">{resultado.nuevos}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Productos Actualizados:</span>
                            <span className="result-value">{resultado.actualizados}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Total Procesados:</span>
                            <span className="result-value">{resultado.total}</span>
                        </div>
                        {resultado.desactivados > 0 && (
                            <div className="result-item warning">
                                <span className="result-label">Productos Desactivados:</span>
                                <span className="result-value">{resultado.desactivados}</span>
                            </div>
                        )}
                        {resultado.errores && resultado.errores.length > 0 && (
                            <div className="result-errors">
                                <h4>Errores:</h4>
                                <ul>
                                    {resultado.errores.map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="sync-info">
                <h3>ℹ️ Información</h3>
                <ul>
                    <li>La sincronización automática se ejecuta cada 1 hora</li>
                    <li>Los productos se actualizan con el precio del proveedor × 2</li>
                    <li>Los productos que desaparecen del proveedor se desactivan automáticamente</li>
                    <li>El stock se actualiza en tiempo real</li>
                </ul>
            </div>
        </div>
    );
}

export default AdminSyncPanel;
