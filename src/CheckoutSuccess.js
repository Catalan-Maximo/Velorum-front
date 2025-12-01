import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from './services';
import './CheckoutResult.css';

function CheckoutSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        console.log('🔍 URL COMPLETA:', window.location.href);
        console.log('🔍 SEARCH PARAMS:', window.location.search);
        console.log('🔍 HASH:', window.location.hash);
        
        const searchParams = new URLSearchParams(window.location.search);
        
        // Ver TODOS los parámetros que llegaron
        for (let [key, value] of searchParams.entries()) {
            console.log(`   ${key}: ${value}`);
        }
        
        const validateCheckoutAccess = async () => {
            // Obtener parámetros que Mercado Pago agrega automáticamente
            const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
            const externalRef = searchParams.get('external_reference');
            const preferenceId = searchParams.get('preference_id');

            // Si no hay parámetros de MP, es acceso directo no autorizado
            if (!paymentId && !preferenceId) {
                console.log('❌ No MP parameters - unauthorized access');
                navigate('/');
                return;
            }

            try {
                // Pasar todos los parámetros de MP al backend
                const queryString = window.location.search;
                const response = await fetch(`${API_BASE_URL}/market/validate-checkout/${queryString}`);
                const data = await response.json();

                if (data.valid) {
                    setIsValid(true);
                    setOrderData(data.order);
                    
                    // Limpiar el carrito del localStorage después de un pago exitoso
                    localStorage.removeItem('cart');
                    
                    // Disparar evento para que el CartContext se actualice
                    window.dispatchEvent(new Event('storage'));
                } else {
                    console.log('❌ Invalid access:', data.error);
                    navigate('/');
                }
            } catch (error) {
                console.error('❌ Error validating checkout:', error);
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        validateCheckoutAccess();
    }, [searchParams, navigate]);

    // Mostrar loading mientras valida
    if (isLoading) {
        return (
            <div className="checkout-result-container">
                <div className="result-card">
                    <div className="result-icon">
                        <div className="pending-circle">
                            <div className="clock-icon">⏳</div>
                        </div>
                    </div>
                    <h1>Validando Pago...</h1>
                    <p className="result-message">
                        Estamos verificando tu pago. Por favor, esperá un momento.
                    </p>
                </div>
            </div>
        );
    }

    // Si no es válido, no debería llegar aquí (ya redirigió)
    if (!isValid) {
        return null;
    }

    return (
        <div className="checkout-result-container">
            <div className="result-card success">
                <div className="result-icon">
                    <div className="checkmark-circle">
                        <div className="checkmark"></div>
                    </div>
                </div>
                
                <h1>¡Pago Confirmado!</h1>
                <p className="result-message">
                    Tu pago ha sido procesado exitosamente. Tu pedido está siendo preparado.
                </p>
                
                {orderData && (
                    <div className="order-summary">
                        <h2>Pedido #{orderData.id}</h2>
                        <p><strong>Total:</strong> ${orderData.total}</p>
                        <p><strong>Estado:</strong> {orderData.estado}</p>
                        {orderData.productos && orderData.productos.length > 0 && (
                            <div className="order-products">
                                <h3>Productos:</h3>
                                <ul>
                                    {orderData.productos.map((producto, index) => (
                                        <li key={index}>
                                            {producto.producto__nombre} - Cantidad: {producto.cantidad} - ${producto.subtotal}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="result-info">
                    <p>
                        📦 Puedes seguir el estado de tu pedido en la sección "Mis Pedidos".
                    </p>
                </div>

                <div className="result-actions">
                    <button 
                        className="btn-primary"
                        onClick={() => navigate('/orders')}
                    >
                        Ver Mis Pedidos
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={() => navigate('/')}
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutSuccess;
