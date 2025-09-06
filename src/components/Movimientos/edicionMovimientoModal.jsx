import {FormControl, InputLabel, MenuItem, Modal, Select} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const movimientoSchema = Yup.object().shape({
    cantidad: Yup.number()
        .typeError("Debe ser un número")
        .positive("Debe ser mayor a 0")
        .required("Cantidad requerida"),
    motivo: Yup.string()
        .max(255, "Máximo 255 caracteres")
        .required("Motivo requerido"),
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

const motivos = [
    "alta",
    "compra",
    "transferencia_entrada",
    "venta",
    "baja",
    "robo",
    "transferencia_salida",
    "ajuste inventario"
];

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
                        motivo: movimiento?.motivo || ""   // valor original
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
                            {/* Cantidad */}
                            <div style={{ marginBottom: "16px" }}>
                                <label htmlFor="cantidad">Cantidad</label>
                                <Field id="cantidad" name="cantidad" type="number" className="form-control" />
                            </div>

                            {/* Motivo */}
                            <div style={{ marginBottom: "16px" }}>
                                <InputLabel id="motivo-label">Motivo</InputLabel>
                                <FormControl fullWidth>
                                    <Field
                                        name="motivo"
                                        as={Select}
                                        labelId="motivo-label"
                                        id="motivo"
                                        displayEmpty
                                    >
                                        {motivos.map((motivo) => (
                                            <MenuItem key={motivo} value={motivo}>
                                                {motivo}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    {errors.motivo && touched.motivo && (
                                        <div style={{ color: "red", fontSize: "0.9em" }}>{errors.motivo}</div>
                                    )}
                                </FormControl>
                            </div>

                            {/* Botones */}
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                <Button variant="contained" color="secondary" onClick={handleClose}>
                                    Cancelar
                                </Button>
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

