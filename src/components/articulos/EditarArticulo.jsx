import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import {articuloSchema} from "../../Functions/validation/ValidationSchema.js";
import CustomInput from '../../Functions/validation/customInput';
import CustomTextArea from '../../Functions/validation/customTextArea';
import CustomLista from '../../Functions/validation/customLista';
import obtenerCategorias from '../../Functions/obtenerCategorias';
import obtenerArticulo from '../../Functions/obtenerArticulo';
import editarArticulo from '../../Functions/editarArticulo';
import { supabase } from '../../Functions/supabaseClient';
import { useSelector } from 'react-redux';
import {useSnackbar} from "../../ui/snackBar/useSnackBar.js";
import './Articulos.css';

function EditarArticulo() {
    const [categorias, setCategorias] = useState([]);
    const [mostrarArticulo, setMostrarArticulo] = useState(null);
    const [imagen, setImagen] = useState(null);
    const navigate = useNavigate();
    const { articuloId } = useParams();
    const { showSnackbar } = useSnackbar();
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
            let archivoAnterior = null;

            if (mostrarArticulo?.imagen) {
                const partesUrl = mostrarArticulo.imagen.split('/fotosarticulos/');
                if (partesUrl.length > 1) {
                    archivoAnterior = partesUrl[1];
                }
            }

            if (imagen && imagen instanceof File) {
                const nombreArchivo = `public/${Date.now()}-${imagen.name}`;

                const { error: uploadError } = await supabase.storage
                    .from('fotosarticulos')
                    .upload(nombreArchivo, imagen, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadError) {
                    console.error('Error al subir imagen:', uploadError);
                    throw uploadError;
                }

                const { data: publicData } = supabase.storage
                    .from('fotosarticulos')
                    .getPublicUrl(nombreArchivo);

                urlImagen = publicData.publicUrl;

                if (archivoAnterior) {
                    const { error: removeError } = await supabase.storage
                        .from('fotosarticulos')
                        .remove([archivoAnterior]);

                    if (removeError) {
                        console.error('Error al eliminar la imagen anterior:', removeError);
                    }
                }
            }

            await editarArticulo(
                articuloId,
                { ...values, imagen: urlImagen },
                token
            );

            actions.resetForm();
            setImagen(null);
             showSnackbar({message: "Articulo Editado con exito",level: "success",vertical: "top",horizontal: "center",});
            navigate('/articulos');
        } catch (error) {
            console.error('Error durante el envío:', error);
            actions.setSubmitting(false);
            showSnackbar({message: "Error al editar Articulo",level: "error",vertical: "top",horizontal: "center",});
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
                            marca: mostrarArticulo.marca || '',
                            descripcion: mostrarArticulo.descripcion || '',
                            precio_venta: mostrarArticulo.precio_venta || '',
                            costo: mostrarArticulo.costo || '',
                            codigo_barras: mostrarArticulo.codigo_barras || '',
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
                                <CustomLista label="Categoría" name="categoria_id">
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </CustomLista>
                                <CustomInput label="Nombre" name="nombre" placeholder="Nombre del artículo" />
                                <CustomInput label="Marca" name="marca" placeholder="Marca" />
                                <CustomTextArea label="Descripción" name="descripcion" placeholder="Descripción" />
                                <CustomInput label="Precio de Venta" name="precio_venta" type="number" placeholder="0.00" />
                                <CustomInput label="Costo" name="costo" type="number" placeholder="0.00" />
                                <CustomInput label="Código de Barras" name="codigo_barras" placeholder="Código de barras" />
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