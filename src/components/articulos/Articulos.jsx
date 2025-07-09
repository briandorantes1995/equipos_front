import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import obtenerArticulos from "../../Functions/obtenerArticulos.js";
import Paginacion from "../../ui/Paginacion/Paginacion.jsx";
import "./Articulos.css";

function Articulos() {
    const [mostrarArticulos, setMostrarArticulos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [selectedProveedor, setSelectedProveedor] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await obtenerArticulos();
                setMostrarArticulos(data);
                console.log(data);
                // Obtener categorías únicas
                const categoriasUnicas = [
                    ...new Set(data.map(item => item.categoria_nombre || "Sin categoría"))
                ];
                setCategorias(categoriasUnicas);

                // Obtener proveedores únicos
                const proveedoresUnicos = [
                    ...new Set(data.map(item => item.proveedor || ""))
                ].filter(Boolean);
                setProveedores(proveedoresUnicos);


                setIsLoading(false);
            } catch (error) {
                console.error('Error al obtener artículos:', error);
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="main-content">
        <div className="container-fluid v">
            {isLoading ? (
                <LinearProgress />
            ) : (
                <div className="container-fluid v">
                    <h5 className='titFil'>FILTROS</h5>
                    <div className='filtro'>
                        <label className='tituloFiltro'>Categoría</label>
                        <select onChange={(e) => setSelectedCategoria(e.target.value)}>
                            <option value="">Todas</option>
                            {categorias.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <label className='tituloFiltro'>Proveedor</label>
                        <select onChange={(e) => setSelectedProveedor(e.target.value)}>
                            <option value="">Todos</option>
                            {proveedores.map((prov, index) => (
                                <option key={index} value={prov}>
                                    {prov}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Paginacion
                        items={mostrarArticulos}
                        itemsPerPage={8}
                        selectedCategoria={selectedCategoria}
                        selectedProveedor={selectedProveedor}
                    />
                </div>
            )}
        </div>
        </div>
    );
}

export default Articulos;
