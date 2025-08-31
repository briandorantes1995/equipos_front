import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { articuloSchema } from '../../functions/validation/validationSchema';
import CustomInput from '../../functions/validation/customInput';
import CustomTextArea from '../../functions/validation/customTextArea';
import CustomLista from '../../functions/validation/customLista';
import agregarArticulo from '../../Functions/agregarArticulo';
import obtenerCategorias from '../../functions/obtenerCategorias';
import { supabase } from '../../functions/supabaseClient';
import { useSelector } from 'react-redux';
import './Articulos.css';

function CrearArticulo() {
    const [categorias, setCategorias] = useState([]);
    const [imagen, setImagen] = useState(null);
    const navigate = useNavigate();
    const token = useSelector(state => state.user.token);
    const user = useSelector(state => state.user.user);

    useEffect(() => {
        async function fetchCategorias() {
            try {
                const data = await obtenerCategorias();
                setCategorias(data);
            } catch (error) {
                console.error('Error al obtener categorías:', error);
            }
        }
        fetchCategorias();
    }, []);

    const onSubmit = async (values, actions) => {
        try {
            let urlImagen = null;

            if (imagen && imagen instanceof File) {
                const nombreArchivo = `public/${Date.now()}-${imagen.name}`;
                const { error } = await supabase.storage
                    .from('fotosarticulos')
                    .upload(nombreArchivo, imagen, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error('Error al subir imagen:', error);
                    throw error;
                }

                const { data: publicData } = supabase.storage
                    .from('fotosarticulos')
                    .getPublicUrl(nombreArchivo);

                urlImagen = publicData.publicUrl;
            }

            const articulo = await agregarArticulo(
                { ...values, imagen: urlImagen,name: user.name },
                token // ← token va como segundo parámetro
            );

            if (articulo) {
                navigate('/articulos');
            }

            actions.resetForm();
            setImagen(null);
        } catch (error) {
            console.error('Error durante el envío:', error);
            actions.setSubmitting(false);
        }
    };

    return (
        <MDBContainer className="my-5">
            <MDBCard className="bg-cv">
                <MDBCardBody className="d-flex flex-column">
                    <h3 className="fw-bold my-4 pb-3">Agregar nuevo artículo</h3>
                    <Formik
                        initialValues={{
                            nombre: "",
                            descripcion: "",
                            precio_venta: "",
                            costo: "",
                            inventario: "",
                            codigo_barras: "",
                            sku: "",
                            categoria_id: "",
                            proveedor: ""
                        }}
                        validationSchema={articuloSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-4">
                                    <label htmlFor="imagen">Imagen del artículo</label>
                                    <input
                                        id="imagen"
                                        name="imagen"
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={(e) => setImagen(e.target.files[0])}
                                    />
                                </div>

                                <CustomInput label="Nombre" name="nombre" placeholder="Nombre del artículo" />
                                <CustomTextArea label="Descripción" name="descripcion" placeholder="Descripción" />
                                <CustomInput label="Precio de Venta" name="precio_venta" type="number" placeholder="0.00" />
                                <CustomInput label="Costo" name="costo" type="number" placeholder="0.00" />
                                <CustomInput label="Inventario Inicial" name="inventario" type="number" placeholder="0" />
                                <CustomInput label="Código de Barras" name="codigo_barras" placeholder="Código de barras" />
                                <CustomInput label="SKU" name="sku" placeholder="SKU del artículo" />

                                <CustomLista label="Categoría" name="categoria_id">
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </CustomLista>

                                <CustomInput label="Proveedor" name="proveedor" placeholder="Proveedor del artículo" />

                                <MDBBtn className="mb-4 px-5" color="dark" size="lg" disabled={isSubmitting} type="submit">
                                    Crear artículo
                                </MDBBtn>
                            </Form>
                        )}
                    </Formik>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}

export default CrearArticulo;



