import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import obtenerVacantes from "../../functions/obtenerVacantes";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import PaginatedVacantes from "../../ui/Paginacion/Paginacion.jsx";
import "./Articulos.css"

function Articulos() {
    const user = useSelector((state) => state.user.value);
    const [mostrarVacantes, setMostrarVacantes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEmpresa, setSelectedEmpresa] = useState("");
    const [selectedFecha, setSelectedFecha] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await obtenerVacantes(user.userId);
                setMostrarVacantes(data);

                const nombresDeCompanias = data.map(objeto => objeto.compania.name);
                const nombresEmpresasUnicos = nombresDeCompanias.filter((nombre, index, self) => {
                    return self.indexOf(nombre) === index;
                });
                setEmpresas(nombresEmpresasUnicos);

                const fechasDeCreacion = data.map(objeto => format(parseISO(objeto.createdAt), 'dd/MM/yyyy'));
                const fechasCreacionUnicas = fechasDeCreacion.filter((fecha, index, self) => {
                    return self.indexOf(fecha) === index;
                });
                setFechas(fechasCreacionUnicas);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching vacantes:', error);
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);


    return (
        <div className="container-fluid v">
            {isLoading ? (
                <LinearProgress />
            ) : (
                <div className="container-fluid v">
                    <h5 className='titFil'>FILTROS</h5>
                    <div className='filtro'>

                        <label className='tituloFiltro'>Empresa</label>
                        <select onChange={(e) => setSelectedEmpresa(e.target.value)}>
                            <option value="">Todas</option>
                            {empresas.map((nombre, index) => (
                                <option key={index} value={nombre}>
                                    {nombre}
                                </option>
                            ))}
                        </select>
                        <label className='tituloFiltro'>Fecha de Creación</label>
                        <select onChange={(e) => setSelectedFecha(e.target.value)}>
                            <option value="">Todas</option>
                            {fechas.map((fecha, index) => (
                                <option key={index} value={fecha}>
                                    {fecha}
                                </option>
                            ))}
                        </select>
                    </div>
                    <PaginatedVacantes
                        items={mostrarVacantes}
                        itemsPerPage={8}
                        selectedEmpresa={selectedEmpresa}
                        selectedFecha={selectedFecha}
                    />
                </div>
            )}
        </div>
    );
}

export default Articulos;