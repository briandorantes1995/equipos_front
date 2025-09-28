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


export const ventaSchema = Yup.object().shape({
    cliente_nombre: Yup.string().max(100, "Máximo 100 caracteres").nullable(),
    cliente_razon_social: Yup.string().max(150, "Máximo 150 caracteres").nullable(),
    cliente_direccion: Yup.string().max(250, "Máximo 250 caracteres").nullable(),
    cliente_telefono: Yup.string().matches(/^\+?[0-9\s\-]*$/, "Teléfono inválido").nullable(),
    cliente_correo: Yup.string().email("Correo inválido").nullable(),
    requiere_factura: Yup.boolean(),

    articulos: Yup.array()
        .of(
            Yup.object().shape({
                articulo: Yup.object()
                    .nullable()
                    .required("Seleccione un artículo"),
                cantidad: Yup.number()
                    .typeError("Cantidad debe ser un número")
                    .positive("Cantidad debe ser mayor a 0")
                    .required("Cantidad requerida"),
            })
        )
        .min(1, "Debe agregar al menos un artículo"),

    notas: Yup.string().max(500, "Máximo 500 caracteres").nullable(),
});