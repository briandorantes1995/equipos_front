import { supabase } from './supabaseClient';
import cambiarEstadoArticulo from './cambiarEstadoArticulo';

async function inactivarArticulo(articulo, estado, token) {
    try {
        // Borrar imagen solo si se está inactivando
        if (estado === "inactivo" && articulo.imagen) {
            const path = articulo.imagen.split('/storage/v1/object/public/fotosarticulos/')[1];
            if (path) {
                const { error } = await supabase.storage
                    .from('fotosarticulos')
                    .remove([path]);
                if (error) console.error('Error al borrar imagen:', error);
            }
        }

        // Actualizar estado en la base de datos
        return await cambiarEstadoArticulo(articulo.id, estado, token);
    } catch (error) {
        console.error('Error al cambiar estado del artículo:', error);
        throw error;
    }
}

export default inactivarArticulo;

