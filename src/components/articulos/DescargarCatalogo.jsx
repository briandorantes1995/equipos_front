import React from "react";
import html2pdf from "html2pdf.js";
import Catalogo from "./Catalogo.jsx";
import "./DescargarCatalogo.css";

export default function DescargarCatalogo() {
  const waitForImages = async (rootEl) => {
  const imgs = Array.from(rootEl.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((res) => {
        img.onload = () => res();
        img.onerror = () => res(); // no bloquear si falla una imagen
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

  await new Promise((r) => setTimeout(r, 700));
  await waitForImages(element);

  html2pdf()
    .set({
      margin: 10,
      filename: "catalogo_equipos_medicos.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
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

            {/* CATÁLOGO OCULTO (CLAVE) */}
            <div className="catalogo-oculto">
                <Catalogo />
            </div>
        </div>
    );
}


