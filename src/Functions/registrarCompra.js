import axios from "axios";

async function registrarCompra(datos, token) {
    const baseURL = import.meta.env.VITE_BACKEND_URL+`/api/compras/registrar`;
    console.log(JSON.stringify(datos))

    try {
        const response = await axios.post(baseURL, datos, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al registra Compra:', error);
        throw error;
    }
}

export default registrarCompra;