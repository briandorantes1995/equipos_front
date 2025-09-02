import axios from "axios";

async function obtenerMovimientos(token) {
    const baseURL = import.meta.env.VITE_BACKEND_URL + `/api/movimientos`; // endpoint de inventario
    try {
        const response = await axios.get(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener los movimientos actuales:', error);
        throw error;
    }
}

export default obtenerMovimientos;