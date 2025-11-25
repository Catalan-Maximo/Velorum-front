import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutResult.css';

function CheckoutFailure() {
    const navigate = useNavigate();

    return (
        <div className="checkout-result-container">
            <div className="result-card failure">
                <div className="result-icon">
                    <div className="error-circle">
                        <div className="error-icon">✕</div>
                    </div>
                </div>
                
                <h1>Pago Rechazado</h1>
                <p className="result-message">
                    El pago no pudo ser procesado. Por favor, intentá nuevamente.
                </p>
                
                <div className="result-info">
                    <p>
                        💳 Verificá que los datos de tu tarjeta sean correctos.
                    </p>
                    <p>
                        💰 Asegurate de tener fondos suficientes.
                    </p>
                    <p>
                        🔒 Consultá con tu banco si el problema persiste.
                    </p>
                </div>

                <div className="result-actions">
                    <button 
                        className="btn-primary"
                        onClick={() => navigate('/cart')}
                    >
                        Volver al Carrito
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

export default CheckoutFailure;
