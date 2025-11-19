// 🛒 **CHECKOUT.JS** - PROCESO COMPLETO DE COMPRA
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './Checkout.css';
import { API_BASE_URL, fetchWithAuth } from './services'; // ✅ base dinámica + fetchWithAuth

const WHATSAPP_NUMBER = '5491122334455'; // Reemplazar por número real (sin +, formato país+numero)

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Datos, 2: Envío, 3: Pago, 4: Confirmación

    // Estados para el formulario
    const [customerData, setCustomerData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono_contacto: ''
    });

    const [shippingData, setShippingData] = useState({
        calle: '',
        numero: '',
        piso: '',
        departamento: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
        zona_envio: 'CABA',
        notas_envio: ''
    });

    const [paymentData, setPaymentData] = useState({
        metodo_pago: 'tarjeta_credito',
        numero_tarjeta: '',
        nombre_titular: '',
        mes_expiracion: '',
        ano_expiracion: '',
        cvv: ''
    });

    const [costoEnvio, setCostoEnvio] = useState(800); // base

    // Tabla base por provincia (valores estimativos)
    const PROVINCIA_BASE = useMemo(() => ({
        'CABA': 800,
        'Buenos Aires': 1500,
        'Córdoba': 2100,
        'Santa Fe': 2200,
        'Mendoza': 2500,
        'Tucumán': 2600,
        'Entre Ríos': 1900,
        'Salta': 2700,
        'Chaco': 2600,
        'Corrientes': 2300,
        'Misiones': 2500,
        'San Juan': 2400,
        'Jujuy': 3000,
        'San Luis': 2300,
        'Catamarca': 2500,
        'La Rioja': 2500,
        'La Pampa': 1800,
        'Santiago del Estero': 2400,
        'Formosa': 2800,
        'Chubut': 3200,
        'Río Negro': 3000,
        'Neuquén': 3000,
        'Santa Cruz': 3800,
        'Tierra del Fuego': 4200,
    }), []);

    // Factor adicional por distancia aproximada según primer dígito del CP (muy simplificado)
    const postalDistanceFactor = (cp) => {
        if (!cp || cp.length < 4) return 0;
        const first = cp[0];
        switch (first) {
            case '1': return 0; // CABA
            case '2': return 150; // Santa Fe / Entre Ríos
            case '3': return 250; // Norte litoral
            case '4': return 350; // Norte / NOA
            case '5': return 420; // Córdoba / Cuyo
            case '6': return 500; // Buenos Aires interior / La Pampa
            case '7': return 550; // Centro / NOA extendido
            case '8': return 650; // Patagonia norte
            case '9': return 850; // Patagonia sur / Tierra del Fuego
            default: return 0;
        }
    };

    // Ajustes especiales por ciudad remota / logística
    const cityAdjustment = (city) => {
        if (!city) return 0;
        const c = city.toLowerCase();
        if (/(ushuaia|rio grande|rí o grande)/i.test(c)) return 600;
        if (/calafate|perito moreno/.test(c)) return 500;
        if (/tilcara|humahuaca/.test(c)) return 300;
        return 0;
    };

    const calcularEnvio = (provincia, codigoPostal, ciudad) => {
        if (!provincia) return { zona: 'Sin datos', costo: 0, estimado: '-' };
        const base = PROVINCIA_BASE[provincia] ?? 2600;
        const extraCP = postalDistanceFactor(codigoPostal);
        const extraCity = cityAdjustment(ciudad);
        const costo = base + extraCP + extraCity;
        // Tiempo estimado simple basado en distancia total
        const estimado = costo <= 1800 ? '1-3 días hábiles' : costo <= 2600 ? '3-5 días hábiles' : '5-8 días hábiles';
        let zona = provincia;
        if (provincia === 'CABA') zona = 'CABA';
        else if (['Buenos Aires','Entre Ríos','Santa Fe','Córdoba'].includes(provincia)) zona = 'Centro';
        else if (['Chubut','Río Negro','Neuquén','Santa Cruz','Tierra del Fuego'].includes(provincia)) zona = 'Patagonia';
        else if (['Salta','Jujuy','Catamarca','La Rioja','Santiago del Estero','Tucumán'].includes(provincia)) zona = 'Noroeste';
        else if (['Corrientes','Misiones','Formosa','Chaco'].includes(provincia)) zona = 'Noreste';
        else if (['San Juan','San Luis','Mendoza'].includes(provincia)) zona = 'Cuyo';
        return { zona, costo, estimado };
    };

    // Verificar autenticación al cargar
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');

        if (!token || !userInfo) {
            navigate('/login');
            return;
        }

        // Evitar redirigir automáticamente a /products en casos donde el carrito
        // pueda vaciarse temporalmente durante el envío del pedido (race condition).
        // Solo redirigir si el carrito está vacío y no estamos procesando/mostrando
        // confirmación de transferencia.
        if (cartItems.length === 0 && !loading && !transferModalOpen && !createdOrderId) {
            navigate('/products');
            return;
        }

        // Autocompletar con datos del usuario
        try {
            const user = JSON.parse(userInfo);
            setCustomerData({
                nombre: user.first_name || '',
                apellido: user.last_name || '',
                email: user.email || '',
                telefono_contacto: user.phone || ''
            });
        } catch (error) {
            console.error('Error parsing user info:', error);
        }
    }, [cartItems.length, navigate, loading, transferModalOpen, createdOrderId]);

    // Recalcular costo de envío cuando cambian datos relevantes
    useEffect(() => {
        const { provincia, codigo_postal, ciudad } = shippingData;
        if (!provincia || !codigo_postal) return;
        const info = calcularEnvio(provincia, codigo_postal, ciudad);
        setCostoEnvio(info.costo);
        setShippingData(prev => ({ ...prev, zona_envio: info.zona }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shippingData.provincia, shippingData.codigo_postal, shippingData.ciudad]);

    // Validaciones por paso
    const validateStep1 = () => {
        return customerData.nombre && customerData.apellido && 
               customerData.email && customerData.telefono_contacto;
    };

    const validateStep2 = () => {
        return shippingData.calle && shippingData.numero && 
               shippingData.ciudad && shippingData.provincia && 
               shippingData.codigo_postal;
    };

    const validateStep3 = () => {
        if (paymentData.metodo_pago === 'transferencia') return true;
        return paymentData.numero_tarjeta && paymentData.nombre_titular && 
               paymentData.mes_expiracion && paymentData.ano_expiracion && paymentData.cvv;
    };

    // Navegar entre pasos
    const nextStep = () => {
        if (currentStep === 1 && !validateStep1()) {
            setError('Por favor completa todos los campos de datos personales');
            return;
        }
        if (currentStep === 2 && !validateStep2()) {
            setError('Por favor completa todos los campos de envío');
            return;
        }
        if (currentStep === 3 && !validateStep3()) {
            setError('Por favor completa todos los campos de pago');
            return;
        }
        
        setError('');
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        setError('');
    };

    // Procesar orden
    const processOrder = async () => {
        setLoading(true);
        setError('');

        try {
            // Preparar detalles del pedido
            const orderDetails = cartItems.map(item => ({
                watch_id: item.watch_id || item.id_backend || item.id,
                cantidad: item.quantity,
                precio_unitario: item.price,
                subtotal: item.price * item.quantity
            }));

            // Validación cliente: todos los watch_id deben ser números válidos
            const invalidItem = orderDetails.find(d => !d.watch_id || Number.isNaN(Number(d.watch_id)));
            if (invalidItem) {
                setError('Hay un producto inválido en el carrito. Por favor elimina y vuelve a agregar el producto antes de confirmar el pedido.');
                setLoading(false);
                return;
            }

            // Construir dirección completa
            const direccionCompleta = `${shippingData.calle} ${shippingData.numero}${
                shippingData.piso ? `, Piso ${shippingData.piso}` : ''
            }${
                shippingData.departamento ? `, Depto ${shippingData.departamento}` : ''
            }, ${shippingData.ciudad}, ${shippingData.provincia}`;

            // Solo enviar campos permitidos por OrderSerializer
            const orderData = {
                nombre: customerData.nombre,
                apellido: customerData.apellido,
                email: customerData.email,
                telefono_contacto: customerData.telefono_contacto,
                direccion_completa: direccionCompleta,
                codigo_postal: shippingData.codigo_postal,
                zona_envio: shippingData.zona_envio,
                metodo_pago: paymentData.metodo_pago,
                estado: 'pendiente',
                estado_pago: 'pendiente',
                total: getTotalPrice(),
                costo_envio: costoEnvio,
                total_con_envio: getTotalPrice() + costoEnvio,
                notas: shippingData.notas_envio || '',
                detalles: orderDetails
            };

            // Validación servidor: comentada temporalmente para debug
            // El backend ya valida la existencia de los relojes
            console.log('DEBUG orderData completo:', JSON.stringify(orderData, null, 2));
            console.log('DEBUG orderDetails:', orderDetails);
            console.log('DEBUG API_BASE_URL:', API_BASE_URL);
            
            // fetchWithAuth ya agrega 'Content-Type' y 'Authorization' automáticamente
            const response = await fetchWithAuth(`${API_BASE_URL}/main/model/orders/`, {
                method: 'POST',
                body: JSON.stringify(orderData)
            });

            console.log('DEBUG response status:', response.status);
            console.log('DEBUG response ok:', response.ok);

            if (!response.ok) {
                // Logging extendido para depuración en local
                const status = response.status;
                let text = '';
                try { text = await response.text(); } catch(e) { text = `<no text: ${e.message}>`; }
                let parsed = null;
                try { parsed = JSON.parse(text); } catch(e) { parsed = null; }

                console.error('❌ Order POST FAILED');
                console.error('Status:', status);
                console.error('Response text:', text);
                console.error('Parsed:', parsed);
                console.error('Full response:', response);

                let backendMsg = `Error al procesar el pedido (HTTP ${status})`;
                if (parsed) {
                    backendMsg = parsed.detalles || parsed.detail || parsed.error || JSON.stringify(parsed);
                } else if (text) {
                    backendMsg = text.substring(0, 500); // Limitar texto largo
                }

                setError(backendMsg);
                setLoading(false);
                return; // No lanzar error, solo mostrar mensaje
            }

            console.log('✅ Order POST successful');
            const result = await response.json();
            console.log('✅ Order result:', result);
            
            // Limpiar carrito
            clearCart();

            // Si es transferencia: abrir modal de confirmación en vez de redirigir inmediatamente.
            if (orderData.metodo_pago === 'transferencia') {
                setCreatedOrderId(result.id);
                setTransferModalOpen(true);
            } else {
                // Para otros métodos, redirigir a Mis Pedidos con mensaje
                navigate('/orders', {
                    state: {
                        message: 'Pedido creado exitosamente',
                        orderId: result.id
                    }
                });
            }

        } catch (error) {
            console.error('Error processing order:', error);
            setError(error.message || 'Error al procesar el pedido. Por favor intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const getTotalWithShipping = () => {
        return getTotalPrice() + costoEnvio;
    };

    // Render del paso actual
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="checkout-step">
                        <h3>1. Datos Personales</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    value={customerData.nombre}
                                    onChange={(e) => setCustomerData({...customerData, nombre: e.target.value})}
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellido *</label>
                                <input
                                    type="text"
                                    value={customerData.apellido}
                                    onChange={(e) => setCustomerData({...customerData, apellido: e.target.value})}
                                    placeholder="Tu apellido"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={customerData.email}
                                    onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono *</label>
                                <input
                                    type="tel"
                                    value={customerData.telefono_contacto}
                                    onChange={(e) => setCustomerData({...customerData, telefono_contacto: e.target.value})}
                                    placeholder="+1234567890"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="checkout-step">
                        <h3>2. Datos de Envío</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Calle *</label>
                                <input
                                    type="text"
                                    value={shippingData.calle}
                                    onChange={(e) => setShippingData({...shippingData, calle: e.target.value})}
                                    placeholder="Av. Corrientes"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Número *</label>
                                <input
                                    type="text"
                                    value={shippingData.numero}
                                    onChange={(e) => setShippingData({...shippingData, numero: e.target.value})}
                                    placeholder="1234"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Piso (Opcional)</label>
                                <input
                                    type="text"
                                    value={shippingData.piso}
                                    onChange={(e) => setShippingData({...shippingData, piso: e.target.value})}
                                    placeholder="5°"
                                />
                            </div>
                            <div className="form-group">
                                <label>Departamento (Opcional)</label>
                                <input
                                    type="text"
                                    value={shippingData.departamento}
                                    onChange={(e) => setShippingData({...shippingData, departamento: e.target.value})}
                                    placeholder="A, B, 12..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Ciudad *</label>
                                <input
                                    type="text"
                                    value={shippingData.ciudad}
                                    onChange={(e) => setShippingData({...shippingData, ciudad: e.target.value})}
                                    placeholder="Buenos Aires"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Provincia *</label>
                                <select
                                    value={shippingData.provincia}
                                    onChange={(e) => setShippingData({...shippingData, provincia: e.target.value})}
                                    required
                                >
                                    <option value="">Selecciona una provincia</option>
                                    <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                                    <option value="Buenos Aires">Buenos Aires</option>
                                    <option value="Córdoba">Córdoba</option>
                                    <option value="Santa Fe">Santa Fe</option>
                                    <option value="Mendoza">Mendoza</option>
                                    <option value="Tucumán">Tucumán</option>
                                    <option value="Entre Ríos">Entre Ríos</option>
                                    <option value="Salta">Salta</option>
                                    <option value="Chaco">Chaco</option>
                                    <option value="Corrientes">Corrientes</option>
                                    <option value="Misiones">Misiones</option>
                                    <option value="San Juan">San Juan</option>
                                    <option value="Jujuy">Jujuy</option>
                                    <option value="San Luis">San Luis</option>
                                    <option value="Catamarca">Catamarca</option>
                                    <option value="La Rioja">La Rioja</option>
                                    <option value="La Pampa">La Pampa</option>
                                    <option value="Santiago del Estero">Santiago del Estero</option>
                                    <option value="Formosa">Formosa</option>
                                    <option value="Chubut">Chubut</option>
                                    <option value="Río Negro">Río Negro</option>
                                    <option value="Neuquén">Neuquén</option>
                                    <option value="Santa Cruz">Santa Cruz</option>
                                    <option value="Tierra del Fuego">Tierra del Fuego</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Código Postal *</label>
                                <input
                                    type="text"
                                    value={shippingData.codigo_postal}
                                    onChange={(e) => setShippingData({...shippingData, codigo_postal: e.target.value.replace(/[^0-9]/g,'').slice(0,4)})}
                                    placeholder="1000"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Zona de Envío</label>
                                <input
                                    type="text"
                                    value={shippingData.zona_envio}
                                    readOnly
                                    className="readonly-input"
                                    placeholder="Se calculará automáticamente"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Notas de Envío (Opcional)</label>
                                <textarea
                                    value={shippingData.notas_envio}
                                    onChange={(e) => setShippingData({...shippingData, notas_envio: e.target.value})}
                                    placeholder="Timbre, referencias, horarios de entrega preferidos..."
                                    rows="3"
                                />
                            </div>
                        </div>
                        
            {shippingData.codigo_postal && shippingData.provincia && (
                            <div className="shipping-calculator">
                <h4>📦 Envío Calculado</h4>
                                <div className="shipping-info">
                                    <div className="shipping-detail">
                                        <span className="detail-label">Zona:</span>
                                        <span className="detail-value">{shippingData.zona_envio}</span>
                                    </div>
                                    <div className="shipping-detail">
                                        <span className="detail-label">Costo:</span>
                    <span className="detail-value cost">${costoEnvio}</span>
                                    </div>
                                    <div className="shipping-detail">
                                        <span className="detail-label">Tiempo estimado:</span>
                    <span className="detail-value">{calcularEnvio(shippingData.provincia, shippingData.codigo_postal, shippingData.ciudad).estimado}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="checkout-step">
                        <h3>3. Método de Pago</h3>
                        <div className="payment-methods">
                            <div className="payment-method">
                                <label>
                                    <input
                                        type="radio"
                                        name="metodo_pago"
                                        value="tarjeta_credito"
                                        checked={paymentData.metodo_pago === 'tarjeta_credito'}
                                        onChange={(e) => setPaymentData({...paymentData, metodo_pago: e.target.value})}
                                    />
                                    💳 Tarjeta de Crédito
                                </label>
                            </div>
                            <div className="payment-method">
                                <label>
                                    <input
                                        type="radio"
                                        name="metodo_pago"
                                        value="tarjeta_debito"
                                        checked={paymentData.metodo_pago === 'tarjeta_debito'}
                                        onChange={(e) => setPaymentData({...paymentData, metodo_pago: e.target.value})}
                                    />
                                    🏦 Tarjeta de Débito
                                </label>
                            </div>
                            <div className="payment-method">
                                <label>
                                    <input
                                        type="radio"
                                        name="metodo_pago"
                                        value="transferencia"
                                        checked={paymentData.metodo_pago === 'transferencia'}
                                        onChange={(e) => setPaymentData({...paymentData, metodo_pago: e.target.value})}
                                    />
                                    🏛️ Transferencia Bancaria
                                </label>
                            </div>
                        </div>

                        {(paymentData.metodo_pago === 'tarjeta_credito' || paymentData.metodo_pago === 'tarjeta_debito') && (
                            <div className="card-details">
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Número de Tarjeta *</label>
                                        <input
                                            type="text"
                                            value={paymentData.numero_tarjeta}
                                            onChange={(e) => setPaymentData({...paymentData, numero_tarjeta: e.target.value})}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Nombre del Titular *</label>
                                        <input
                                            type="text"
                                            value={paymentData.nombre_titular}
                                            onChange={(e) => setPaymentData({...paymentData, nombre_titular: e.target.value})}
                                            placeholder="Como aparece en la tarjeta"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mes de Expiración *</label>
                                        <select
                                            value={paymentData.mes_expiracion}
                                            onChange={(e) => setPaymentData({...paymentData, mes_expiracion: e.target.value})}
                                            required
                                        >
                                            <option value="">Mes</option>
                                            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                                <option key={month} value={month.toString().padStart(2, '0')}>
                                                    {month.toString().padStart(2, '0')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Año de Expiración *</label>
                                        <select
                                            value={paymentData.ano_expiracion}
                                            onChange={(e) => setPaymentData({...paymentData, ano_expiracion: e.target.value})}
                                            required
                                        >
                                            <option value="">Año</option>
                                            {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>CVV *</label>
                                        <input
                                            type="text"
                                            value={paymentData.cvv}
                                            onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentData.metodo_pago === 'transferencia' && (
                            <div className="transfer-info">
                                <h4>Datos para Transferencia</h4>
                                <p><strong>Banco:</strong> Banco Nacional</p>
                                <p><strong>Cuenta:</strong> 1234-5678-9012-3456</p>
                                <p><strong>CBU:</strong> 1234567890123456789012</p>
                                <p><strong>Titular:</strong> Velorum S.A.</p>
                                <p className="transfer-note">
                                    💡 Luego de realizar la transferencia presiona "Confirmar Pedido" y se abrirá WhatsApp para enviar el comprobante.
                                    <br/>Si no se abre automáticamente, hacé click aquí:{' '}
                                    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, envío comprobante de transferencia (aún sin número de pedido).')}`} target="_blank" rel="noopener noreferrer">Enviar por WhatsApp</a>
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="checkout-step">
                        <h3>4. Confirmación del Pedido</h3>
                        <div className="order-summary">
                            <div className="summary-section">
                                <h4>Datos Personales</h4>
                                <p>{customerData.nombre} {customerData.apellido}</p>
                                <p>{customerData.email}</p>
                                <p>{customerData.telefono_contacto}</p>
                            </div>
                            
                            <div className="summary-section">
                                <h4>Dirección de Envío</h4>
                                <p>
                                    {shippingData.calle} {shippingData.numero}
                                    {shippingData.piso && `, Piso ${shippingData.piso}`}
                                    {shippingData.departamento && `, Depto ${shippingData.departamento}`}
                                </p>
                                <p>{shippingData.ciudad}, {shippingData.provincia}</p>
                                <p>CP: {shippingData.codigo_postal}</p>
                                <p><strong>Zona:</strong> {shippingData.zona_envio}</p>
                                <p><strong>Costo de envío:</strong> ${costoEnvio}</p>
                                {shippingData.notas_envio && <p><strong>Notas:</strong> {shippingData.notas_envio}</p>}
                            </div>
                            
                            <div className="summary-section">
                                <h4>Método de Pago</h4>
                                <p>
                                    {paymentData.metodo_pago === 'tarjeta_credito' && '💳 Tarjeta de Crédito'}
                                    {paymentData.metodo_pago === 'tarjeta_debito' && '🏦 Tarjeta de Débito'}
                                    {paymentData.metodo_pago === 'transferencia' && '🏛️ Transferencia Bancaria'}
                                </p>
                                {paymentData.numero_tarjeta && (
                                    <p>**** **** **** {paymentData.numero_tarjeta.slice(-4)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h2>🛒 Finalizar Compra</h2>
                <div className="step-indicator">
                    {[1, 2, 3, 4].map(step => (
                        <div 
                            key={step} 
                            className={`step ${currentStep >= step ? 'active' : ''}`}
                        >
                            {step}
                        </div>
                    ))}
                </div>
            </div>

            <div className="checkout-content">
                {/* Modal / banner para transferencia */}
                {transferModalOpen && (
                    <div className="transfer-modal">
                        <div className="transfer-modal-content">
                            <h3>¡Pedido Confirmado!</h3>
                            <p>
                                Tu pedido <strong>#{createdOrderId}</strong> se ha registrado correctamente. 
                                Para completar la compra, realiza la transferencia bancaria y envíanos el comprobante por WhatsApp. 
                                Confirmaremos tu pago en un máximo de 24 horas hábiles.
                            </p>
                            <div className="transfer-modal-actions">
                                <button
                                    onClick={() => {
                                        const msg = encodeURIComponent(`Hola! Envío comprobante del pedido #${createdOrderId}.\n\nNombre: ${customerData.nombre} ${customerData.apellido}\nTotal: $${getTotalWithShipping().toFixed(2)}`);
                                        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
                                    }}
                                >
                                    📱 Enviar por WhatsApp
                                </button>
                                <button
                                    onClick={() => {
                                        setTransferModalOpen(false);
                                        navigate('/orders', { state: { message: 'Pedido creado exitosamente', orderId: createdOrderId } });
                                    }}
                                >
                                    Ver Mis Pedidos
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="checkout-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    {renderStep()}
                    
                    <div className="checkout-navigation">
                        {currentStep > 1 && (
                            <button 
                                className="btn-secondary"
                                onClick={prevStep}
                                disabled={loading}
                            >
                                ← Anterior
                            </button>
                        )}
                        
                        {currentStep < 4 ? (
                            <button 
                                className="btn-primary"
                                onClick={nextStep}
                                disabled={loading}
                            >
                                Siguiente →
                            </button>
                        ) : (
                            <button 
                                className="btn-success"
                                onClick={processOrder}
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Pedido'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="order-summary-sidebar">
                    <h3>Resumen</h3>
                    <div className="cart-items-summary">
                        {cartItems.map(item => (
                            <div key={item.id} className="item-summary">
                                <span className="item-name">{item.name || item.marca || 'Producto'}</span>
                                <span className="item-quantity">x{item.quantity}</span>
                                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="price-breakdown">
                        <div className="price-line">
                            <span>Subtotal:</span>
                            <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                        <div className="price-line">
                            <span>Envío:</span>
                            <span>${costoEnvio.toFixed(2)}</span>
                        </div>
                        <div className="price-line total">
                            <span>Total:</span>
                            <span>${getTotalWithShipping().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
