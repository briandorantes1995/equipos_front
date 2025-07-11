import axios from "axios";

async function editarArticulo(id, datos, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/articulos/actualizar/${id}`;

    try {
        const response = await axios.put(baseURL, datos, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al actualizar artículo:', error.response?.data || error.message);
        throw error;
    }
}

export default editarArticulo;
