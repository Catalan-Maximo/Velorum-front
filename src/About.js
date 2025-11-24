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
            Curamos y vendemos relojes de alta calidad seleccionados por su rendimiento y estilo
          </p>
        </div>
      </section>

      {/* 📖 NUESTRA HISTORIA */}
      <section className="about-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Nuestra Historia</h2>
          </div>
          <div className="content-grid">
            <div className="content-text">
              <p>
                Velorum arrancó en 2023 con una idea sencilla: acercar a los coleccionistas y
                aficionados relojes seleccionados por su calidad y trayectoria. En lugar de
                fabricar, nos dedicamos a buscar, verificar y traer al mercado piezas que
                realmente valgan la pena.
              </p>
              <p>
                Trabajamos con proveedores y distribuidores fiables para seleccionar relojes
                que cumplan altos estándares de funcionamiento, estética y durabilidad. Nuestro
                objetivo es ofrecer opciones que los clientes disfruten y con las que se sientan
                tranquilos al comprar.
              </p>
            </div>
            <div className="content-image">
              <div className="history-timeline">
                <div className="timeline-item">
                  <div className="year">2023</div>
                  <div className="milestone">Inicio de actividades: selección y curación</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2024</div>
                  <div className="milestone">Crecimiento del catálogo curado</div>
                </div>
                <div className="timeline-item">
                  <div className="year">2025</div>
                  <div className="milestone">Ampliamos alcance nacional</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 NUESTRA MISIÓN */}
<section className="about-section mission-section">
  <div className="section-container">
    <div className="section-header">
      <h2>Nuestra Misión</h2>
    </div>

    <div className="mission-grid">

      {/* 🔍 Curación estricta */}
      <div className="mission-card">
        <div className="mission-icon">
          {/* ICONO LUPA */}
          <svg xmlns="http://www.w3.org/2000/svg" width="1.07em" height="1em" viewBox="0 0 17 16">
            <g fill="currentColor" fillRule="evenodd">
              <path d="M17 5.954C17 2.665 14.317 0 11.009 0C7.698 0 5.016 2.665 5.016 5.954c0 3.287 2.683 5.952 5.993 5.952c3.308 0 5.991-2.665 5.991-5.952m-11.066.065A5.08 5.08 0 0 1 11.026.943a5.08 5.08 0 0 1 5.088 5.076a5.08 5.08 0 0 1-5.088 5.075c-2.813 0-5.092-5.272-5.092-5.075m-3.112 9.945L1 14.142l4.037-4.038s.096.765.58 1.247c.482.484 1.242.576 1.242.576z"/>
              <path d="M14.398 5.073c0 .572.44.356.44-.439c0-1.37-1.109-2.48-2.479-2.48c-.797 0-1.012.439-.439.439a2.48 2.48 0 0 1 2.478 2.48"/>
            </g>
          </svg>
        </div>
        <h3>Curación estricta</h3>
        <p>
          Seleccionamos cada referencia basándonos en calidad, estado y reputación del proveedor.
          Nuestro proceso evita sorpresas y garantiza que lo que vendemos funciona y luce bien.
        </p>
      </div>

      {/* 🤝 Relaciones confiables */}
      <div className="mission-card">
        <div className="mission-icon">
          {/* NUEVO ICONO MANOS */}
          <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1em" viewBox="0 0 640 512">
            <path fill="currentColor" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24m147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7"/>
          </svg>
        </div>
        <h3>Relaciones confiables</h3>
        <p>
          Trabajamos con distribuidores y vendedores verificados para asegurar trazabilidad y
          condiciones justas en cada adquisición.
        </p>
      </div>

      {/* 🌟 Transparencia para comprar */}
      <div className="mission-card">
        <div className="mission-icon">
          {/* NUEVO ICONO ESTRELLA */}
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 2.844L9.19 9.22l-6.377 2.811l6.377 2.811L12 21.22l2.812-6.377l6.376-2.811l-6.376-2.811z"/>
          </svg>
        </div>
        <h3>Transparencia para comprar</h3>
        <p>
          Informamos claramente el estado del reloj, sus especificaciones y cualquier historia
          relevante para que la compra sea segura y satisfactoria.
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
          </div>
          <p className="team-intro">
            Empezamos en 2023 como un proyecto entre amigos interesados en relojería. Nos
            enfocamos en buscar, verificar y traer al mercado piezas con buen historial y
            estado, gestionando todo el proceso de venta y posventa con cercanía.
          </p>
          <div className="team-stats">
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Equipo Núcleo</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Años Activos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,200</div>
              <div className="stat-label">Piezas Gestionadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10</div>
              <div className="stat-label">Regiones Alcance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 NUESTROS VALORES (aterrizados) */}
