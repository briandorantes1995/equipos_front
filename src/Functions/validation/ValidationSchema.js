import * as Yup from 'yup';

export const articuloSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    precio_venta: Yup.number().required("Requerido").min(0),
    costo: Yup.number().required("Requerido").min(0),
    categoria_id: Yup.string().required("Seleccione una categoría"),
});

export const compraSchema = Yup.object().shape({
    articulos: Yup.array().of(
        Yup.object().shape({
            articulo: Yup.string().required("Requerido"),
            cantidad: Yup.number().positive("Debe ser mayor a 0").required("Requerido"),
            precio_unitario: Yup.number().min(0, "No puede ser negativo").required("Requerido"),
        })
    ),
});