// 🏢 **ABOUT.JS** - PÁGINA DE INFORMACIÓN DE LA EMPRESA
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

function About() {
  const navigate = useNavigate();
  return (
    <div className="about-page">
      {/* 🎯 HERO SECTION */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">Acerca de Velorum</h1>
          <p className="hero-subtitle">
            Más que relojes, creamos experiencias que trascienden el tiempo
          </p>
        </div>
      </section>

      {/* 📖 NUESTRA HISTORIA */}
      <section className="about-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Nuestra Historia</h2>
            <div className="section-line"></div>
          </div>
          <div className="content-grid">
            <div className="content-text">
              <p>
                Velorum nació en 2020 con una visión clara: crear relojes excepcionales 
                que combinen la artesanía tradicional con el diseño contemporáneo. Desde 
                nuestros humildes comienzos, hemos crecido hasta convertirnos en una marca 
                reconocida internacionalmente.
              </p>
              <p>
                Cada reloj que creamos cuenta una historia única, fusionando técnicas 
                heredadas de generaciones de relojeros con la innovación tecnológica más 
                avanzada. Nuestro compromiso es ofrecer piezas que no solo marquen el tiempo, 
                sino que se conviertan en compañeros de vida.
              </p>
            </div>
            <div className="content-image">
              <div className="history-timeline">
                <div className="timeline-item">
                  <div className="year">2020</div>
                  <div className="milestone">Fundación de Velorum</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2021</div>
                  <div className="milestone">Primera colección lanzada</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2022</div>
                  <div className="milestone">Expansión internacional</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2023</div>
                  <div className="milestone">Certificación ISO de calidad</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2024</div>
                  <div className="milestone">50,000 relojes vendidos</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2025</div>
                  <div className="milestone">Nueva línea premium</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 NUESTRA MISIÓN (ajustada a etapa temprana) */}
      <section className="about-section mission-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Nuestra Misión</h2>
            <div className="section-line"></div>
          </div>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎨</div>
              <h3>Diseñar con Intención</h3>
              <p>
                Lanzamos pocas piezas y refinamos cada una con feedback real de nuestros primeros clientes. 
                Menos catálogo, más foco en que cada reloj valga la pena.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">⚙️</div>
              <h3>Mejorar Iterando</h3>
              <p>
                Somos un equipo chico: priorizamos ajustar mecanismos, acabados y empaques 
                rápido sobre inflar números. Cada lote trae pequeñas mejoras.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🌟</div>
              <h3>Accesible y Honesto</h3>
              <p>
                Queremos que un buen reloj mecánico o híbrido no sea inalcanzable. Transparencia en materiales, 
                procesos y precios desde el día uno.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 NUESTRO EQUIPO (realista para primer año) */}
      <section className="about-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Nuestro Equipo</h2>
            <div className="section-line"></div>
          </div>
          <p className="team-intro">
            Empezamos en 2024 como un proyecto entre amigos: diseño, ingeniería ligera y 
            mucha curiosidad por relojería. Hoy somos un núcleo pequeño que hace de todo: 
            ensamblar, empaquetar, responder correos y mejorar procesos.
          </p>
          <div className="team-stats">
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Equipo Núcleo</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1°</div>
              <div className="stat-label">Año Activo</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">300</div>
              <div className="stat-label">Piezas Entregadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Provincias Alcance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 NUESTROS VALORES (aterrizados) */}
      <section className="about-section values-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Nuestros Valores</h2>
            <div className="section-line"></div>
          </div>
          <div className="values-grid">
            <div className="value-item">
              <h3>🎯 Foco</h3>
              <p>Pocas referencias activas para no diluir calidad ni atención.</p>
            </div>
            <div className="value-item">
              <h3>🤝 Transparencia</h3>
              <p>Decimos qué usamos, qué mejoramos y qué todavía no resolvimos.</p>
            </div>
            <div className="value-item">
              <h3>💡 Aprendizaje</h3>
              <p>Iteramos rápido: versiones cortas, ajustes rápidos, feedback directo.</p>
            </div>
            <div className="value-item">
              <h3>🌱 Responsabilidad</h3>
              <p>Preferimos materiales durables y empaques reutilizables antes que marketing extra.</p>
            </div>
            <div className="value-item">
              <h3>👥 Cercanía</h3>
              <p>Clientes temprano = socios que nos ayudan a decidir qué sigue.</p>
            </div>
            <div className="value-item">
              <h3>⏰ Respeto</h3>
              <p>Apreciamos la relojería clásica mientras exploramos híbridos y nuevas tecnologías.</p>
            </div>
            <div className="value-item">
              <h3>🛠 Simplicidad</h3>
              <p>Preferimos procesos simples y mantenibles en lugar de complejidad innecesaria.</p>
            </div>
            <div className="value-item">
              <h3>📣 Feedback</h3>
              <p>Escuchamos cada correo y ajuste pedido: lo convertimos en iteración real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📞 CONTACTO */}
      <section className="about-section contact-section enhanced-contact">
        <div className="section-container">
          <div className="contact-inner">
            <div className="contact-head">
              <h2>¿Tienes Preguntas?</h2>
              <div className="section-line gold"></div>
            </div>
            <p className="contact-text">
              Nos encantaría conocerte y contarte más sobre nuestros relojes. <br/>
              <span className="muted">Respondemos normalmente dentro de 24h hábiles.</span>
            </p>
            <div className="contact-buttons">
              <button
                className="btn-primary contact-main-btn"
                aria-label="Enviar correo a Velorum"
                onClick={() => {
                  window.open('https://mail.google.com/mail/?view=cm&fs=1&to=m.catalan@alumno.um.edu.ar&su=Consulta%20Velorum','_blank');
                }}
              >
                CONTÁCTANOS
              </button>
              <button
                className="btn-secondary contact-secondary-btn"
                onClick={() => navigate('/products')}
              >
                Ver Colección
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
