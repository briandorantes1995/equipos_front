import { Modal, Box, Typography, Button } from "@mui/material";
import {movimientoSchema} from "../../Functions/validation/ValidationSchema.js";
import { Formik, Form, Field } from "formik";



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

function EditarMovimientoModal({ open, handleClose, movimiento, onSubmit }) {
    if (!movimiento) return null;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Editar Movimiento
                </Typography>
                <Formik
                    initialValues={{
                        cantidad: movimiento?.cantidad || "",
                    }}
                    validationSchema={movimientoSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        onSubmit({ ...movimiento, ...values, _action: "update" });
                        handleClose();
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div style={{ marginBottom: "16px" }}>
                                <label htmlFor="cantidad">Cantidad</label>
                                <Field
                                    id="cantidad"
                                    name="cantidad"
                                    type="number"
                                    className="form-control"
                                />
                                {errors.cantidad && touched.cantidad && (
                                    <div style={{ color: "red", fontSize: "0.9em" }}>{errors.cantidad}</div>
                                )}
                            </div>

                            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                <Button variant="contained" color="secondary" onClick={handleClose}>
                                    Cancelar
                                </Button>
                                {movimiento.tipo_movimiento !== "alta" && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            onSubmit({ ...movimiento, _action: "delete" });
                                            handleClose();
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                )}
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

export default EditarMovimientoModal;

