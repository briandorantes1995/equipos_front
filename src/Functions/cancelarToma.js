import axios from "axios";

async function cancelarToma(id, token) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/inventario/cancelar_tomas/${id}`;

    try {
        const response = await axios.delete(url, {
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

export default cancelarToma;