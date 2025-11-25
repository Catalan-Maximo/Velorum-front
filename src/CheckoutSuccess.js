import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutResult.css';

function CheckoutSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // Limpiar el carrito del localStorage después de un pago exitoso
        localStorage.removeItem('cart');
        
        // Disparar evento para que el CartContext se actualice
        window.dispatchEvent(new Event('storage'));
    }, []);

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
                
                <div className="result-info">
                    <p>
                        📧 Recibirás un correo electrónico con los detalles de tu pedido.
                    </p>
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
