import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import { Formik, Form, FieldArray } from "formik";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "../../ui/snackBar/useSnackBar.js";
import { ventaSchema } from "../../Functions/validation/ValidationSchema.js";
import CustomInput from "../../Functions/validation/customInput.jsx";
import obtenerArticulos from "../../Functions/obtenerArticulos.js";
import editarVenta from "../../Functions/editarVenta.js";
import Select from "react-select";
import "./ventas.css";


function EditarVenta() {
    const { ventaId } = useParams();
    const [articulos, setArticulos] = useState([]);
    const [initialValues, setInitialValues] = useState(null);
    const { showSnackbar } = useSnackbar();
    const token = useSelector((state) => state.user.token);
    const location = useLocation();
    const venta = location.state?.venta;
    const navigate = useNavigate();



    useEffect(() => {
        async function fetchArticulos() {
            try {
                const articulosData = await obtenerArticulos();
                setArticulos(articulosData);

                if (venta) {
                    const formattedInitialValues = {
                        cliente_nombre: venta.cliente_nombre || "",
                        cliente_razon_social: venta.cliente_razon_social || "",
                        cliente_direccion: venta.cliente_direccion || "",
                        cliente_telefono: venta.cliente_telefono || "",
                        cliente_correo: venta.cliente_correo || "",
                        requiere_factura: venta.requiere_factura || false,
                        notas: venta.notas || "",
                        articulos: venta.detalles.map(d => {
                            const articuloCompleto = articulosData.find(a => a.nombre === d.articulo_nombre);
                            return {
                                articulo: articuloCompleto || null,
                                categoria: articuloCompleto ? articuloCompleto.categoria_nombre : "",
                                cantidad: d.cantidad || "",
                                precio_unitario: d.precio_unitario || ""
                            };
                        }),
                        monto_pagado: venta.monto_pagado || 0,
                    };
                    setInitialValues(formattedInitialValues);
                }
            } catch (error) {
                console.error("Error al obtener artículos:", error);
                showSnackbar({ message: "Error al cargar los artículos", level: "error" });
            }
        }
        fetchArticulos();
    }, [venta, showSnackbar]);

    const onSubmit = async (values, actions) => {
        try {
            const detalle = values.articulos.map(({ articulo, cantidad, precio_unitario }) => ({
                articulo_id: Number(articulo.id),
                cantidad: Number(cantidad),
                precio_unitario: Number(precio_unitario),
            }));

            const total = detalle.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0);

            const data = {
                cliente_nombre: values.cliente_nombre || null,
                cliente_razon_social: values.cliente_razon_social || null,
                cliente_direccion: values.cliente_direccion || null,
                cliente_telefono: values.cliente_telefono || null,
                cliente_correo: values.cliente_correo || null,
                requiere_factura: values.requiere_factura || false,
                articulos: detalle,
                notas: values.notas || "",
                total: total,
            };
            console.log(data);

            await editarVenta(Number(ventaId), data, token);
            actions.setSubmitting(false);
            showSnackbar({ message: "Venta actualizada con éxito", level: "success", vertical: "top", horizontal: "center" });
            navigate(`/ventas/${ventaId}`);

        } catch (error) {
            console.error("Error durante el envío:", error);
            showSnackbar({ message: "Error al actualizar la venta", level: "error", vertical: "top", horizontal: "center" });
        } finally {
            actions.setSubmitting(false);
        }
    };

    if (!initialValues) return <p>Cargando datos de la venta...</p>;

    return (
        <MDBContainer className="my-5 ventas-form">
            <MDBCard className="bg-cv">
                <MDBCardBody>
                    <h3 className="fw-bold my-4 pb-3">Editar Venta</h3>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={ventaSchema}
                        onSubmit={onSubmit}
                        enableReinitialize
                    >
                        {({ values, setFieldValue, isSubmitting }) => (
                            <Form>
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

                                                        <div className="col-md-4">
                                                            <label>Artículo</label>
                                                            <Select
                                                                options={articulosFiltrados.map((a) => ({
                                                                    value: a,
                                                                    label: `${a.nombre} - $${a.precio_venta}`,
                                                                }))}
                                                                value={
                                                                    item.articulo
                                                                        ? { value: item.articulo, label: `${item.articulo.nombre} - $${item.articulo.precio_venta}` }
                                                                        : null
                                                                }
                                                                onChange={(selected) => {
                                                                    setFieldValue(`articulos[${index}].articulo`, selected ? selected.value : null);
                                                                    setFieldValue(
                                                                        `articulos[${index}].precio_unitario`,
                                                                        selected ? selected.value.precio_venta : ""
                                                                    );
                                                                }}
                                                                placeholder="Seleccione un artículo"
                                                                isClearable
                                                            />
                                                        </div>

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
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="col-md-1 d-flex flex-column justify-content-end">
                                                            <MDBBtn
                                                                color="danger"
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

                                <div className="row g-2 my-3 align-items-end">
                                    <div className="col-md-3">
                                        <CustomInput
                                            label="Monto Pagado"
                                            name="monto_pagado"
                                            value={values.monto_pagado.toFixed(2)}
                                            readOnly
                                        />
                                    </div>
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
                                </div>

                                <div className="mt-4">
                                    <CustomInput
                                        label="Notas"
                                        name="notas"
                                        placeholder="Notas adicionales"
                                        as="textarea"
                                        style={{width: "100%", minHeight: "80px"}}
                                    />
                                </div>

                                <div className="mt-4">
                                    <MDBBtn color="dark" type="submit" disabled={isSubmitting}>
                                        Actualizar Venta
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

export default EditarVenta;
