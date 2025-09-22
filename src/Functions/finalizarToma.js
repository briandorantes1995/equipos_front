import axios from "axios";

async function finalizarToma(detalles, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/inventario/finalizar_tomas`;

    try {
        const response = await axios.put(baseURL, detalles, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al finalizar la toma', error.response?.data || error.message);
        throw error;
    }
}

export default finalizarToma;