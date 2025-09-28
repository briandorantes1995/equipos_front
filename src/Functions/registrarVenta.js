import axios from "axios";

async function registrarVenta(datos, token) {
    const baseURL = import.meta.env.VITE_BACKEND_URL + `/api/ventas/registrar`;
    try {
        const response = await axios.post(baseURL, datos, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al registrar Venta:', error);
        throw error;
    }
}

export default registrarVenta;

