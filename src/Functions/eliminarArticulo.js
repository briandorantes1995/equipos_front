import axios from "axios";

async function eliminarArticulo(id, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/articulos/eliminar/${id}`;

    try {
        const response = await axios.delete(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar artículo:', error.response?.data || error.message);
        throw error;
    }
}

export default eliminarArticulo;
