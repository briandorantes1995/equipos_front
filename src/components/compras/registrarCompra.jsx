import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import { Formik, Form, FieldArray } from "formik";
import CustomInput from "../../Functions/validation/customInput.jsx";
import CustomLista from "../../Functions/validation/customLista.jsx";
import obtenerArticulos from "../../Functions/obtenerArticulos.js";
import { compraSchema } from "../../Functions/validation/ValidationSchema.js";
import registrarCompra from "../../Functions/registrarCompra.js";
import { useSelector } from "react-redux";
import "./compras.css";

function RegistrarCompra() {
  const [articulos, setArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      const resultado = values.articulos.map(
        ({ articulo, cantidad, precio_unitario }) => ({
          articulo_id: Number(articulo),
          cantidad: Number(cantidad),
          precio_unitario: Number(precio_unitario),
        })
      );
      const data = {
        articulos: resultado,
        notas: values.notas,
      };
      const compra = await registrarCompra(data, token);
      if (compra) {
        actions.resetForm();
      }
    } catch (error) {
      console.error("Error durante el envío:", error);
      actions.setSubmitting(false);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <MDBContainer className="my-5 compras-form">
      <MDBCard className="bg-cv">
        <MDBCardBody>
          <h3 className="fw-bold my-4 pb-3">Agregar Compra</h3>
          <Formik
            initialValues={{
              articulos: [
                {
                  articulo: "",
                  categoria: "",
                  proveedor: "",
                  cantidad: "",
                  precio_unitario: "",
                },
              ],
              notas: "",
            }}
            validationSchema={compraSchema}
            onSubmit={onSubmit}
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

                        // Listado disponible de categorías y proveedores
                        const categoriasDisponibles = [
                          ...new Set(
                            articulos
                              .filter(
                                (a) =>
                                  !item.proveedor ||
                                  a.proveedor === item.proveedor
                              )
                              .map((a) => a.categoria_nombre)
                          ),
                        ];
                        const proveedoresDisponibles = [
                          ...new Set(
                            articulos
                              .filter(
                                (a) =>
                                  !item.categoria ||
                                  a.categoria_nombre === item.categoria
                              )
                              .map((a) => a.proveedor)
                          ),
                        ];

                        return (
                          <div
                            key={index}
                            className="row g-2 align-items-end mb-3"
                          >
                            {/* Artículo */}
                            <div className="col-md-3">
                              <CustomLista
                                label="Artículo"
                                name={`articulos[${index}].articulo`}
                                value={item.articulo}
                                onChange={(e) => {
                                  const selectedId = e.target.value;
                                  setFieldValue(
                                    `articulos[${index}].articulo`,
                                    selectedId
                                  );

                                  // Buscar el artículo elegido
                                  const articuloSeleccionado = articulos.find(
                                    (a) => a.id === Number(selectedId)
                                  );

                                  // Si existe, cargar su costo como valor por defecto
                                  if (articuloSeleccionado) {
                                    setFieldValue(
                                      `articulos[${index}].precio_unitario`,
                                      articuloSeleccionado.costo
                                    );
                                  }
                                }}
                              >
                                <option value="">Seleccione un artículo</option>
                                {articulosFiltrados.map((a) => (
                                  <option key={a.id} value={a.id}>
                                    {a.nombre}
                                  </option>
                                ))}
                              </CustomLista>
                            </div>

                            {/* Categoría */}
                            <div className="col-md-2">
                              <CustomLista
                                label="Categoría"
                                name={`articulos[${index}].categoria`}
                                value={item.categoria}
                                onChange={(e) =>
                                  setFieldValue(
                                    `articulos[${index}].categoria`,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Todos</option>
                                {categoriasDisponibles.map((c, idx) => (
                                  <option key={idx} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </CustomLista>
                            </div>

                            {/* Proveedor */}
                            <div className="col-md-2">
                              <CustomLista
                                label="Proveedor"
                                name={`articulos[${index}].proveedor`}
                                value={item.proveedor}
                                onChange={(e) =>
                                  setFieldValue(
                                    `articulos[${index}].proveedor`,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Todos</option>
                                {proveedoresDisponibles.map((p, idx) => (
                                  <option key={idx} value={p}>
                                    {p}
                                  </option>
                                ))}
                              </CustomLista>
                            </div>

                            {/* Cantidad */}
                            <div className="col-md-1">
                              <CustomInput
                                label="Cantidad"
                                name={`articulos[${index}].cantidad`}
                                placeholder="Cantidad"
                              />
                            </div>

                            {/* Precio */}
                            <div className="col-md-2">
                              <CustomInput
                                label="Precio Unitario"
                                name={`articulos[${index}].precio_unitario`}
                                placeholder={
                                  articulos.find(
                                    (a) => a.id === Number(item.articulo)
                                  )?.costo || "Precio"
                                }
                              />
                            </div>

                            {/* Boton eliminar */}
                            <div className="col-md-1 d-flex align-items-end">
                              <MDBBtn
                                color="danger"
                                onClick={() => remove(index)}
                                type="button"
                              >
                                -
                              </MDBBtn>
                            </div>
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





















