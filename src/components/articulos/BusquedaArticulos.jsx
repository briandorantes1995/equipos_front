import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import buscarArticulos from "../../Functions/buscarArticulos.js";
import Paginacion from "../../ui/Paginacion/Paginacion.jsx";
import "./Articulos.css";

function BusquedaArticulos() {
    const { busqueda } = useParams();
    const [mostrarArticulos, setMostrarArticulos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
     const [marcas, setMarcas] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [selectedProveedor, setSelectedProveedor] = useState("");
    const [selectedMarca, setSelectedMarca] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await buscarArticulos(busqueda);

                if (!Array.isArray(data)) {
                    setMostrarArticulos([]);
                    return;
                }

                setMostrarArticulos(data);

                const categoriasUnicas = Array.from(new Set(data.map(item => item?.categoria_nombre || "Sin categoría")));
                setCategorias(categoriasUnicas);

                const proveedoresUnicos = Array.from(new Set(data.map(item => item?.proveedor).filter(Boolean)));
                setProveedores(proveedoresUnicos);

                 const marcasUnicas = [...new Set(data.map(item => item?.marca || "Generico"))];
                setMarcas(marcasUnicas);

            } catch (error) {
                console.error("Error al buscar artículos:", error);
                setMostrarArticulos([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [busqueda]);

    const articulosFiltrados = useMemo(() => {
        return mostrarArticulos.filter(item => {
            const categoriaMatch = selectedCategoria ? (item?.categoria_nombre || "Sin categoría") === selectedCategoria : true;
             const marcaMatch = selectedMarca ? (item?.marca || "Generico") === selectedMarca : true;
            const proveedorMatch = selectedProveedor ? item?.proveedor === selectedProveedor : true;
            return categoriaMatch && marcaMatch &&  proveedorMatch;
        });
    }, [mostrarArticulos, selectedCategoria, selectedMarca,selectedProveedor]);

    return (
        <div className="main-content">
            <div className="container-fluid v">
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <h5 className='titFil'>FILTROS DE BÚSQUEDA</h5>
                        <div className='filtro'>
                            <label className='tituloFiltro'>Categoría</label>
                            <select value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)}>
                                <option value="">Todas</option>
                                {categorias.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>

                             <label className='tituloFiltro'>Marca</label>
                            <select value={selectedMarca} onChange={(e) => setSelectedMarca(e.target.value)}>
                                <option value="">Todas</option>
                                {marcas.map((marc, index) => (
                                    <option key={index} value={marc}>{marc}</option>
                                ))}
                            </select>

                            <label className='tituloFiltro'>Proveedor</label>
                            <select value={selectedProveedor} onChange={(e) => setSelectedProveedor(e.target.value)}>
                                <option value="">Todos</option>
                                {proveedores.map((prov, index) => (
                                    <option key={index} value={prov}>{prov}</option>
                                ))}
                            </select>
                        </div>

                        <div className="error">
                            {articulosFiltrados.length === 0 ? (
                                <p>No se encontraron artículos que coincidan con: <strong>{busqueda}</strong></p>
                            ) : (
                                <>
                                    <p>Resultado de búsqueda: <strong>{busqueda}</strong></p>
                                    <Paginacion
                                        items={articulosFiltrados}
                                        itemsPerPage={10}
                                    />
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default BusquedaArticulos;
