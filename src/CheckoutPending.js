import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutResult.css';

function CheckoutPending() {
    const navigate = useNavigate();

    return (
        <div className="checkout-result-container">
            <div className="result-card pending">
                <div className="result-icon">
                    <div className="pending-circle">
                        <div className="clock-icon">⏳</div>
                    </div>
                </div>
                
                <h1>Pago en Revisión</h1>
                <p className="result-message">
                    Tu pago está siendo procesado. Te notificaremos cuando se acredite.
                </p>
                
                <div className="result-info">
                    <p>
                        📧 Recibirás un correo electrónico cuando se confirme tu pago.
                    </p>
                    <p>
                        ⏰ Este proceso puede demorar entre 24 y 48 horas hábiles.
                    </p>
                    <p>
                        📦 Puedes revisar el estado de tu pedido en "Mis Pedidos".
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

export default CheckoutPending;
