import React, { useEffect, useState } from 'react';
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
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [selectedProveedor, setSelectedProveedor] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [articulosFiltrados, setArticulosFiltrados] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                // Obtener datos desde backend con búsqueda
                const data = await buscarArticulos(busqueda);

                setMostrarArticulos(data);

                // Obtener categorías únicas del resultado
                const categoriasUnicas = [
                    ...new Set(data.map(item => item.categoria_nombre || "Sin categoría"))
                ];
                setCategorias(categoriasUnicas);

                // Obtener proveedores únicos del resultado
                const proveedoresUnicos = [
                    ...new Set(data.map(item => item.proveedor || ""))
                ].filter(Boolean);
                setProveedores(proveedoresUnicos);

                setIsLoading(false);
            } catch (error) {
                console.error('Error al buscar artículos:', error);
                setIsLoading(false);
            }
        }

        fetchData();
    }, [busqueda]);

    // Aplicar filtros de categoría y proveedor a mostrarArticulos
    useEffect(() => {
        let filtrados = mostrarArticulos;

        if (selectedCategoria) {
            filtrados = filtrados.filter(item => (item.categoria_nombre || "Sin categoría") === selectedCategoria);
        }

        if (selectedProveedor) {
            filtrados = filtrados.filter(item => item.proveedor === selectedProveedor);
        }

        setArticulosFiltrados(filtrados);
    }, [selectedCategoria, selectedProveedor, mostrarArticulos]);

    return (
        <div className="main-content">
            <div className="container-fluid v">
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <div className="container-fluid v">
                        <h5 className='titFil'>FILTROS DE BÚSQUEDA</h5>
                        <div className='filtro'>
                            <label className='tituloFiltro'>Categoría</label>
                            <select value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)}>
                                <option value="">Todas</option>
                                {categorias.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            <label className='tituloFiltro'>Proveedor</label>
                            <select value={selectedProveedor} onChange={(e) => setSelectedProveedor(e.target.value)}>
                                <option value="">Todos</option>
                                {proveedores.map((prov, index) => (
                                    <option key={index} value={prov}>
                                        {prov}
                                    </option>
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
                                        itemsPerPage={8}
                                        selectedCategoria={selectedCategoria}
                                        selectedProveedor={selectedProveedor}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BusquedaArticulos;
