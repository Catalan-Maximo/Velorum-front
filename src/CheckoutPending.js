import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CheckoutResult.css';

function CheckoutPending() {
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
