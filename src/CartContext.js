// 🛒 **CARTCONTEXT.JS** - CONTEXTO GLOBAL PARA MANEJAR EL CARRITO
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // � FUNCIÓN PARA OBTENER LA CLAVE DE USUARIO
  const getUserCartKey = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return `cart_${user.id || user.username || 'guest'}`;
    }
    return 'cart_guest'; // Para usuarios no logueados
  };

  // �🔄 CARGAR CARRITO DESDE LOCALSTORAGE AL INICIAR
  useEffect(() => {
    const cartKey = getUserCartKey();
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        setCartItems([]);
      }
    }
  }, []);

  // 🔄 ESCUCHAR CAMBIOS DE USUARIO (LOGIN/LOGOUT)
  useEffect(() => {
    const handleStorageChange = () => {
      const cartKey = getUserCartKey();
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          setCartItems([]);
        }
      } else {
        setCartItems([]); // Limpiar carrito si no hay datos para este usuario
      }
    };

    const handleUserLoggedOut = () => {
      // 🧹 LIMPIAR CARRITO COMPLETAMENTE AL CERRAR SESIÓN
      setCartItems([]);
      setIsCartOpen(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userChanged', handleStorageChange);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleStorageChange);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  // 💾 GUARDAR CARRITO EN LOCALSTORAGE CUANDO CAMBIEN
  useEffect(() => {
    const cartKey = getUserCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ FUNCIÓN PARA AGREGAR AL CARRITO
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity, watch_id: product.watch_id || product.id_backend || product.id }];
      }
    });
  };

  // ➖ FUNCIÓN PARA REMOVER DEL CARRITO
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // 🔄 FUNCIÓN PARA ACTUALIZAR CANTIDAD
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // 🧹 FUNCIÓN PARA LIMPIAR CARRITO
  const clearCart = () => {
    setCartItems([]);
  };

  // 📊 FUNCIÓN PARA OBTENER CANTIDAD TOTAL DE ITEMS
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // 💰 FUNCIÓN PARA OBTENER PRECIO TOTAL
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // ✅ FUNCIÓN PARA VERIFICAR SI UN PRODUCTO ESTÁ EN EL CARRITO
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // 📦 FUNCIÓN PARA OBTENER CANTIDAD DE UN PRODUCTO ESPECÍFICO
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // 🛒 FUNCIÓN PARA ABRIR/CERRAR CARRITO
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
