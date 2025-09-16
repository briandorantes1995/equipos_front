import { Modal, Box, Typography, Button,TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import {categoriaSchema} from "../../Functions/validation/ValidationSchema.js";


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

function AnadirCategoriaModal({ open, handleClose, categoria, onSubmit }) {
    const initialValues = {
        nombre: categoria?.nombre || "",
        descripcion: categoria?.descripcion || "",
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    {categoria ? `Edición de ${categoria.nombre}` : "Añadir nueva categoría"}
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={categoriaSchema}
                    onSubmit={(values) => {
                        const payload = categoria ? { ...values, id: categoria.id } : values;
                        onSubmit(payload);
                        handleClose();
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div style={{ marginBottom: "16px" }}>
                                <label htmlFor="nombre">Nombre</label>
                                <Field
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    className="form-control"
                                />
                                {errors.nombre && touched.nombre && (
                                    <div style={{ color: "red", fontSize: "0.9em" }}>
                                        {errors.nombre}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <Field
                                    name="descripcion"
                                    as={TextField}
                                    label="Descripcion"
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                                {errors.descripcion && touched.descripcion && (
                                    <div style={{ color: "red", fontSize: "0.9em" }}>
                                        {errors.descripcion}
                                    </div>
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


export default AnadirCategoriaModal;