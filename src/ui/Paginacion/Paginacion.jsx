import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import Card from '../../components/articulos/Card.jsx';
import { Link } from "react-router-dom";
import './Paginacion.css';

import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  gap: 24px;
  padding: 24px;
  justify-items: center;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

function Paginacion({ items, itemsPerPage, selectedCategoria = "", selectedProveedor = "" }) {
    const [itemOffset, setItemOffset] = useState(0);

    // 1. Filtrar antes de paginar
    const articulosFiltrados = items.filter(art => {
        const categoriaMatch =
            selectedCategoria === "" ||
            (art.categoria_nombre || "Sin categoría").toLowerCase() === selectedCategoria.toLowerCase();

        const proveedorMatch =
            selectedProveedor === "" ||
            (art.proveedor || "").toLowerCase().includes(selectedProveedor.toLowerCase());

        return categoriaMatch && proveedorMatch;
    });

    // 2. Calcular paginación después del filtro
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = articulosFiltrados.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(articulosFiltrados.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage;
        setItemOffset(newOffset);
    };

    return (
        <>
            <GridContainer>
                {currentItems.map((articulo, index) => (
                    <Link to={`/articulos/${articulo.id}`} key={index} style={{ textDecoration: 'none' }}>
                        <Card articulo={articulo} />
                    </Link>
                ))}
            </GridContainer>
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

