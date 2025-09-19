import React, { useState,useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Card from '../../components/articulos/Card.jsx';
import { Link } from "react-router-dom";
import useMobile from '../../Functions/useMobile.js';
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

function Paginacion({ items, itemsPerPage, selectedCategoria = "",selectedMarca= "", selectedProveedor = "" }) {
    const [itemOffset, setItemOffset] = useState(0);
    const isMobile = useMobile(576);

    useEffect(() => {
        setItemOffset(0);
    }, [selectedCategoria,selectedMarca, selectedProveedor]);

    // 1. Filtrar antes de paginar
    const articulosFiltrados = items.filter(art => {
        const categoriaMatch =
            selectedCategoria === "" ||
            (art.categoria_nombre || "Sin categoría").toLowerCase() === selectedCategoria.toLowerCase();


         const marcaMatch =
            selectedMarca === "" ||
            (art.marca || "Generico").toLowerCase().includes(selectedMarca.toLowerCase()); 

        const proveedorMatch =
            selectedProveedor === "" ||
            (art.proveedor || "").toLowerCase().includes(selectedProveedor.toLowerCase());


        return categoriaMatch && marcaMatch && proveedorMatch;
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
            {articulosFiltrados.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "18px" }}>
                    No hay artículos disponibles
                </p>
            ) : (
                <>
                    <GridContainer>
                        {currentItems.map((articulo, index) => (
                            <Link to={`/articulos/${articulo.id}`} key={index} style={{ textDecoration: 'none' }}>
                                <Card articulo={articulo} />
                            </Link>
                        ))}
                    </GridContainer>

                    {pageCount > 1 && (
                        <div className="pagination-container">
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="Siguiente"
                                previousLabel="Anterior"
                                pageCount={pageCount}
                                marginPagesDisplayed={isMobile ? 1 : 2}
                                pageRangeDisplayed={isMobile ? 2 : 5}
                                onPageChange={handlePageClick}
                                containerClassName="pagination"
                                activeClassName="active"
                                pageClassName={'item pagination-page'}
                                forcePage={Math.floor(itemOffset / itemsPerPage)}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default Paginacion;

