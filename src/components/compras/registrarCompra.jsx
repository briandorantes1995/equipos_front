import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import { Formik, Form, FieldArray } from "formik";
import CustomInput from "../../Functions/validation/customInput.jsx";
import CustomLista from "../../Functions/validation/customLista.jsx";
import obtenerArticulos from "../../Functions/obtenerArticulos.js";
import { compraSchema } from "../../Functions/validation/ValidationSchema.js";
import registrarCompra from "../../Functions/registrarCompra.js";
import {useSelector} from "react-redux";


function RegistrarCompra() {
    const [articulos, setArticulos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = useSelector(state => state.user.token);

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

    const onSubmit = async (values,actions) => {
        try{
            const resultado = values.articulos.map(({ articulo, cantidad, precio_unitario }) => ({
                articulo_id: Number(articulo),
                cantidad:Number(cantidad),
                precio_unitario:Number(precio_unitario),
            }));
            const data = {
                articulos: resultado,
                notas: values.notas
            };
            console.log("Formulario enviado:", data);
            const compra = await registrarCompra(data,token);
            if (compra){
                actions.resetForm();
            }
        }catch(error){
            console.error('Error durante el envío:', error);
            actions.setSubmitting(false);
        }
    };

    if (isLoading) return <p>Cargando...</p>;

    return (
        <MDBContainer className="my-5">
            <MDBCard className="bg-cv">
                <MDBCardBody>
                    <h3 className="fw-bold my-4 pb-3">Agregar Compra</h3>
                    <Formik
                        initialValues={{
                            articulos: [
                                { articulo: "", categoria: "", proveedor: "", cantidad: "", precio_unitario: "" },
                            ],
                            notas: ""
                        }}
                        validationSchema={compraSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, setFieldValue, isSubmitting }) => (
                            <Form>
                                <FieldArray name="articulos">
                                    {({push, remove}) => (
                                        <>
                                            {values.articulos.map((item, index) => {
                                                let articulosFiltrados = [...articulos];
                                                if (item.categoria) {
                                                    articulosFiltrados = articulosFiltrados.filter(a => a.categoria_nombre === item.categoria);
                                                }
                                                if (item.proveedor) {
                                                    articulosFiltrados = articulosFiltrados.filter(a => a.proveedor === item.proveedor);
                                                }

                                                // Listado disponible de categorías y proveedores
                                                const categoriasDisponibles = [
                                                    ...new Set(
                                                        articulos
                                                            .filter(a => !item.proveedor || a.proveedor === item.proveedor)
                                                            .map(a => a.categoria_nombre)
                                                    )
                                                ];
                                                const proveedoresDisponibles = [
                                                    ...new Set(
                                                        articulos
                                                            .filter(a => !item.categoria || a.categoria_nombre === item.categoria)
                                                            .map(a => a.proveedor)
                                                    )
                                                ];

                                                return (
                                                    <div key={index} className="d-flex align-items-end mb-3"
                                                         style={{gap: "10px"}}>
                                                        {/* Artículo */}
                                                        <CustomLista
                                                            label="Artículo"
                                                            name={`articulos[${index}].articulo`}
                                                            value={item.articulo}
                                                            onChange={e => setFieldValue(`articulos[${index}].articulo`, e.target.value)}
                                                            style={{width: "200px"}}
                                                        >
                                                            <option value="">Seleccione un artículo</option>
                                                            {articulosFiltrados.map(a => (
                                                                <option key={a.id} value={a.id}>{a.nombre}</option>
                                                            ))}
                                                        </CustomLista>

                                                        {/* Categoría */}
                                                        <CustomLista
                                                            label="Categoría"
                                                            name={`articulos[${index}].categoria`}
                                                            value={item.categoria}
                                                            onChange={e => setFieldValue(`articulos[${index}].categoria`, e.target.value)}
                                                            style={{width: "150px"}}
                                                        >
                                                            <option value="">Todos</option>
                                                            {categoriasDisponibles.map((c, idx) => (
                                                                <option key={idx} value={c}>{c}</option>
                                                            ))}
                                                        </CustomLista>

                                                        {/* Proveedor */}
                                                        <CustomLista
                                                            label="Proveedor"
                                                            name={`articulos[${index}].proveedor`}
                                                            value={item.proveedor}
                                                            onChange={e => setFieldValue(`articulos[${index}].proveedor`, e.target.value)}
                                                            style={{width: "150px"}}
                                                        >
                                                            <option value="">Todos</option>
                                                            {proveedoresDisponibles.map((p, idx) => (
                                                                <option key={idx} value={p}>{p}</option>
                                                            ))}
                                                        </CustomLista>

                                                        {/* Cantidad y Precio */}
                                                        <CustomInput
                                                            label="Cantidad"
                                                            name={`articulos[${index}].cantidad`}
                                                            placeholder="Cantidad"
                                                            style={{width: "100px"}}
                                                        />
                                                        <CustomInput
                                                            label="Precio Unitario"
                                                            name={`articulos[${index}].precio_unitario`}
                                                            placeholder="Precio"
                                                            style={{width: "100px"}}
                                                        />
                                                        <MDBBtn color="danger" onClick={() => remove(index)}
                                                                type="button">-</MDBBtn>
                                                    </div>
                                                );
                                            })}

                                            <MDBBtn
                                                color="success"
                                                type="button"
                                                onClick={() => push({
                                                    articulo: "",
                                                    categoria: "",
                                                    proveedor: "",
                                                    cantidad: "",
                                                    precio_unitario: ""
                                                })}
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
                                        as="textarea"   // <-- si tu CustomInput lo soporta
                                        style={{width: "100%", minHeight: "80px"}}
                                    />
                                </div>

                                <div className="mt-4">
                                    <MDBBtn color="dark" type="submit" disabled={isSubmitting}>
                                        Crear compra
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

export default RegistrarCompra;




















