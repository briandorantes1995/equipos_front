import axios from "axios";

async function cambiarEstadoArticulo(articuloId, estado, token) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/articulos/estado/`;
    try {
        const response = await axios.patch(url, { articulo_id: articuloId, estado }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        throw error;
    }
}

export default cambiarEstadoArticulo;