import axios from "axios";

async function obtenerCompras(token) {
    const baseURL = import.meta.env.VITE_BACKEND_URL + `/api/compras`;
    try {
        const response = await axios.get(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener las compras:', error);
        throw error;
    }
}

export default obtenerCompras;