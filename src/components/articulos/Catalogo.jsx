import React, { useEffect, useState } from "react";
import obtenerArticulos from "../../Functions/obtenerArticulos";
import "./Catalogo.css";

export default function Catalogo() {
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await obtenerArticulos();
      setArticulos(Array.isArray(data) ? data : []);
    }
    load();
  }, []);

  return (
    <div className="pdf-root" id="catalogo-pdf">
      {/* PORTADA */}
      <div className="pdf-page portada">
        <img src="/logo.png" className="logo" />
        <h1>Catálogo de Equipos Médicos MTY</h1>
        <p className="subtitle">Soluciones profesionales para tu clínica y hospital</p>
      </div>

      {/* CATÁLOGO */}
      <div className="pdf-page">
        <div className="grid">
          {articulos.map((articulo, index) => (
            <div className="card" key={index}>
              <img
                src={articulo.imagen || "/no_image.jpg"}
                alt={articulo.nombre}
              />
              <h3>{articulo.nombre}</h3>

              <p><strong>Marca:</strong> {articulo.marca || "—"}</p>
              <p><strong>Proveedor:</strong> {articulo.proveedor || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="pdf-page footer">
        <p>Contacto: ventas@equiposmedicosmty.com</p>
        <p>Tel / WhatsApp: +52 8114175468</p>
      </div>
    </div>
  );
}
