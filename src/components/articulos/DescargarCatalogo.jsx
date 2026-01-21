import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import Catalogo from "./Catalogo.jsx";
import "./DescargarCatalogo.css";

export default function DescargarCatalogo() {
  const [mostrarPreview, setMostrarPreview] = useState(false);

  const waitForImages = async (rootEl) => {
    const imgs = Array.from(rootEl.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((res) => {
          img.onload = () => res();
          img.onerror = () => res();
        });
      })
    );
  };

  const handleDownload = async () => {
  const element = document.getElementById("catalogo-pdf");
  if (!element) {
    alert("No se encontró el catálogo para generar el PDF.");
    return;
  }

  // mostrar para captura
  setMostrarPreview(true);

  // ⏳ esperar render REAL
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => setTimeout(r, 800));
  await waitForImages(element);

  await html2pdf()
    .set({
      margin: 10,
      filename: "catalogo_equipos_medicos.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(element)
    .save();

  setMostrarPreview(false);
};


  return (
    <div className="descargar-container">
      <h2>Catálogo en PDF</h2>
      <p>
        Genera el catálogo actualizado para enviarlo a tus clientes
        por correo o WhatsApp.
      </p>

      <button onClick={handleDownload} className="btn-descargar">
        Descargar catálogo PDF
      </button>

      {/* PREVIEW / CAPTURA */}
      <div
        className={`catalogo-oculto ${
          mostrarPreview ? "catalogo-preview" : "catalogo-hidden"
        }`}
      >
        <Catalogo />
      </div>
    </div>
  );
}



