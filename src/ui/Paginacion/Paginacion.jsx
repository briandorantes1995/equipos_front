import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { format, parseISO } from "date-fns";
import Card from '../../components/articulos/Card.jsx';
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import './Paginacion.css'


function Paginacion({ items, itemsPerPage, selectedEmpresa, selectedFecha }) {
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage;
        setItemOffset(newOffset);
    };

    const filtrarVacantes = () => {
        let vacantesFiltradas = currentItems;

        if (selectedEmpresa !== "") {
            vacantesFiltradas = vacantesFiltradas.filter(vacante => vacante.compania.name === selectedEmpresa);
        }

        if (selectedFecha !== "") {
            vacantesFiltradas = vacantesFiltradas.filter(vacante => format(parseISO(vacante.createdAt), 'dd/MM/yyyy') === selectedFecha);
        }

        return vacantesFiltradas;
    };

    return (
        <>
            <Stack container spacing={3}>
                {filtrarVacantes().map((vacante, index) => (
                    <Link to={`/vacantes/${vacante.vacanteId}`} target="_self" key={index}>
                        <Card vacante={vacante} />
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