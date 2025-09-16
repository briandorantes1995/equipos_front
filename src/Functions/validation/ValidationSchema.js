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

export const movimientoSchema = Yup.object().shape({
    cantidad: Yup.number()
        .typeError("Debe ser un número")
        .positive("Debe ser mayor a 0")
        .required("Cantidad requerida"),
});

export const TIPOS_MOVIMIENTO = [
    { value: "baja", label: "Baja" },
    { value: "robo", label: "Robo" },
    { value: "transferencia_entrada", label: "Transferencia Entrada" },
    { value: "transferencia_salida", label: "Transferencia Salida" },
];

export const anadirmovimientoSchema = Yup.object().shape({
    cantidad: Yup.number()
        .typeError("Debe ser un número")
        .positive("Debe ser mayor a 0")
        .required("Cantidad requerida"),
    tipo_movimiento: Yup.string()
        .oneOf(TIPOS_MOVIMIENTO.map((t) => t.value), "Tipo de movimiento no válido")
        .required("Seleccione un tipo de movimiento"),
    motivo: Yup.string().max(255, "Máximo 255 caracteres"),
});


export const categoriaSchema = Yup.object().shape({
    nombre: Yup.string().required("Requerido"),
    descripcion: Yup.string().required("Requerido"),
});