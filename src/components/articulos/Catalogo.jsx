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

  // 🔑 activar modo PDF
  document.body.classList.add("pdf-mode");

  // subir al inicio
  window.scrollTo(0, 0);

  // esperar repaint real
  await new Promise((r) => setTimeout(r, 600));

  await html2pdf()
    .set({
      margin: 10,
      filename: "catalogo_equipos_medicos_mty.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(element)
    .save();

  // 🔑 salir de modo PDF
  document.body.classList.remove("pdf-mode");
};


  return (
    <>
      {/* UI SOLO PANTALLA (NO PDF) */}
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
        <div className="portada page-break">
          <img src={logo} className="logo" alt="Logo" />
          <h1>Catálogo de Equipos Médicos MTY</h1>
          <p className="subtitle">
            Soluciones profesionales para tu clínica y hospital
          </p>
        </div>

        {/* GRID CONTINUO (2 columnas) */}
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

        {/* FOOTER */}
        <div className="footer page-break">
          <p>Contacto: ventas@equiposmedicosmty.com</p>
          <p>Tel / WhatsApp: +52 8114175468</p>
        </div>
      </div>
    </>
  );
}


