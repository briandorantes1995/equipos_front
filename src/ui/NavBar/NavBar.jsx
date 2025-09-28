import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { MDBBadge } from 'mdb-react-ui-kit';
import { ShoppingCart } from "lucide-react";
import {clearAuth, setAuth} from "../../store/userSlice.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../../assets/logo2.png';
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
import './NavBar.css'

export default function Navbar() {
    const [showBasic, setShowBasic] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const user = useSelector(state => state.user.user);
    const Auth = useSelector(state => state.user.isAuthenticated);
    const rol = useSelector(state => state.user.rol);
    const totalCantidad = useSelector(state => state.cart.totalCantidad);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loginWithRedirect, logout, isAuthenticated, user: auth0User,isLoading, getAccessTokenSilently } = useAuth0();
    useEffect(() => {
        async function syncAuth() {
            if (isAuthenticated) {
                const token = await getAccessTokenSilently();
                dispatch(setAuth({ token, user: auth0User}));
            } else {
                dispatch(clearAuth());
            }
        }
        syncAuth();
    }, [isAuthenticated, getAccessTokenSilently, auth0User, dispatch]);


    function cerrarSesion() {
        // Limpia Redux y cierra sesión en Auth0
        dispatch(clearAuth());
        logout({ logoutParams: { returnTo: window.location.origin } });
    }

    const handleInputChange = (event) => setBusqueda(event.target.value);
    const handleBuscarClick = () => navigate(`/articulos/buscar/${busqueda}`);
    if (isLoading) {
        return null;
    }
    return (
        <MDBNavbar expand='lg' light bgColor='light' className='sticky-navbar'>
            <MDBContainer fluid>
                <MDBNavbarBrand tag={Link} to="/">
                    <img
                        src={logo}
                        alt="Equipos Medicos"
                        height="50"
                        style={{ marginRight: '10px' }}
                    />
                </MDBNavbarBrand>


                <MDBNavbarToggler
                    aria-controls='navbarSupportedContent'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    onClick={() => setShowBasic(!showBasic)}
                >
                    <MDBIcon icon='bars' fas/>
                </MDBNavbarToggler>

                <MDBCollapse navbar open={showBasic} id="navbarSupportedContent">
                <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem>
                            <MDBNavbarLink tag={Link} to="/">Inicio</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink tag={Link} to="/articulos">Productos</MDBNavbarLink>
                        </MDBNavbarItem>

                        {Auth ? (
                            <MDBNavbarItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                                        Perfil
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem link tag={Link} to="/#">
                                            {auth0User?.email || user?.userEmail || "Usuario"}
                                        </MDBDropdownItem >
                                                {rol === "admin" ? (
                                                <>
                                                    <MDBDropdownItem link tag={Link} to="/compras">
                                                    Compras
                                                    </MDBDropdownItem>
                                                    <MDBDropdownItem link tag={Link} to="/ventas">
                                                        Ventas
                                                    </MDBDropdownItem>
                                                    <MDBDropdownItem link tag={Link} to="/inventarios">
                                                    Inventarios
                                                    </MDBDropdownItem>
                                                </>
                                                ) : <></>}
                                        <MDBDropdownItem link onClick={cerrarSesion}>Cerrar Sesión</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavbarItem>
                        ) : (
                            <MDBNavbarItem>
                                <MDBBtn color="primary" onClick={() => loginWithRedirect()}>Iniciar Sesión</MDBBtn>
                            </MDBNavbarItem>
                        )}

                    <MDBNavbarItem>
                    <Link to="/carrito" className="nav-link">
                        <div style={{ position: "relative", display: "inline-block" }}>
                        <ShoppingCart size={24} />
                        {totalCantidad > 0 && (
                            <MDBBadge
                            color="danger"
                            pill
                            className="position-absolute top-0 start-100 translate-middle"
                            >
                            {totalCantidad}
                            </MDBBadge>
                        )}
                        </div>
                    </Link>
                    </MDBNavbarItem>
                    
                    </MDBNavbarNav>
                </MDBCollapse>
                <form className='d-flex input-group w-auto'>
                    <input type='search' className='form-control' placeholder='Buscar Articulo'
                           aria-label='Buscar'
                           onChange={handleInputChange}/>
                    <MDBBtn type="submit" color='primary' onClick={handleBuscarClick}>Buscar</MDBBtn>
                </form>
            </MDBContainer>
        </MDBNavbar>
    );
}

