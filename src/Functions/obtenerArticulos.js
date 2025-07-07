import axios from "axios";


async function obtenerArticulos(){
    const baseURL = import.meta.env.VITE_BACKEND_URL+`/api/articulos`;
    try{
        const response = await axios.get(baseURL, {
        });
        return response.data;

    }catch(error){
        console.log('No se obtuvieron las articulos:', error);
    }

}

export default obtenerArticulos;