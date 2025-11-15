import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, adminService } from './services';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    // 🔍 Debug: Verificar autenticación al cargar el componente
    useEffect(() => {
        console.log('🔍 AdminPanel mounted - checking authentication...');
        console.log('🔑 token:', localStorage.getItem("token") ? 'EXISTS' : 'MISSING');
        console.log('🔑 refresh_token:', localStorage.getItem("refresh_token") ? 'EXISTS' : 'MISSING');
        console.log('👤 user_role:', localStorage.getItem("user_role"));
        console.log('📊 user_data:', localStorage.getItem("user_data"));
    }, []);

    // 📦 Cargar datos al montar el componente
    useEffect(() => {
        fetchUsers();
        fetchDashboard();
    }, []);

    // Estados principales
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    // Estado para modal de detalle usuario
    const [viewingUser, setViewingUser] = useState(null);
    const [viewingLoading, setViewingLoading] = useState(false);
    const [viewingError, setViewingError] = useState(null);
    
    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // 📝 Estados para el formulario de crear usuario
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        name: '',
        password: '',
        role: 'user',
        address: '',
        phone: ''
    });

    // Filtrar usuarios según búsqueda y filtros
    useEffect(() => {
        let filtered = users;
        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        // Filtrar por rol
        if (roleFilter) {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        // Filtrar por estado
        if (statusFilter) {
            const isActive = statusFilter === 'true';
            filtered = filtered.filter(user => user.is_active === isActive);
        }
        setFilteredUsers(filtered);
    }, [users, searchTerm, roleFilter, statusFilter]);

    // Obtener dashboard estadístico
    const fetchDashboard = async () => {
        try {
            console.log('Fetching dashboard...'); // Debug
            const data = await adminService.getDashboard();
            console.log('Dashboard data received:', data); // Debug
            setDashboard(data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            // No mostrar error al usuario, fallar silenciosamente
            setDashboard(null);
        }
    };

    // Obtener lista de usuarios
    const fetchUsers = async () => {
        setLoading(true);
        try {
            console.log('🔄 Fetching users...'); // Debug
            const data = await userService.getAll();
            console.log('✅ Users data received:', data); // Debug
            setUsers(data.users || data);
            setError('');
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            
            // Manejar error de autenticación específicamente
            if (error.message.includes('401')) {
                setError('Error de autenticación: Token inválido o expirado. Por favor, inicia sesión nuevamente.');
                // Limpiar datos de autenticación
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user_role");
                localStorage.removeItem("user_data");
                localStorage.removeItem("userInfo");
            } else {
                setError('Error al cargar usuarios: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Crear nuevo usuario
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await userService.create(newUser);
            if (response.ok) {
                fetchUsers();
                fetchDashboard();
                setShowCreateForm(false);
                setNewUser({
                    username: '',
                    email: '',
                    first_name: '',
                    last_name: '',
                    name: '',
                    password: '',
                    role: 'user',
                    address: '',
                    phone: ''
                });
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al crear usuario');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Error al crear usuario');
        } finally {
            setLoading(false);
        }
    };

    // ✏️ Actualizar usuario
    // (Eliminada función handleUpdateUser: no usada)

    // Eliminar usuario
    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${username}?`)) {
            setLoading(true);
            try {
                const response = await userService.delete(userId);
                if (response.ok) {
                    fetchUsers();
                    fetchDashboard();
                    setError('');
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Error al eliminar usuario');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Error al eliminar usuario');
            } finally {
                setLoading(false);
            }
        }
    };

    // Cambiar estado de usuario (activo/inactivo)
    const handleToggleUserStatus = async (userId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            const response = await userService.toggleStatus(userId, newStatus);
            if (response.ok) {
                fetchUsers();
                fetchDashboard();
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al cambiar estado del usuario');
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            setError('Error al cambiar estado del usuario');
        }
    };

    // Cambiar rol de usuario
    const handleChangeRole = async (userId, newRole) => {
        try {
            const response = await userService.changeRole(userId, newRole);
            if (response.ok) {
                fetchUsers();
                fetchDashboard();
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al cambiar rol del usuario');
            }
        } catch (error) {
            console.error('Error changing user role:', error);
            setError('Error al cambiar rol del usuario');
        }
    };

    // Ver usuario (detalle)
    const handleViewUser = async (user) => {
        try {
            setViewingError(null);
            setViewingLoading(true);
            const full = await userService.getById(user.id);
            setViewingUser(full);
        } catch (e) {
            console.error(e);
            setViewingError('No se pudo cargar el usuario');
        } finally {
            setViewingLoading(false);
        }
    };

    const closeViewing = () => setViewingUser(null);

    return (
        <div className="admin-panel">
            <header className="admin-header centered">
                <h2>Panel de Administración</h2>
                <p className="subtitle">Gestión centralizada de usuarios y roles</p>
            </header>
            
            {error && (
                <div className="error-message">
                    {error}
                    {error.includes('autenticación') && (
                        <div style={{ marginTop: '10px' }}>
                            <button 
                                className="btn-primary"
                                onClick={() => window.location.href = '/login'}
                                style={{ marginRight: '10px' }}
                            >
                                Ir a Login
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={() => { setError(''); fetchUsers(); }}
                            >
                                Reintentar
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 📊 DASHBOARD ESTADÍSTICO */}
            {dashboard && (
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Total Usuarios</h3>
                        <p>{dashboard.users?.total || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Activos</h3>
                        <p>{dashboard.users?.active || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Admins</h3>
                        <p>{dashboard.users?.by_role?.admin || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Operadores</h3>
                        <p>{dashboard.users?.by_role?.operator || 0}</p>
                    </div>
                </div>
            )}

            {/* CONTROLES Y FILTROS */}
            <section className="controls-card">
                <div className="controls-grid compact-filters">
                    <div className="control-field">
                        <label>Buscar</label>
                        <input
                            type="text"
                            placeholder="Usuario, email o nombre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="control-field">
                        <label>Rol</label>
                        <select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="admin">Administrador</option>
                            <option value="operator">Operador</option>
                            <option value="user">Usuario</option>
                        </select>
                    </div>
                    <div className="control-field">
                        <label>Estado</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                    </div>
                    <div className="control-actions">
                        <div className="action-group">
                            <button
                                onClick={() => navigate('/admin/orders')}
                                className="ag-btn ghost"
                                aria-label="Ir a pedidos"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                    <line x1="8" y1="15" x2="8" y2="15"/>
                                    <line x1="12" y1="15" x2="12" y2="15"/>
                                    <line x1="16" y1="15" x2="16" y2="15"/>
                                </svg>
                                Pedidos
                            </button>
                            <button 
                                className="ag-btn icon" 
                                onClick={fetchUsers}
                                title="Recargar usuarios"
                                aria-label="Recargar usuarios"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10"/>
                                    <polyline points="1 20 1 14 7 14"/>
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
                                    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/>
                                </svg>
                            </button>
                            <button 
                                className={`ag-btn primary ${showCreateForm ? 'active' : ''}`} 
                                onClick={() => setShowCreateForm(!showCreateForm)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                {showCreateForm ? 'Cerrar' : 'Nuevo'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 📝 FORMULARIO PARA CREAR USUARIO */}
            {showCreateForm && (
                <div className="create-form">
                    <h3>Crear Nuevo Usuario</h3>
                    <form onSubmit={handleCreateUser}>
                        <div className="form-grid">
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={newUser.username}
                                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newUser.first_name}
                                onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Apellido"
                                value={newUser.last_name}
                                onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                value={newUser.name}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                required
                            />
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            >
                                <option value="user">Usuario</option>
                                <option value="operator">Operador</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Dirección"
                                value={newUser.address}
                                onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                            />
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                value={newUser.phone}
                                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Creando...' : 'Crear Usuario'}
                            </button>
                            <button 
                                type="button" 
                                className="btn-secondary" 
                                onClick={() => setShowCreateForm(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 👥 TABLA DE USUARIOS */}
            <div className="users-table">
                <h3>Lista de Usuarios</h3>
                
                {loading ? (
                    <div className="loading">Cargando usuarios...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="no-users">No se encontraron usuarios</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td className="role-cell">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                            className={`role-select-minimal role-${user.role}`}
                                        >
                                            <option value="user">USUARIO</option>
                                            <option value="operator">OPERADOR</option>
                                            <option value="admin">ADMIN</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="status-indicator">
                                            <span className={`status-dot ${user.is_active ? 'active' : 'inactive'}`}></span>
                                            <span className={`status-text ${user.is_active ? 'active' : 'inactive'}`}>
                                                {user.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="actions">
                                        <button
                                            className="action-btn-simple"
                                            onClick={() => handleViewUser(user)}
                                            title="Ver detalles"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 5c-7.633 0-10 7-10 7s2.367 7 10 7 10-7 10-7-2.367-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 9z"/>
                                            </svg>
                                        </button>
                                        {user.role !== 'admin' ? (
                                            <>
                                                <button
                                                    className={`action-btn-simple ${user.is_active ? 'btn-pause' : 'btn-play'}`}
                                                    onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                                                    title={user.is_active ? 'Pausar usuario' : 'Activar usuario'}
                                                >
                                                    {user.is_active ? (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                                        </svg>
                                                    ) : (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M8 5v14l11-7z"/>
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    className="action-btn-simple btn-delete"
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                    title="Eliminar usuario"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <span className="admin-protected">Protegido</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {viewingUser && (
                <div className="modal-overlay" onClick={closeViewing}>
                    <div className="modal-content user-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Detalle de Usuario</h2>
                            <button className="btn-close" onClick={closeViewing}>×</button>
                        </div>
                        <div className="modal-body">
                            {viewingLoading && <div className="loading-state" style={{minHeight:'120px'}}><div className="spinner" style={{width:'34px',height:'34px'}}></div><p style={{fontSize:'13px',color:'#555',margin:0}}>Cargando datos...</p></div>}
                            {viewingError && <p className="error-message" style={{margin:0}}>{viewingError}</p>}
                            {!viewingLoading && !viewingError && (
                                <>
                                    <div className="user-detail-grid">
                                        {/* Row 1 */}
                                        <div className="ud-item ud-id"><strong>ID</strong><span className="value">{viewingUser.id}</span></div>
                                        <div className="ud-item ud-username"><strong>Usuario</strong><span className="value">{viewingUser.username || viewingUser.email}</span></div>
                                        {viewingUser.first_name && <div className="ud-item ud-firstname"><strong>Nombre</strong><span className="value">{viewingUser.first_name}</span></div>}
                                        {viewingUser.last_name && <div className="ud-item ud-lastname"><strong>Apellido</strong><span className="value">{viewingUser.last_name}</span></div>}
                                        {/* Row 2 (role, phone, email, created) */}
                                        <div className="ud-item chip-item ud-role"><strong>Rol</strong><span className={`role-chip chip-${viewingUser.role}`}>{viewingUser.role}</span></div>
                                        {viewingUser.phone && <div className="ud-item ud-phone"><strong>Teléfono</strong><span className="value">{viewingUser.phone}</span></div>}
                                        <div className="ud-item ud-email ud-email-compact"><strong>Email</strong><span className="value email-value">{viewingUser.email}</span></div>
                                        {viewingUser.date_joined && <div className="ud-item ud-created"><strong>Creado</strong><span className="value">{new Date(viewingUser.date_joined).toLocaleString()}</span></div>}
                                        {/* Row 3 (status, address, fullname, last login) */}
                                        {'is_active' in viewingUser && <div className="ud-item chip-item ud-status"><strong>Estado</strong><span className={`user-status-pill ${viewingUser.is_active ? 'active' : 'inactive'}`}>{viewingUser.is_active ? 'Activo' : 'Inactivo'}</span></div>}
                                        <div className="ud-item ud-address"><strong>Dirección</strong><span className="value">{viewingUser.address || '—'}</span></div>
                                        <div className="ud-item ud-floor"><strong>Piso</strong><span className="value">{viewingUser.floor || viewingUser.piso || '—'}</span></div>
                                        <div className="ud-item ud-dept"><strong>Depto</strong><span className="value">{viewingUser.department || viewingUser.departamento || viewingUser.dept || '—'}</span></div>
                                        {viewingUser.last_login && <div className="ud-item ud-lastlogin"><strong>Último Login</strong><span className="value">{new Date(viewingUser.last_login).toLocaleString()}</span></div>}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer" style={{display:'flex',justifyContent:'flex-end',gap:'12px',padding:'16px 24px',borderTop:'1px solid #f0f0f0'}}>
                            <button onClick={closeViewing} className="btn-secondary">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}

export default AdminPanel;
