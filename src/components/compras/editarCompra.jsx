import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import { Formik, Form, FieldArray } from "formik";
import CustomInput from "../../Functions/validation/customInput.jsx";
import CustomLista from "../../Functions/validation/customLista.jsx";
import obtenerArticulos from "../../Functions/obtenerArticulos.js";
import obtenerCompra from "../../Functions/obtenerCompra.js";
import { compraSchema } from "../../Functions/validation/ValidationSchema.js";
import editarCompra from "../../Functions/editarCompra.js";
import { useSelector } from "react-redux";
import {useSnackbar} from "../../ui/snackBar/useSnackBar.js";


function EditarCompraFormulario() {
    const { compraId } = useParams();
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();
    const [articulos, setArticulos] = useState([]);
    const [compraExistente, setCompraExistente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showSnackbar } = useSnackbar();

    // Obtener lista de artículos
    useEffect(() => {
        async function fetchArticulos() {
            try {
                const data = await obtenerArticulos();
                setArticulos(data);
            } catch (error) {
                console.error("Error al obtener artículos:", error);
            }
        }
        fetchArticulos();
    }, []);

    // Obtener detalles de la compra
    useEffect(() => {
        async function fetchCompra() {
            try {
                const data = await obtenerCompra(compraId, token);
                if (data.length > 0) {
                    const compra = {
                        compra_id: data[0].compra_id,
                        fecha: data[0].fecha,
                        notas: data[0].notas,
                        detalles: data.map(d => ({
                            detalle_id: d.detalle_id,
                            articulo_id: d.articulo_id,
                            articulo_nombre: d.articulo_nombre,
                            articulo_proveedor: d.articulo_proveedor,
                            cantidad: d.cantidad,
                            precio_unitario: d.precio_unitario,
                            subtotal: d.subtotal
                        }))
                    };
                    setCompraExistente(compra);
                }
            } catch (error) {
                console.error("Error al obtener la compra:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCompra();
    }, [compraId, token]);

    const onSubmit = async (values, actions) => {
        try {
            const resultado = values.articulos.map(({ articulo, cantidad, precio_unitario }) => ({
                articulo_id: Number(articulo),
                cantidad: Number(cantidad),
                precio_unitario: Number(precio_unitario),
            }));

            const data = {
                articulos: resultado,
                notas: values.notas,
            };

            await editarCompra(values.compra_id, data, token);
            actions.setSubmitting(false);
            showSnackbar({
                message:"Compra actualizada con éxito",
                level: "success",
                vertical: "top",
                horizontal: "center",
            });
            navigate(`/compras/${values.compra_id}`);
        } catch (error) {
            console.error("Error al editar la compra:", error);
            actions.setSubmitting(false);
            showSnackbar({
                message: "Error al editar la compra",
                level: "error",
                vertical: "top",
                horizontal: "center",
            });
        }
    };

    if (isLoading || !compraExistente) return <p>Cargando compra...</p>;

    return (
        <MDBContainer className="my-5 compras-form">
            <MDBCard className="bg-cv">
                <MDBCardBody>
                    <h3 className="fw-bold my-4 pb-3">Editar Compra</h3>

                    <Formik
                        initialValues={{
                            compra_id: compraExistente.compra_id,
                            articulos: compraExistente.detalles.map((d) => ({
                                articulo: d.articulo_id || "",
                                categoria: "",
                                proveedor: d.articulo_proveedor || "",
                                cantidad: d.cantidad,
                                precio_unitario: d.precio_unitario,
                            })),
                            notas: compraExistente.notas || "",
                        }}
                        validationSchema={compraSchema}
                        onSubmit={onSubmit}
                        enableReinitialize
                    >
                        {({ values, setFieldValue, isSubmitting }) => (
                            <Form>
                                <FieldArray name="articulos">
                                    {({ push, remove }) => (
                                        <>
                                            {values.articulos.map((item, index) => {
                                                let articulosFiltrados = [...articulos];
                                                if (item.categoria) {
                                                    articulosFiltrados = articulosFiltrados.filter(
                                                        (a) => a.categoria_nombre === item.categoria
                                                    );
                                                }
                                                if (item.proveedor) {
                                                    articulosFiltrados = articulosFiltrados.filter(
                                                        (a) => a.proveedor === item.proveedor
                                                    );
                                                }

                                                const categoriasDisponibles = [
                                                    ...new Set(
                                                        articulos
                                                            .filter((a) => !item.proveedor || a.proveedor === item.proveedor)
                                                            .map((a) => a.categoria_nombre)
                                                    ),
                                                ];
                                                const proveedoresDisponibles = [
                                                    ...new Set(
                                                        articulos
                                                            .filter((a) => !item.categoria || a.categoria_nombre === item.categoria)
                                                            .map((a) => a.proveedor)
                                                    ),
                                                ];

                                                return (
                                                    <div
                                                        key={index}
                                                        className="d-flex align-items-end mb-3"
                                                        style={{ gap: "10px" }}
                                                    >
                                                        <CustomLista
                                                            label="Artículo"
                                                            name={`articulos[${index}].articulo`}
                                                            value={item.articulo}
                                                            onChange={(e) =>
                                                                setFieldValue(`articulos[${index}].articulo`, e.target.value)
                                                            }
                                                            style={{ width: "200px" }}
                                                        >
                                                            <option value="">Seleccione un artículo</option>
                                                            {articulosFiltrados.map((a) => (
                                                                <option key={a.id} value={a.id}>
                                                                    {a.nombre}
                                                                </option>
                                                            ))}
                                                        </CustomLista>

                                                        <CustomLista
                                                            label="Categoría"
                                                            name={`articulos[${index}].categoria`}
                                                            value={item.categoria}
                                                            onChange={(e) =>
                                                                setFieldValue(`articulos[${index}].categoria`, e.target.value)
                                                            }
                                                            style={{ width: "150px" }}
                                                        >
                                                            <option value="">Todos</option>
                                                            {categoriasDisponibles.map((c, idx) => (
                                                                <option key={idx} value={c}>
                                                                    {c}
                                                                </option>
                                                            ))}
                                                        </CustomLista>

                                                        <CustomLista
                                                            label="Proveedor"
                                                            name={`articulos[${index}].proveedor`}
                                                            value={item.proveedor}
                                                            onChange={(e) =>
                                                                setFieldValue(`articulos[${index}].proveedor`, e.target.value)
                                                            }
                                                            style={{ width: "150px" }}
                                                        >
                                                            <option value="">Todos</option>
                                                            {proveedoresDisponibles.map((p, idx) => (
                                                                <option key={idx} value={p}>
                                                                    {p}
                                                                </option>
                                                            ))}
                                                        </CustomLista>

                                                        <CustomInput
                                                            label="Cantidad"
                                                            name={`articulos[${index}].cantidad`}
                                                            placeholder="Cantidad"
                                                            style={{ width: "100px" }}
                                                        />
                                                        <CustomInput
                                                            label="Precio Unitario"
                                                            name={`articulos[${index}].precio_unitario`}
                                                            placeholder="Precio"
                                                            style={{ width: "100px" }}
                                                        />
                                                        <MDBBtn color="danger" onClick={() => remove(index)} type="button">
                                                            -
                                                        </MDBBtn>
                                                    </div>
                                                );
                                            })}

                                            <MDBBtn
                                                color="success"
                                                type="button"
                                                onClick={() =>
                                                    push({
                                                        articulo: "",
                                                        categoria: "",
                                                        proveedor: "",
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

                                <div className="mt-4">
                                    <CustomInput
                                        label="Notas"
                                        name="notas"
                                        placeholder="Escribe notas adicionales sobre la compra"
                                        as="textarea"
                                        style={{ width: "100%", minHeight: "80px" }}
                                    />
                                </div>

                                <div className="mt-4">
                                    <MDBBtn color="dark" type="submit" disabled={isSubmitting}>
                                        Guardar cambios
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

export default EditarCompraFormulario;


