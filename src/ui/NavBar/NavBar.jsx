import './NavBar.css'
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { destroy } from "../../store/userSlice.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBCollapse,
} from 'mdb-react-ui-kit';

export default function Navbar() {
    const [showBasic, setShowBasic] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const user = useSelector((state) => state.user.value);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Auth0 hooks
    const { loginWithRedirect, logout, isAuthenticated, user: auth0User } = useAuth0();

    function cerrarSesion() {
        // Limpia Redux y cierra sesión en Auth0
        dispatch(destroy());
        logout({ logoutParams: { returnTo: window.location.origin } });
    }

    const handleInputChange = (event) => setBusqueda(event.target.value);
    const handleBuscarClick = () => navigate(`/busqueda/${busqueda}`);

    return (
        <MDBNavbar expand='lg' light bgColor='light' className='sticky-navbar'>
            <MDBContainer fluid>
                <MDBNavbarBrand tag={Link} to="/">ATS</MDBNavbarBrand>

                <MDBNavbarToggler
                    aria-controls='navbarSupportedContent'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    onClick={() => setShowBasic(!showBasic)}
                >
                    <MDBIcon icon='bars' fas />
                </MDBNavbarToggler>

                <MDBCollapse navbar show={showBasic}>
                    <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem>
                            <MDBNavbarLink tag={Link} to="/inicio">Inicio</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink tag={Link} to="/vacantes">Productos</MDBNavbarLink>
                        </MDBNavbarItem>

                        {isAuthenticated ? (
                            <MDBNavbarItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                                        Perfil
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem link>
                                            {/* Muestra email de Auth0 si disponible, sino de Redux */}
                                            {auth0User?.email || user?.userEmail || "Usuario"}
                                        </MDBDropdownItem>
                                        <MDBDropdownItem link>Información Personal</MDBDropdownItem>
                                        <MDBDropdownItem link onClick={cerrarSesion}>Cerrar Sesión</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavbarItem>
                        ) : (
                            <MDBNavbarItem>
                                <MDBBtn color="primary" onClick={() => loginWithRedirect()}>Iniciar Sesión</MDBBtn>
                            </MDBNavbarItem>
                        )}
                    </MDBNavbarNav>

                    <form className='d-flex input-group w-auto' onSubmit={e => { e.preventDefault(); handleBuscarClick(); }}>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Buscar Articulo'
                            aria-label='Buscar'
                            onChange={handleInputChange}
                        />
                        <MDBBtn color='primary' type="submit">Buscar</MDBBtn>
                    </form>
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    );
}

