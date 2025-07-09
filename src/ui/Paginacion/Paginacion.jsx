import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import Card from '../../components/articulos/Card.jsx';
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import './Paginacion.css';

function Paginacion({ items, itemsPerPage, selectedCategoria, selectedProveedor }) {
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage;
        setItemOffset(newOffset);
    };

    const filtrarArticulos = () => {
        let articulosFiltrados = currentItems;

        // Filtrar por nombre de categoría (asumiendo art.categoria.nombre existe)
        if (selectedCategoria !== "") {
            articulosFiltrados = articulosFiltrados.filter(
                art => art.categoria?.nombre?.toLowerCase() === selectedCategoria.toLowerCase()
            );
        }

        // Filtrar por proveedor (texto en art.proveedor)
        if (selectedProveedor !== "") {
            articulosFiltrados = articulosFiltrados.filter(
                art => art.proveedor?.toLowerCase().includes(selectedProveedor.toLowerCase())
            );
        }

        return articulosFiltrados;
    };

    return (
        <>
            <Stack container spacing={3}>
                {filtrarArticulos().map((articulo, index) => (
                    <Link to={`/articulos/${articulo.id}`} target="_self" key={index}>
                        <Card articulo={articulo} />
                    </Link>
                ))}
            </Stack>
            <div className="pagination-container">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Siguiente"
                    previousLabel="Anterior"
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName={'item pagination-page '}
                />
            </div>
        </>
    );
}

export default Paginacion;

