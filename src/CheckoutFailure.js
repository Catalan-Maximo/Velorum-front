import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CheckoutResult.css';

function CheckoutFailure() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateCheckoutAccess = async () => {
            const token = searchParams.get('token');
            const orderId = searchParams.get('order');

            // Si no hay token u order_id, redirigir
            if (!token || !orderId) {
                console.log('❌ No token or order ID provided');
                navigate('/');
                return;
            }

            try {
                // Llamar al endpoint de validación
                const response = await fetch(`http://localhost:8000/api/market/validate-checkout/?token=${token}&order=${orderId}`);
                const data = await response.json();

                if (data.valid) {
                    setIsValid(true);
                } else {
                    console.log('❌ Invalid token:', data.error);
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
