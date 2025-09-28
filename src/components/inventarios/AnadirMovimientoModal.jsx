import { Modal, Box, Typography, Button, MenuItem, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import {anadirmovimientoSchema,TIPOS_MOVIMIENTO} from "../../Functions/validation/ValidationSchema.js";


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
                    validationSchema={anadirmovimientoSchema}
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

export default AnadirMovimientoModal;


