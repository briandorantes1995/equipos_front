import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import { Formik, Form, FieldArray } from "formik";
import { useSelector } from "react-redux";
import { useSnackbar } from "../../ui/snackBar/useSnackBar.js";
import { ventaSchema } from "../../Functions/validation/ValidationSchema.js";
import CustomInput from "../../Functions/validation/customInput.jsx";
import obtenerArticulos from "../../Functions/obtenerArticulos.js";
import registrarVenta from "../../Functions/registrarVenta.js";
import Select from "react-select";
import "./ventas.css";

function RegistrarVenta() {
    const [articulos, setArticulos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showSnackbar } = useSnackbar();
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await obtenerArticulos();
                setArticulos(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener artículos:", error);
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const onSubmit = async (values, actions) => {
        try {
            // Mapear detalle de articulos
            const detalle = values.articulos.map(({ articulo, cantidad, precio_unitario }) => ({
                articulo_id: Number(articulo.id),
                cantidad: Number(cantidad),
                precio_unitario: Number(precio_unitario),
            }));

            // Calcular total
            const total = detalle.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0);

            // Preparar pagos (ejemplo simple: un solo pago cubriendo el total)
            const pagos = [
                {
                    monto: total,
                    metodo_pago: values.pagoMetodo || "efectivo",
                },
            ];

            // Payload final
            const data = {
                cliente_nombre: values.cliente_nombre || null,
                cliente_razon_social: values.cliente_razon_social || null,
                cliente_direccion: values.cliente_direccion || null,
                cliente_telefono: values.cliente_telefono || null,
                cliente_correo: values.cliente_correo || null,
                requiere_factura: values.requiere_factura || false,
                articulos: detalle,
                pagos: pagos,
                notas: values.notas || "",
                total: total,
            };
            const response = await registrarVenta(data, token);
            actions.resetForm();
            showSnackbar({message: "Venta registrada con éxito", level: "success", vertical: "top", horizontal: "center",});

        } catch (error) {
            console.error("Error durante el envío:", error);
            actions.setSubmitting(false);
            showSnackbar({message: "Error al registrar venta", level: "error", vertical: "top", horizontal: "center",});
        }
    };



    if (isLoading) return <p>Cargando...</p>;

    return (
        <MDBContainer className="my-5 ventas-form">
            <MDBCard className="bg-cv">
                <MDBCardBody>
                    <h3 className="fw-bold my-4 pb-3">Registrar Venta</h3>
                    <Formik
                        initialValues={{
                            cliente_nombre: "",
                            cliente_razon_social: "",
                            cliente_direccion: "",
                            cliente_telefono: "",
                            cliente_correo: "",
                            requiere_factura: false,
                            articulos: [{ articulo: null, categoria: "", cantidad: "", precio_unitario: "" }],
                            pagos: [
                                {
                                    monto: "",
                                    metodo_pago: "efectivo"
                                }
                            ],
                            notas: "",
                        }}

                        validationSchema={ventaSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, setFieldValue, isSubmitting }) => (
                            <Form>
                                {/* Datos del cliente */}
                                <div className="row g-2 mb-3">
                                    <div className="col-md-4">
                                        <CustomInput
                                            label="Nombre cliente"
                                            name="cliente_nombre"
                                            placeholder="Nombre del cliente"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <CustomInput
                                            label="Razón social"
                                            name="cliente_razon_social"
                                            placeholder="Razón social (opcional)"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <CustomInput
                                            label="Correo"
                                            name="cliente_correo"
                                            placeholder="Correo del cliente"
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-3">
                                    <div className="col-md-6">
                                        <CustomInput
                                            label="Dirección"
                                            name="cliente_direccion"
                                            placeholder="Dirección"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <CustomInput
                                            label="Teléfono"
                                            name="cliente_telefono"
                                            placeholder="Teléfono"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="requiere_factura"
                                                checked={values.requiere_factura}
                                                onChange={(e) =>
                                                    setFieldValue("requiere_factura", e.target.checked)
                                                }
                                            />{" "}
                                            ¿Requiere factura?
                                        </label>
                                    </div>
                                </div>

                                {/* Detalle de artículos */}
                                <FieldArray name="articulos">
                                    {({ push, remove }) => (
                                        <>
                                            {values.articulos.map((item, index) => {
                                                const categoriasDisponibles = [
                                                    ...new Set(articulos.map((a) => a.categoria_nombre)),
                                                ];

                                                let articulosFiltrados = [...articulos];
                                                if (item.categoria) {
                                                    articulosFiltrados = articulosFiltrados.filter(
                                                        (a) => a.categoria_nombre === item.categoria
                                                    );
                                                }

                                                return (
                                                    <div key={index} className="row g-2 align-items-end mb-3">
                                                        {/* Selector de categoría */}
                                                        <div className="col-md-2">
                                                            <label>Categoría</label>
                                                            <select
                                                                value={item.categoria || ""}
                                                                onChange={(e) => {
                                                                    setFieldValue(`articulos[${index}].categoria`, e.target.value);
                                                                    setFieldValue(`articulos[${index}].articulo`, null);
                                                                }}
                                                                className="form-select"
                                                            >
                                                                <option value="">Todas</option>
                                                                {categoriasDisponibles.map((c, i) => (
                                                                    <option key={i} value={c}>{c}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Artículo con react-select */}
                                                        <div className="col-md-4">
                                                            <label>Artículo</label>
                                                            <Select
                                                                options={articulosFiltrados.map((a) => ({
                                                                    value: a,
                                                                    label: `${a.nombre} - $${a.precio_venta}`,
                                                                }))}
                                                                value={
                                                                    item.articulo
                                                                        ? { value: item.articulo, label: item.articulo.nombre }
                                                                        : null
                                                                }
                                                                onChange={(selected) => {
                                                                    setFieldValue(`articulos[${index}].articulo`, { ...selected.value });
                                                                    setFieldValue(
                                                                        `articulos[${index}].precio_unitario`,
                                                                        selected.value.precio_venta
                                                                    );
                                                                }}
                                                                placeholder="Seleccione un artículo"
                                                                isClearable
                                                            />
                                                        </div>

                                                        {/* Cantidad */}
                                                        <div className="col-md-2">
                                                            <CustomInput
                                                                label="Cantidad"
                                                                name={`articulos[${index}].cantidad`}
                                                                placeholder="Cantidad"
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <CustomInput
                                                                label="Precio Unitario"
                                                                name={`articulos[${index}].precio_unitario`}
                                                                placeholder="Precio"
                                                                value={item.articulo ? item.articulo.precio_venta : ""}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="col-md-1 d-flex flex-column justify-content-end">
                                                            <MDBBtn
                                                                color="dark"
                                                                onClick={() => remove(index)}
                                                                type="button"
                                                                style={{ width: "100%" }}
                                                            >
                                                                -
                                                            </MDBBtn>
                                                        </div>

                                                    </div>
                                                );
                                            })}

                                            <MDBBtn
                                                color="dark"
                                                type="button"
                                                onClick={() =>
                                                    push({
                                                        articulo: null,
                                                        categoria: "",
                                                        cantidad: "",
                                                        precio_unitario: "",
                                                    })
                                                }
                                            >
                                                + Agregar artículo
                                            </MDBBtn>
                                        </>
                                    )}
                                </FieldArray>
                                {/* Total y Pago */}
                                <div className="row g-2 mb-3 align-items-end">
                                    {/* Total */}
                                    <div className="col-md-3">
                                        <CustomInput
                                            label="Total"
                                            name="total"
                                            placeholder="Total"
                                            value={values.articulos.reduce((acc, item) => {
                                                const precio = item.precio_unitario ? Number(item.precio_unitario) : 0;
                                                const cantidad = item.cantidad ? Number(item.cantidad) : 0;
                                                return acc + precio * cantidad;
                                            }, 0)}
                                            readOnly
                                        />
                                    </div>

                                    {/* Monto a pagar */}
                                    <div className="col-md-3">
                                        <CustomInput
                                            label="Monto a Pagar"
                                            name="pagos[0].monto"
                                            value={values.pagos[0].monto}
                                            onChange={(e) => setFieldValue("pagos[0].monto", e.target.value)}
                                        />
                                    </div>

                                    {/* Tipo de pago */}
                                    <div className="col-md-3">
                                        <label>Tipo de Pago</label>
                                        <select
                                            className="form-select"
                                            value={values.pagos[0].metodo_pago}
                                            onChange={(e) => setFieldValue("pagos[0].metodo_pago", e.target.value)}
                                        >
                                            <option value="efectivo">Efectivo</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="tarjeta">Tarjeta</option>
                                        </select>
                                    </div>
                                </div>



                                {/* Notas */}
                                <div className="mt-4">
                                    <CustomInput
                                        label="Notas"
                                        name="notas"
                                        placeholder="Notas adicionales"
                                        as="textarea"
                                        style={{ width: "100%", minHeight: "80px" }}
                                    />
                                </div>

                                {/* Botón submit */}
                                <div className="mt-4">
                                    <MDBBtn color="dark" type="submit" disabled={isSubmitting}>
                                        Crear venta
                                    </MDBBtn>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}

export default RegistrarVenta;
