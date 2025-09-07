import axios from "axios";

async function editarMovimiento(datos, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/movimientos/editar`;

    try {
        const response = await axios.put(baseURL, datos, {
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

export default editarMovimiento;