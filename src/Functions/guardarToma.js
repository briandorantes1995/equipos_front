import axios from "axios";

async function guardarToma(detalles, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/inventario/guardar_tomas`;

    try {
        const response = await axios.put(baseURL, detalles, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al actualizar movimiento', error.response?.data || error.message);
        throw error;
    }
}

export default guardarToma;