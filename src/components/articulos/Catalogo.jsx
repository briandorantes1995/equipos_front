import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import obtenerArticulos from "../../Functions/obtenerArticulos";
import logo from "../../assets/logo2.png";
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

  const handleDownload = async () => {
    const element = document.getElementById("catalogo-pdf");
    if (!element) return;

    await new Promise((r) => setTimeout(r, 300));

    html2pdf().set({
      margin: 10,
      filename: "catalogo_equipos_medicos_mty.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    }).from(element).save();
  };

  return (
    <>
      {/* UI SOLO PANTALLA */}
      <div className="catalogo-ui no-pdf">
        <h2>Catálogo en PDF</h2>
        <p>
          Descarga el catálogo actualizado para enviarlo a tus clientes
          por correo o WhatsApp.
        </p>
        <button onClick={handleDownload} className="btn-descargar">
          Descargar catálogo PDF
        </button>
      </div>

      {/* CONTENIDO PDF */}
      <div className="pdf-root" id="catalogo-pdf">
        {/* PORTADA */}
        <div className="pdf-page portada">
          <img src={logo} className="logo" />
          <h1>Catálogo de Equipos Médicos MTY</h1>
          <p className="subtitle">
            Soluciones profesionales para tu clínica y hospital
          </p>
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
    </>
  );
}