<section className="about-section values-section">
  <div className="section-container">
    <div className="section-header">
      <h2>Nuestros Valores</h2>
    </div>

    <div className="values-grid">

      {/* 🎯 Foco */}
      <div className="value-item">
        <h3 className="value-title">
          <span className="value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M8 12h9m-9 0l-2-2H2l2 2l-2 2h4zm9 0l-2-2m2 2l-2 2m1 8.5c2.761 0 5-4.701 5-10.5S18.761 1.5 16 1.5S11 6.201 11 12s2.239 10.5 5 10.5"/>
            </svg>
          </span>
          Foco
        </h3>
        <p>Pocas referencias activas para no diluir calidad ni atención.</p>
      </div>

      {/* 🤝 Transparencia */}
      <div className="value-item">
        <h3 className="value-title">
          <span className="value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1em" viewBox="0 0 640 512">
              <path fill="currentColor" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24m147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7"/>
            </svg>
          </span>
          Transparencia
        </h3>
        <p>Decimos qué usamos, qué mejoramos y qué todavía no resolvimos.</p>
      </div>

      {/* 💡 Aprendizaje */}
      <div className="value-item">
        <h3 className="value-title">
          <span className="value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7M9 21v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1m3-17a5 5 0 0 0-5 5c0 2.05 1.23 3.81 3 4.58V16h4v-2.42c1.77-.77 3-2.53 3-4.58a5 5 0 0 0-5-5"/>
            </svg>
          </span>
          Aprendizaje
        </h3>
        <p>Iteramos rápido: versiones cortas, ajustes rápidos, feedback directo.</p>
      </div>

      {/* 🌱 Responsabilidad → NUEVO ICONO */}
      <div className="value-item">
        <h3 className="value-title">
          <span className="value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
              <path fill="currentColor"
                d="M247.63 47.89a8 8 0 0 0-7.52-7.52c-51.76-3-93.32 12.74-111.18 42.22c-11.8 19.49-11.78 43.16-.16 65.74a71.3 71.3 0 0 0-14.17 27L98.33 159c7.82-16.33 7.52-33.35-1-47.49c-13.2-21.79-43.67-33.47-81.5-31.25a8 8 0 0 0-7.52 7.52c-2.23 37.83 9.46 68.3 31.25 81.5A45.8 45.8 0 0 0 63.44 176A54.6 54.6 0 0 0 87 170.33l25 25V224a8 8 0 0 0 16 0v-29.49a55.6 55.6 0 0 1 12.27-35a73.9 73.9 0 0 0 33.31 8.4a60.9 60.9 0 0 0 31.83-8.86c29.48-17.84 45.26-59.4 42.22-111.16M47.81 155.6C32.47 146.31 23.79 124.32 24 96c28.32-.24 50.31 8.47 59.6 23.81c4.85 8 5.64 17.33 2.46 26.94l-24.41-24.41a8 8 0 0 0-11.31 11.31l24.41 24.41c-9.61 3.18-18.93 2.39-26.94-2.46m149.31-10.22c-13.4 8.11-29.15 8.73-45.15 2l53.69-53.7a8 8 0 0 0-11.31-11.31L140.65 136c-6.76-16-6.15-31.76 2-45.15c13.94-23 47-35.82 89.33-34.83c.96 42.32-11.84 75.42-34.86 89.36"/>
            </svg>
          </span>
          Responsabilidad
        </h3>
        <p>Preferimos materiales durables y empaques reutilizables antes que marketing extra.</p>
      </div>

      {/* 👥 Cercanía */}
      <div className="value-item">
        <h3 className="value-title">
          <span className="value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" fillRule="evenodd"
                d="M12 6a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7m-1.5 8a4 4 0 0 0-4 4a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2a4 4 0 0 0-4-4zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293a3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2a4 4 0 0 0-4-4h-1.1a5.5 5.5 0 0 1-.471.762A6 6 0 0 1 19.5 18M4 7.5a3.5 3.5 0 0 1 5.477-2.889a5.5 5.5 0 0 0-2.796 6.293A3.5 3.5 0 0 1 4 7.5M7.1 12H6a4 4 0 0 0-4 4a2 2 0 0 0 2 2h.5a6 6 0 0 1 3.071-5.238A5.5 5.5 0 0 1 7.1 12"
                clipRule="evenodd"/>
            </svg>
          </span>
          Cercanía
        </h3>
        <p>Clientes temprano = socios que nos ayudan a decidir qué sigue.</p>
      </div>

      {/* ⏰ Respeto */}
      <div className="value-item">
        <h3 className="value-title">
          <span className="value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
              <defs>
                <mask id="respMask2">
                  <g fill="none">
                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"
                      d="M4 44h40M27 32h12v12H27zm11-22v6m-10-6v6m0-6l5-6l5 6z"/>
                    <path stroke="#fff" strokeLinejoin="round" strokeWidth="4"
                      d="M25 20H11a2 2 0 0 0-2 2v22"/>
                    <path stroke="#fff" strokeLinecap="round" strokeWidth="4"
                      d="M15 29h4m-4 7h4"/>
                    <rect width="16" height="16" x="25" y="16" fill="#fff" stroke="#fff"
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" rx="1"/>
                    <circle cx="33" cy="24" r="3" fill="#000"/>
                    <path stroke="#fff" strokeLinecap="round" strokeWidth="4" d="M33 32v10"/>
                  </g>
                </mask>
              </defs>
              <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#respMask2)"/>
            </svg>
          </span>
          Respeto
        </h3>
        <p>Apreciamos la relojería clásica mientras exploramos híbridos y nuevas tecnologías.</p>
      </div>

      {/* 🛠 Simplicidad */}
      <div className="value-item">
        <h3 className="value-title">
          <span className="value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
              <path fill="currentColor"
                d="m5.25 2.75l-.563.531l-1.406 1.406l-.531.563l.406.656l2.094 3.5l.281.5H8.47l4 3.969c-3.574 3.59-8.121 8.152-8.281 8.313c-1.567 1.566-1.57 4.132.03 5.625c1.563 1.542 4.11 1.582 5.595 0l.03-.032L16 21.594l6.188 6.218l.093.063c1.57 1.48 4.067 1.5 5.532-.063v-.03h.03c1.532-1.567 1.548-4.114-.03-5.595l-.032-.03l-5.218-5.188c3.511-.328 6.261-3.293 6.312-6.875h.031c.004-.02 0-.043 0-.063V10c.098-1.156-.152-2.262-.75-3.219L27.47 5.72l-4.657 4.656l-1.406-1.469l4.75-4.75l-1.375-.562A7 7 0 0 0 22 3c-3.844 0-7 3.156-7 7c0 .418.09.781.156 1.156c-.437.438-.765.797-1.281 1.313L9.906 8.5V5.531l-.5-.281l-3.5-2.094zM22 5c.14 0 .238.082.375.094l-3.781 3.781l.687.719l2.813 2.906l.687.719L26.75 9.25c.02.23.184.398.156.656V10c0 2.754-2.246 5-5 5c-.367 0-.812-.086-1.312-.188l-.532-.093l-.375.375l-11.28 11.312h-.032v.032c-.71.777-1.953.796-2.781-.032v-.031h-.032c-.777-.71-.796-1.953.032-2.781c.379-.38 7.718-7.782 11.312-11.375l.407-.406l-.157-.563A6 6 0 0 1 17 10c0-2.754 2.246-5 5-5m-16.438.25l2.344 1.438v1l-.218.218h-1L5.25 5.563zm14.625 12.156l6.22 6.188v.031h.03c.778.71.797 1.953-.03 2.781h-.032v.032c-.71.777-1.953.796-2.781-.032l-6.188-6.218z"/>
            </svg>
          </span>
          Simplicidad
        </h3>
        <p>Preferimos procesos simples y mantenibles en lugar de complejidad innecesaria.</p>
      </div>

      {/* Comentarios */}
      <div className="value-item">
        <h3 className="value-title">
          <span className="value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M15 4v7H5.17L4 12.17V4zm1-2H3a1 1 0 0 0-1 1v14l4-4h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m5 4h-2v9H6v2a1 1 0 0 0 1 1h11l4 4V7a1 1 0 0 0-1-1"/>
            </svg>
          </span>
          Comentarios
        </h3>
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
