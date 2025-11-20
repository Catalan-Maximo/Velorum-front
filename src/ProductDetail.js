// 🛍️ **PRODUCTDETAIL.JS** - PÁGINA DE DETALLES DEL PRODUCTO

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import { useFavorites } from './FavoritesContext';
import { useCart } from './CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, setIsCartOpen, isInCart, getItemQuantity, updateQuantity } = useCart();

  const [products] = useState([
    // 👨 RELOJES PARA HOMBRE (IDs 1-13)
    {
      id: 1,
      name: "Audemars Piguet Royal Oak",
      price: 45999,
      rating: 4.9,
      reviews: 234,
      category: "luxury",
      badge: "Premium",
      image: "/Hombre/Audemars piguet.png",
      images: ["/Hombre/Audemars piguet.png", "/Hombre/Rolex Submarino.png", "/Hombre/Patek Philippe.png"],
      description: "Reloj icónico de lujo con diseño octagonal distintivo y acabados excepcionales.",
      fullDescription: "El Audemars Piguet Royal Oak es una obra maestra de la relojería suiza, reconocido mundialmente por su diseño octagonal distintivo y su acabado excepcional. Este reloj representa la cúspide del lujo y la artesanía relojera.",
      features: [
        "Movimiento automático suizo AP Calibre 3120",
        "Caja octagonal de acero inoxidable pulido",
        "Esfera 'Grande Tapisserie' característica",
        "Cristal de zafiro con tratamiento antirreflejos",
        "Resistente al agua hasta 50 metros",
        "Brazalete integrado de acero con cierre de seguridad"
      ],
      specifications: {
        "Movimiento": "Automático AP Calibre 3120",
        "Caja": "Acero inoxidable, 41mm",
        "Grosor": "9.8mm",
        "Cristal": "Zafiro",
        "Brazalete": "Acero inoxidable integrado",
        "Resistencia al agua": "50 metros",
        "Reserva de marcha": "60 horas"
      },
      inStock: true,
      stockQuantity: 3,
      gender: "men"
    },
    {
      id: 2,
      name: "Cartier Tank Cuero",
      price: 8999,
      rating: 4.8,
      reviews: 189,
      category: "classic",
      badge: "Elegante",
      image: "/Hombre/Cartier Cuero.png",
      images: ["/Hombre/Cartier Cuero.png", "/Hombre/Cartier Metalic.png"],
      description: "Elegancia atemporal con correa de cuero genuino y diseño rectangular icónico.",
      fullDescription: "El Cartier Tank es un ícono del diseño relojero, inspirado en los tanques de la Primera Guerra Mundial. Su forma rectangular y líneas limpias lo convierten en un símbolo de elegancia masculina.",
      features: [
        "Movimiento de cuarzo suizo",
        "Caja rectangular de acero pulido",
        "Correa de cuero de cocodrilo genuino",
        "Números romanos característicos",
        "Corona con cabujón de zafiro",
        "Cristal de zafiro resistente"
      ],
      specifications: {
        "Movimiento": "Cuarzo suizo",
        "Caja": "Acero inoxidable, 31x41mm",
        "Grosor": "6.6mm",
        "Cristal": "Zafiro",
        "Correa": "Cuero de cocodrilo",
        "Resistencia al agua": "30 metros"
      },
      inStock: true,
      stockQuantity: 8,
      gender: "men"
    },
    {
      id: 3,
      name: "Cartier Tank Metálico",
      price: 12999,
      rating: 4.9,
      reviews: 156,
      category: "luxury",
      badge: "Premium",
      image: "/Hombre/Cartier Metalic.png",
      images: ["/Hombre/Cartier Metalic.png", "/Hombre/Cartier Cuero.png"],
      description: "Versión metálica del clásico Tank con brazalete de acero inoxidable premium.",
      fullDescription: "La versión metálica del icónico Cartier Tank eleva la elegancia a otro nivel con su brazalete de acero inoxidable pulido y acabados premium que reflejan la maestría relojera francesa.",
      features: [
        "Movimiento de cuarzo de alta precisión",
        "Brazalete de acero inoxidable integrado",
        "Caja rectangular pulida a mano",
        "Esfera blanca lacada",
        "Agujas azuladas térmicamente",
        "Cierre desplegable con seguridad"
      ],
      specifications: {
        "Movimiento": "Cuarzo suizo",
        "Caja": "Acero inoxidable, 31x41mm",
        "Grosor": "6.6mm",
        "Cristal": "Zafiro",
        "Brazalete": "Acero inoxidable",
        "Resistencia al agua": "30 metros"
      },
      inStock: true,
      stockQuantity: 5,
      gender: "men"
    },
    {
      id: 4,
      name: "Casio G-Shock",
      price: 399,
      rating: 4.7,
      reviews: 892,
      category: "sport",
      badge: "Bestseller",
      image: "/Hombre/Casio G shock.png",
      images: ["/Hombre/Casio G shock.png", "/Hombre/Casio Water resist.png"],
      description: "Resistencia extrema y funciones deportivas para el hombre activo.",
      fullDescription: "El Casio G-Shock es sinónimo de resistencia y durabilidad. Diseñado para soportar las condiciones más extremas, es el compañero perfecto para deportistas y aventureros.",
      features: [
        "Resistencia a impactos y vibraciones",
        "Resistente al agua hasta 200m",
        "Cronómetro de alta precisión",
        "Múltiples alarmas programables",
        "Iluminación LED automática",
        "Batería de larga duración"
      ],
      specifications: {
        "Movimiento": "Cuarzo digital",
        "Caja": "Resina resistente, 55mm",
        "Grosor": "16.3mm",
        "Cristal": "Mineral",
        "Correa": "Resina",
        "Resistencia al agua": "200 metros"
      },
      inStock: true,
      stockQuantity: 25,
      gender: "men"
    },
    {
      id: 5,
      name: "Casio Water Resist",
      price: 299,
      rating: 4.6,
      reviews: 567,
      category: "sport",
      badge: "Nuevo",
      image: "/Hombre/Casio Water resist.png",
      images: ["/Hombre/Casio Water resist.png", "/Hombre/Casio G shock.png"],
      description: "Resistente al agua con múltiples funciones para deportes acuáticos.",
      fullDescription: "Diseñado específicamente para deportes acuáticos, este Casio combina funcionalidad y resistencia en un diseño moderno y deportivo.",
      features: [
        "Resistente al agua hasta 100m",
        "Cronómetro para natación",
        "Múltiples zonas horarias",
        "Calendario automático",
        "Alarmas múltiples",
        "Correa de resina antialérgica"
      ],
      specifications: {
        "Movimiento": "Cuarzo digital",
        "Caja": "Resina, 48mm",
        "Grosor": "13.2mm",
        "Cristal": "Mineral",
        "Correa": "Resina",
        "Resistencia al agua": "100 metros"
      },
      inStock: true,
      stockQuantity: 18,
      gender: "men"
    },
    {
      id: 6,
      name: "G-Shock Protection",
      price: 449,
      rating: 4.8,
      reviews: 423,
      category: "sport",
      badge: "Resistente",
      image: "/Hombre/G Shock protection.png",
      images: ["/Hombre/G Shock protection.png", "/Hombre/Casio G shock.png"],
      description: "Máxima protección contra impactos con tecnología avanzada.",
      fullDescription: "La línea Protection de G-Shock ofrece la máxima resistencia contra impactos y condiciones extremas, ideal para profesionales y deportistas de élite.",
      features: [
        "Tecnología anti-impacto avanzada",
        "Estructura de triple protección",
        "Solar y radio-controlado",
        "Múltiples sensores integrados",
        "Conectividad Bluetooth",
        "Diseño militar profesional"
      ],
      specifications: {
        "Movimiento": "Cuarzo solar",
        "Caja": "Carbono reforzado, 52mm",
        "Grosor": "15.8mm",
        "Cristal": "Mineral endurecido",
        "Correa": "Resina ultra-resistente",
        "Resistencia al agua": "200 metros"
      },
      inStock: true,
      stockQuantity: 12,
      gender: "men"
    },
    {
      id: 7,
      name: "Hamilton Automatic",
      price: 1899,
      rating: 4.7,
      reviews: 234,
      category: "classic",
      badge: "Automático",
      image: "/Hombre/Hamilton automatic.png",
      images: ["/Hombre/Hamilton automatic.png"],
      description: "Movimiento automático suizo con diseño vintage refinado.",
      fullDescription: "Hamilton combina la tradición relojera americana con la precisión suiza en este hermoso reloj automático de inspiración vintage.",
      features: [
        "Movimiento automático suizo H-10",
        "Reserva de marcha de 80 horas",
        "Caja de acero inoxidable",
        "Correa de cuero genuino",
        "Esfera vintage inspirada en aviación",
        "Cristal de zafiro"
      ],
      specifications: {
        "Movimiento": "Automático H-10",
        "Caja": "Acero inoxidable, 42mm",
        "Grosor": "12mm",
        "Cristal": "Zafiro",
        "Correa": "Cuero genuino",
        "Resistencia al agua": "100 metros",
        "Reserva de marcha": "80 horas"
      },
      inStock: true,
      stockQuantity: 15,
      gender: "men"
    },
    {
      id: 8,
      name: "Omega Seamaster",
      price: 6999,
      rating: 4.9,
      reviews: 345,
      category: "luxury",
      badge: "Profesional",
      image: "/Hombre/Omega sterany.png",
      images: ["/Hombre/Omega sterany.png"],
      description: "Reloj profesional con resistencia extrema y precisión suiza.",
      fullDescription: "El Omega Seamaster es el reloj de buceo profesional por excelencia, combinando precisión cronométrica con resistencia extrema al agua.",
      features: [
        "Movimiento Co-Axial Master Chronometer",
        "Resistente al agua hasta 300m",
        "Bisel unidireccional de cerámica",
        "Escape Co-Axial patentado",
        "Resistente a campos magnéticos",
        "Certificado METAS"
      ],
      specifications: {
        "Movimiento": "Co-Axial Master Chronometer",
        "Caja": "Acero inoxidable, 42mm",
        "Grosor": "13.5mm",
        "Cristal": "Zafiro",
        "Brazalete": "Acero inoxidable",
        "Resistencia al agua": "300 metros"
      },
      inStock: true,
      stockQuantity: 7,
      gender: "men"
    },
    {
      id: 9,
      name: "Patek Philippe Calatrava",
      price: 32999,
      rating: 5.0,
      reviews: 89,
      category: "luxury",
      badge: "Exclusivo",
      image: "/Hombre/Patek Philippe.png",
      images: ["/Hombre/Patek Philippe.png"],
      description: "La cúspide de la relojería suiza con artesanía excepcional.",
      fullDescription: "El Patek Philippe Calatrava representa la quintaesencia de la elegancia relojera. Una obra maestra de la artesanía suiza que trasciende el tiempo.",
      features: [
        "Movimiento mecánico Calibre 215 PS",
        "Caja de oro blanco 18k",
        "Esfera lacada artesanal",
        "Agujas Dauphine de oro",
        "Correa de cocodrilo Hermès",
        "Acabados manuales excepcionales"
      ],
      specifications: {
        "Movimiento": "Mecánico Calibre 215 PS",
        "Caja": "Oro blanco 18k, 39mm",
        "Grosor": "8.1mm",
        "Cristal": "Zafiro",
        "Correa": "Cocodrilo Hermès",
        "Resistencia al agua": "30 metros"
      },
      inStock: true,
      stockQuantity: 2,
      gender: "men"
    },
    {
      id: 10,
      name: "Poedagar 930",
      price: 199,
      rating: 4.5,
      reviews: 678,
      category: "casual",
      badge: "Oferta",
      image: "/Hombre/poedagar 930.png",
      images: ["/Hombre/poedagar 930.png"],
      description: "Reloj casual moderno con excelente relación calidad-precio.",
      fullDescription: "El Poedagar 930 ofrece un diseño moderno y funcional a un precio accesible, perfecto para el uso diario sin comprometer el estilo.",
      features: [
        "Movimiento de cuarzo japonés",
        "Caja de aleación resistente",
        "Correa de acero inoxidable",
        "Esfera multifunción",
        "Resistente al agua",
        "Diseño contemporáneo"
      ],
      specifications: {
        "Movimiento": "Cuarzo japonés",
        "Caja": "Aleación, 42mm",
        "Grosor": "10mm",
        "Cristal": "Mineral",
        "Correa": "Acero inoxidable",
        "Resistencia al agua": "30 metros"
      },
      inStock: true,
      stockQuantity: 30,
      gender: "men"
    },
    {
      id: 11,
      name: "Richard Mille",
      price: 89999,
      rating: 4.9,
      reviews: 45,
      category: "luxury",
      badge: "Ultra Premium",
      image: "/Hombre/Richard Mille.png",
      images: ["/Hombre/Richard Mille.png"],
      description: "Innovación y lujo extremo en relojería deportiva de alta gama.",
      fullDescription: "Richard Mille representa la vanguardia de la relojería contemporánea, combinando materiales de última generación con mecánica excepcional.",
      features: [
        "Caja de carbono TPT®",
        "Movimiento esqueletizado manual",
        "Resistencia a 5000 G",
        "Correa de caucho Formula 1",
        "Tecnología aeroespacial",
        "Edición limitada"
      ],
      specifications: {
        "Movimiento": "Manual esqueletizado",
        "Caja": "Carbono TPT®, 49.94mm",
        "Grosor": "16.15mm",
        "Cristal": "Zafiro",
        "Correa": "Caucho Formula 1",
        "Resistencia al agua": "50 metros"
      },
      inStock: true,
      stockQuantity: 1,
      gender: "men"
    },
    {
      id: 12,
      name: "Rolex Submariner",
      price: 18999,
      rating: 4.9,
      reviews: 567,
      category: "luxury",
      badge: "Icónico",
      image: "/Hombre/Rolex Submarino.png",
      images: ["/Hombre/Rolex Submarino.png"],
      description: "El icónico reloj de buceo con prestigio y funcionalidad excepcional.",
      fullDescription: "El Rolex Submariner es posiblemente el reloj de buceo más famoso del mundo, símbolo de prestigio y rendimiento excepcional bajo el agua.",
      features: [
        "Movimiento Perpetual automático",
        "Resistente al agua hasta 300m",
        "Bisel Cerachrom unidireccional",
        "Acero Oystersteel 904L",
        "Cristal de zafiro",
        "Certificado cronómetro COSC"
      ],
      specifications: {
        "Movimiento": "Perpetual 3135",
        "Caja": "Oystersteel 904L, 40mm",
        "Grosor": "12.5mm",
        "Cristal": "Zafiro",
        "Brazalete": "Oyster de acero",
        "Resistencia al agua": "300 metros"
      },
      inStock: true,
      stockQuantity: 4,
      gender: "men"
    },
    {
      id: 13,
      name: "Seiko Mod",
      price: 599,
      rating: 4.6,
      reviews: 234,
      category: "casual",
      badge: "Moderno",
      image: "/Hombre/Seiko mod.png",
      images: ["/Hombre/Seiko mod.png"],
      description: "Diseño modificado con estilo urbano y calidad japonesa confiable.",
      fullDescription: "El Seiko Mod combina la tradición relojera japonesa con un diseño urbano contemporáneo, perfecto para el hombre moderno.",
      features: [
        "Movimiento automático japonés",
        "Caja de acero inoxidable",
        "Esfera personalizada",
        "Corona roscada",
        "Brazalete tipo Jubilee",
        "Calidad Seiko garantizada"
      ],
      specifications: {
        "Movimiento": "Automático japonés",
        "Caja": "Acero inoxidable, 40mm",
        "Grosor": "11.5mm",
        "Cristal": "Hardlex",
        "Brazalete": "Acero inoxidable",
        "Resistencia al agua": "100 metros"
      },
      inStock: true,
      stockQuantity: 20,
      gender: "men"
    },
    // 👩 RELOJES PARA MUJER (IDs 14-18)
    {
      id: 14,
      name: "Cartier Oro 18k",
      price: 15999,
      rating: 4.9,
      reviews: 187,
      category: "luxury",
      badge: "Oro 18k",
      image: "/Mujer/Cartier oro 18k.png",
      images: ["/Mujer/Cartier oro 18k.png"],
      description: "Elegancia suprema en oro de 18 quilates con diseño atemporal francés.",
      fullDescription: "Una obra maestra de la joyería relojera francesa, este Cartier en oro de 18k representa la elegancia femenina en su máxima expresión.",
      features: [
        "Caja de oro amarillo 18k",
        "Movimiento de cuarzo suizo",
        "Esfera blanca lacada",
        "Agujas azuladas",
        "Correa de cuero de cocodrilo",
        "Corona con cabujón de zafiro"
      ],
      specifications: {
        "Movimiento": "Cuarzo suizo",
        "Caja": "Oro 18k, 28mm",
        "Grosor": "6mm",
        "Cristal": "Zafiro",
        "Correa": "Cuero de cocodrilo",
        "Resistencia al agua": "30 metros"
      },
      inStock: true,
      stockQuantity: 3,
      gender: "women"
    },
    {
      id: 15,
      name: "Chopard Happy Diamonds",
      price: 12999,
      rating: 4.8,
      reviews: 298,
      category: "luxury",
      badge: "Diamantes",
      image: "/Mujer/Chopard.png",
      images: ["/Mujer/Chopard.png"],
      description: "Icónico diseño con diamantes flotantes, símbolo de alegría y elegancia.",
      fullDescription: "Los diamantes flotantes de Chopard crean un espectáculo mágico en la muñeca, simbolizando la alegría y la elegancia femenina.",
      features: [
        "Diamantes móviles flotantes",
        "Caja de acero inoxidable",
        "Movimiento de cuarzo suizo",
        "Cristal de zafiro",
        "Correa de cuero genuino",
        "Diseño icónico Happy Diamonds"
      ],
      specifications: {
        "Movimiento": "Cuarzo suizo",
        "Caja": "Acero inoxidable, 32mm",
        "Grosor": "8mm",
        "Cristal": "Zafiro",
        "Correa": "Cuero genuino",
        "Resistencia al agua": "30 metros"
      },
      inStock: true,
      stockQuantity: 6,
      gender: "women"
    },
    {
      id: 16,
      name: "Omega Constellation",
      price: 4999,
      rating: 4.7,
      reviews: 156,
      category: "elegant",
      badge: "Elegante",
      image: "/Mujer/Omega complelltion.png",
      images: ["/Mujer/Omega complelltion.png"],
      description: "Precisión suiza combinada con sofisticación femenina excepcional.",
      fullDescription: "El Omega Constellation femenino combina la precisión cronométrica suiza con un diseño elegante y sofisticado.",
      features: [
        "Movimiento Co-Axial",
        "Caja de acero y oro",
        "Esfera nacarada",
        "Bisel con griffes",
        "Brazalete integrado",
        "Certificado cronómetro"
      ],
      specifications: {
        "Movimiento": "Co-Axial automático",
        "Caja": "Acero y oro, 29mm",
        "Grosor": "9.5mm",
        "Cristal": "Zafiro",
        "Brazalete": "Acero y oro",
        "Resistencia al agua": "100 metros"
      },
      inStock: true,
      stockQuantity: 8,
      gender: "women"
    },
    {
      id: 17,
      name: "Patek Philippe Genève",
      price: 28999,
      rating: 5.0,
      reviews: 67,
      category: "luxury",
      badge: "Exclusivo",
      image: "/Mujer/Patek Philippe geneve.png",
      images: ["/Mujer/Patek Philippe geneve.png"],
      description: "La cúspide de la relojería femenina con artesanía suiza incomparable.",
      fullDescription: "Este Patek Philippe femenino representa la máxima expresión de la relojería suiza para damas, con acabados artesanales excepcionales.",
      features: [
        "Movimiento mecánico ultra-fino",
        "Caja de oro rosa 18k",
        "Esfera guillochée artesanal",
        "Agujas leaf de oro",
        "Correa de satén",
        "Hebilla de oro rosa"
      ],
      specifications: {
        "Movimiento": "Mecánico ultra-fino",
        "Caja": "Oro rosa 18k, 33mm",
        "Grosor": "6.8mm",
        "Cristal": "Zafiro",
        "Correa": "Satén premium",
        "Resistencia al agua": "30 metros"
      },
      inStock: true,
      stockQuantity: 2,
      gender: "women"
    },
    {
      id: 18,
      name: "TAG Heuer Aquaracer",
      price: 2999,
      rating: 4.6,
      reviews: 234,
      category: "sport",
      badge: "Deportivo",
      image: "/Mujer/Tag heuer Aquaracer.png",
      images: ["/Mujer/Tag heuer Aquaracer.png"],
      description: "Elegancia deportiva con resistencia al agua para la mujer activa.",
      fullDescription: "El TAG Heuer Aquaracer femenino combina elegancia y funcionalidad deportiva, perfecto para la mujer moderna y activa.",
      features: [
        "Movimiento de cuarzo suizo",
        "Resistente al agua hasta 300m",
        "Bisel unidireccional",
        "Caja de acero pulido",
        "Brazalete de acero",
        "Índices luminiscentes"
      ],
      specifications: {
        "Movimiento": "Cuarzo suizo",
        "Caja": "Acero inoxidable, 35mm",
        "Grosor": "9.5mm",
        "Cristal": "Zafiro",
        "Brazalete": "Acero inoxidable",
        "Resistencia al agua": "300 metros"
      },
      inStock: true,
      stockQuantity: 12,
      gender: "women"
    }
  ]);

  // 🔄 CARGAR PRODUCTO AL INICIAR (sin retraso artificial)
  useEffect(() => {
    const productId = parseInt(id);
    const productData = products.find(p => p.id === productId);
    setProduct(productData || null);
    setLoading(false);
  }, [id, products]);

  // 🛒 AGREGAR AL CARRITO
  const handleAddToCart = () => {
    if (!product) return;
    // Si ya está en el carrito, actualizamos la cantidad acumulando
    const alreadyQty = getItemQuantity(product.id);
    if (alreadyQty > 0) {
      updateQuantity(product.id, alreadyQty + quantity);
    } else {
      addToCart(product, quantity);
    }
    setIsCartOpen(true);
  };

  // 💖 FAVORITO
  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/products')} className="back-btn">
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <button className="back-btn-minimal" onClick={() => navigate(-1)} aria-label="Volver">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        <span>Volver</span>
      </button>
      {/* 🔙 BREADCRUMB - ELIMINAR ESTA SECCIÓN COMPLETA */}
      {/* 
      <div className="breadcrumb">
        <div className="breadcrumb-container">
          <button onClick={() => navigate('/')} className="breadcrumb-link">Inicio</button>
          <span className="breadcrumb-separator">→</span>
          <button onClick={() => navigate('/products')} className="breadcrumb-link">Productos</button>
          <span className="breadcrumb-separator">→</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>
      */}

      <div className="product-detail-container">
        {/* 🖼️ GALERÍA DE IMÁGENES */}
        <div className="product-gallery">
          <div className="main-image">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className="main-product-image"
            />
            {product.badge && (
              <div className={`product-badge ${product.badge.toLowerCase()}`}>
                {product.badge}
              </div>
            )}
          </div>
          
          <div className="image-thumbnails">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} vista ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 📋 INFORMACIÓN DEL PRODUCTO */}
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              <div className="stars">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="rating-number">({product.rating})</span>
              <span className="reviews-count">{product.reviews} reseñas</span>
            </div>
          </div>

          <div className="product-pricing">
            <span className="current-price">${product.price.toLocaleString()}</span>
          </div>

          <p className="product-description">{product.description}</p>

          {/* 🎯 CARACTERÍSTICAS DESTACADAS */}
          <div className="product-features">
            <h3>Características destacadas:</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* 🛒 SECCIÓN DE COMPRA */}
          <div className="purchase-section sticky-purchase">
            <div className="quantity-selector">
              <label>Cantidad:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="quantity-btn"
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>
            </div>

            <div className="stock-info">
              {product.inStock ? (
                <span className="in-stock">✅ En stock ({product.stockQuantity} disponibles)</span>
              ) : (
                <span className="out-stock">❌ Agotado</span>
              )}
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleAddToCart}
                className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                disabled={!product.inStock}
              >
                {isInCart(product.id) ? 'Actualizar carrito' : 'Agregar al carrito'} · ${(product.price * quantity).toLocaleString()}
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`wishlist-btn-icon ${isFavorite(product.id) ? 'favorite-active' : ''}`}
                title={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📖 DESCRIPCIÓN COMPLETA Y ESPECIFICACIONES */}
      <div className="product-details-tabs">
        <div className="tabs-container">
          <div className="tab-content">
            <div className="description-section">
              <h2>Descripción completa</h2>
              <p>{product.fullDescription}</p>
            </div>

            <div className="specifications-section">
              <h2>Especificaciones técnicas</h2>
              <div className="specs-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;