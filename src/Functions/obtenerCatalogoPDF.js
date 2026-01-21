import axios from "axios";

export async function obtenerCatalogoPDF() {
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/articulos/catalogo-pdf`;

  const response = await axios.get(url, {
    responseType: "blob", // 🔑 CLAVE
  });

  return response.data; // Blob PDF
}
