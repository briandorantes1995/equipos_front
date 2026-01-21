import React, { useEffect, useState } from "react";
import obtenerArticulos from "../../Functions/obtenerArticulos";
import logo from "../../assets/logo2.png";
import "./Catalogo.css";

export default function Catalogo() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await obtenerArticulos();
        setArticulos(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="catalogo-loading">
        Cargando catálogo…
      </div>
    );
  }

  return (
    <div className="catalogo-root">
      {/* PORTADA */}
      <section className="catalogo-portada">
        <img src={logo} className="catalogo-logo" alt="Equipos Médicos MTY" />
        <h1>Catálogo de Equipos Médicos MTY</h1>
        <p className="catalogo-subtitle">
          Soluciones profesionales para tu clínica y hospital
        </p>
      </section>

      {/* GRID DE PRODUCTOS */}
      <section className="catalogo-grid">
        {articulos.map((articulo) => (
          <article className="catalogo-card" key={articulo.id}>
            <img
              src={articulo.imagen || "/no_image.jpg"}
              alt={articulo.nombre}
              loading="lazy"
            />
            <h3>{articulo.nombre}</h3>
            <p><strong>Marca:</strong> {articulo.marca || "—"}</p>
            <p><strong>Proveedor:</strong> {articulo.proveedor || "—"}</p>
          </article>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="catalogo-footer">
        <p>Contacto: ventas@equiposmedicosmty.com</p>
        <p>Tel / WhatsApp: +52 8114175468</p>
      </footer>
    </div>
  );
}



