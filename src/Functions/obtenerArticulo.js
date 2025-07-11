import axios from "axios";

async function obtenerArticulo(id) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/articulos/${id}`;

    try {
        const response = await axios.get(baseURL);
        return response.data;
    } catch (error) {
        console.error('No se pudo obtener el artículo:', error);
        throw error;
    }
}

export default obtenerArticulo;