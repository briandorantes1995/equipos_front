import { Modal, Box, Typography, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import {cambiarEstadoSchema} from "../../Functions/validation/ValidationSchema.js";

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


function CambiarEstadoModal({ open, handleClose, articulo, onSubmit }) {
    if (!articulo) return null;

    const opciones = articulo.estado === "activo"
        ? [{ value: "inactivo", label: "Inactivar" }]
        : [{ value: "activo", label: "Activar" }];

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Cambiar estado de <strong>{articulo.nombre}</strong>
                </Typography>

                <Formik
                    initialValues={{ estado: opciones[0].value }}
                    validationSchema={cambiarEstadoSchema}
                    onSubmit={(values) => {
                        onSubmit(values.estado); // pasamos solo el estado
                        handleClose();
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div style={{ marginBottom: "16px" }}>
                                <Field
                                    name="estado"
                                    as={TextField}
                                    select
                                    fullWidth
                                    label="Estado"
                                >
                                    {opciones.map((op) => (
                                        <MenuItem key={op.value} value={op.value}>
                                            {op.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                                {errors.estado && touched.estado && (
                                    <div style={{ color: "red", fontSize: "0.9em" }}>{errors.estado}</div>
                                )}
                            </div>

                            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                <Button variant="contained" color="error" onClick={handleClose}>
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

export default CambiarEstadoModal;
