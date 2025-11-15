// 🛒 **CART.JS** - COMPONENTE DEL CARRITO DE COMPRAS
import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const {
    cartItems,
    isCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    setIsCartOpen
  } = useCart();

  const navigate = useNavigate();

  // 🔐 VERIFICAR SI EL USUARIO ESTÁ LOGUEADO PARA MOSTRAR EL CARRITO
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    return !!(token && userInfo);
  };

  // Mantener montado para permitir animaciones de cierre/apertura
  const shouldRenderContent = isUserLoggedIn();

  const handleCheckout = () => {
    // 🔐 VERIFICAR SI EL USUARIO ESTÁ LOGUEADO
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (!token || !userInfo) {
      alert('⚠️ Debes iniciar sesión para finalizar la compra');
      setIsCartOpen(false);
      navigate('/login');
      return;
    }
    
    // 🛒 VERIFICAR QUE HAY PRODUCTOS EN EL CARRITO
    if (cartItems.length === 0) {
      alert('⚠️ No tienes productos en el carrito');
      return;
    }
    
    // ✅ REDIRIGIR AL PROCESO DE CHECKOUT
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    navigate('/products');
  };

  return (
    <>
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />}
      <div className={`cart-sidebar modern ${isCartOpen ? 'open' : ''}`}>        
        {!shouldRenderContent && (
          <div style={{padding:'40px'}}>
            <p style={{margin:0}}>Inicia sesión para ver el carrito.</p>
          </div>
        )}
        {shouldRenderContent && (<>
        <div className="cart-header enhanced">
          <div className="cart-title-block">
            <h2>Mi Carrito</h2>
            <span className="cart-sub">{getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}</span>
          </div>
          <div className="action-cluster">
            {cartItems.length > 0 && (
              <button className="cluster-btn ghost" onClick={clearCart}>Vaciar</button>
            )}
            <button className="cluster-btn icon" onClick={() => setIsCartOpen(false)} aria-label="Cerrar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
  <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty modern-empty">
              <div className="empty-visual">
                <div className="empty-ring" />
                <div className="empty-icon">🛒</div>
              </div>
              <h3>Tu carrito está vacío</h3>
              <p className="desc">Agrega productos para continuar con la compra.</p>
              <div className="empty-actions refined">
                <button className="cluster-like accent" onClick={handleContinueShopping}>Explorar</button>
                <button className="cluster-like ghost" onClick={() => { setIsCartOpen(false); navigate('/'); }}>Inicio</button>
              </div>
            </div>
          ) : (
            <>
              <div className="cart-items modern">
                {cartItems.map(item => {
                  const displayName = item.name && item.name.length > 28 ? item.name.slice(0,27) + '…' : item.name;
                  return (
                  <div key={item.id} className="cart-item modern">
                    <div className="cart-item-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => { e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjhGOUZBIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjEyIiBzdHJva2U9IiNENUQ5REQiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K'; }}
                      />
                    </div>
                    <div className="cart-item-info">
                      <h4 title={item.name}>{displayName}</h4>
                      <p className="cart-item-category">{item.category}</p>
                      <p className="cart-item-price">${item.price}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls soft">
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeFromCart(item.id)} aria-label="Eliminar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )})}
              </div>
              <div className="cart-summary modern">
                <div className="summary-totals">
                  <div className="row"><span className="lbl">Artículos</span><span className="val">{getTotalItems()}</span></div>
                  <div className="row total"><span className="lbl">Total</span><span className="val">${getTotalPrice().toFixed(2)}</span></div>
                </div>
                <div className="summary-actions">
                  <button className="summary-btn ghost" onClick={handleContinueShopping}>Seguir Comprando</button>
                  <button className="summary-btn accent" onClick={handleCheckout}>Finalizar</button>
                </div>
              </div>
            </>
          )}
  </div>
  </>) }
      </div>
    </>
  );
}

export default Cart;
