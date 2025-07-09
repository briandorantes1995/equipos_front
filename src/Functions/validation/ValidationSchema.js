import * as Yup from 'yup';

export const articuloSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    precio_venta: Yup.number().required("Requerido").min(0),
    costo: Yup.number().required("Requerido").min(0),
    categoria_id: Yup.string().required("Seleccione una categoría"),
});