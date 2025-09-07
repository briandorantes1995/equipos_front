import { Modal, Box, Typography, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Tipos de movimiento válidos
const TIPOS_MOVIMIENTO = [
    { value: "compra", label: "Compra" },
    { value: "venta", label: "Venta" },
    { value: "baja", label: "Baja" },
    { value: "robo", label: "Robo" },
    { value: "transferencia_entrada", label: "Transferencia Entrada" },
    { value: "transferencia_salida", label: "Transferencia Salida" },
];

const movimientoSchema = Yup.object().shape({
    cantidad: Yup.number()
        .typeError("Debe ser un número")
        .positive("Debe ser mayor a 0")
        .required("Cantidad requerida"),
    tipo_movimiento: Yup.string()
        .oneOf(TIPOS_MOVIMIENTO.map((t) => t.value), "Tipo de movimiento no válido")
        .required("Seleccione un tipo de movimiento"),
    motivo: Yup.string().max(255, "Máximo 255 caracteres"),
});

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

function AnadirMovimientoModal({ open, handleClose, articulo, onSubmit }) {
    if (!articulo) return null;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Añadir Movimiento para <strong>{articulo.nombre}</strong>
                </Typography>
                <Formik
                    initialValues={{
                        cantidad: "",
                        tipo_movimiento: "",
                        motivo: "",
                    }}
                    validationSchema={movimientoSchema}
                    onSubmit={(values) => {
                        onSubmit({ ...values, articulo_id: articulo.id });
                        handleClose();
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div style={{ marginBottom: "16px" }}>
                                <label htmlFor="cantidad">Cantidad</label>
                                <Field id="cantidad" name="cantidad" type="number" className="form-control" />
                                {errors.cantidad && touched.cantidad && (
                                    <div style={{ color: "red", fontSize: "0.9em" }}>{errors.cantidad}</div>
                                )}
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <Field
                                    name="tipo_movimiento"
                                    as={TextField}
                                    select
                                    fullWidth
                                    label="Tipo de Movimiento"
                                >
                                    {TIPOS_MOVIMIENTO.map((tipo) => (
                                        <MenuItem key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                                {errors.tipo_movimiento && touched.tipo_movimiento && (
                                    <div style={{ color: "red", fontSize: "0.9em" }}>{errors.tipo_movimiento}</div>
                                )}
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <Field
                                    name="motivo"
                                    as={TextField}
                                    label="Motivo"
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                                {errors.motivo && touched.motivo && (
                                    <div style={{ color: "red", fontSize: "0.9em" }}>{errors.motivo}</div>
                                )}
                            </div>

                            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                <Button variant="contained" color="secondary" onClick={handleClose}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Guardar
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}

export default AnadirMovimientoModal;


