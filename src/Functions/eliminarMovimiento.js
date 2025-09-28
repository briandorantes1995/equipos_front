import axios from "axios";

async function eliminarMovimiento(id, token) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/movimientos/eliminar`;

    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { id }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar movimiento:', error.response?.data || error.message);
        throw error;
    }
}

export default eliminarMovimiento;
