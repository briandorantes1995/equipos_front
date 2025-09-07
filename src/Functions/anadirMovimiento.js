import axios from "axios";

async function agregarMovimiento(datos, token) {
    const baseURL = import.meta.env.VITE_BACKEND_URL+`/api/movimientos/registrar`;

    try {
        const response = await axios.post(baseURL, datos, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al agregar artículo:', error);
        throw error;
    }
}

export default agregarMovimiento;