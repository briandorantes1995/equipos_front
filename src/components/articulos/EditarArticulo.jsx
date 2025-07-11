import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { articuloSchema } from '../../functions/validation/validationSchema';
import CustomInput from '../../functions/validation/customInput';
import CustomTextArea from '../../functions/validation/customTextArea';
import CustomLista from '../../functions/validation/customLista';
import obtenerCategorias from '../../functions/obtenerCategorias';
import obtenerArticulo from '../../functions/obtenerArticulo';
import editarArticulo from '../../functions/editarArticulo';
import { supabase } from '../../functions/supabaseClient';
import { useSelector } from 'react-redux';
import './Articulos.css';

function EditarArticulo() {
    const [categorias, setCategorias] = useState([]);
    const [mostrarArticulo, setMostrarArticulo] = useState(null);
    const [imagen, setImagen] = useState(null);
    const navigate = useNavigate();
    const { articuloId } = useParams();
    const token = useSelector(state => state.user.token);

    useEffect(() => {
        async function fetchCategorias() {
            try {
                const data = await obtenerCategorias();
                setCategorias(data);
            } catch (error) {
                console.error('Error al obtener categorías:', error);
            }
        }

        async function cargarArticulo(id) {
            try {
                const data = await obtenerArticulo(id);
                setMostrarArticulo(data);
            } catch (error) {
                console.error('Error al obtener el artículo:', error);
            }
        }

        fetchCategorias();
        cargarArticulo(articuloId);
    }, [articuloId]);

    const onSubmit = async (values, actions) => {
        try {
            let urlImagen = mostrarArticulo?.imagen || null;

            if (imagen && imagen instanceof File) {
                const nombreArchivo = `public/${Date.now()}-${imagen.name}`;
                const { error } = await supabase.storage
                    .from('fotosarticulos')
                    .upload(nombreArchivo, imagen, {
                        cacheControl: '3600',
                        upsert: true
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

            await editarArticulo(
                articuloId,
                { ...values, imagen: urlImagen },
                token
            );

            navigate('/articulos');
            actions.resetForm();
            setImagen(null);
        } catch (error) {
            console.error('Error durante el envío:', error);
            actions.setSubmitting(false);
        }
    };

    if (!mostrarArticulo) {
        return <div>Cargando...</div>;
    }

    return (
        <MDBContainer className="my-5">
            <MDBCard className="bg-cv">
                <MDBCardBody className="d-flex flex-column">
                    <h3 className="fw-bold my-4 pb-3">Editar artículo</h3>
                    <Formik
                        initialValues={{
                            nombre: mostrarArticulo.nombre || '',
                            descripcion: mostrarArticulo.descripcion || '',
                            precio_venta: mostrarArticulo.precio_venta || '',
                            costo: mostrarArticulo.costo || '',
                            inventario: mostrarArticulo.inventario || '',
                            codigo_barras: mostrarArticulo.codigo_barras || '',
                            sku: mostrarArticulo.sku || '',
                            categoria_id: mostrarArticulo.categoria_id || '',
                            proveedor: mostrarArticulo.proveedor || ''
                        }}
                        validationSchema={articuloSchema}
                        enableReinitialize={true}
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
                                    {mostrarArticulo.imagen && !imagen && (
                                        <img
                                            src={mostrarArticulo.imagen}
                                            alt="Artículo"
                                            style={{ marginTop: '10px', maxWidth: '200px' }}
                                        />
                                    )}
                                </div>

                                <CustomInput label="Nombre" name="nombre" placeholder="Nombre del artículo" />
                                <CustomTextArea label="Descripción" name="descripcion" placeholder="Descripción" />
                                <CustomInput label="Precio de Venta" name="precio_venta" type="number" placeholder="0.00" />
                                <CustomInput label="Costo" name="costo" type="number" placeholder="0.00" />
                                <CustomInput label="Inventario" name="inventario" type="number" placeholder="0" />
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
                                    Guardar Cambios
                                </MDBBtn>
                            </Form>
                        )}
                    </Formik>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}

export default EditarArticulo;