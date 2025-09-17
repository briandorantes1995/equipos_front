import './NavBar.css'
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
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

export default function Navbar() {
    const [showBasic, setShowBasic] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const user = useSelector(state => state.user.user);
    const Auth = useSelector(state => state.user.isAuthenticated);
    const rol = useSelector(state => state.user.rol);
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
    <MDBNavbarBrand tag={Link} to="/" onClick={() => setShowBasic(false)}>
      <img
        src={logo}
        alt="ATS Logo"
        height="50"
        style={{ marginRight: '10px' }}
      />
    </MDBNavbarBrand>

    <MDBNavbarToggler
      aria-controls='navbarSupportedContent'
      aria-expanded={showBasic}
      aria-label='Toggle navigation'
      onClick={() => setShowBasic(!showBasic)}
    >
      <MDBIcon icon='bars' fas />
    </MDBNavbarToggler>

    <MDBCollapse navbar show={showBasic}>
      <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
        <MDBNavbarItem>
          <MDBNavbarLink
            tag={Link}
            to="/"
            onClick={() => setShowBasic(false)}
          >
            Inicio
          </MDBNavbarLink>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <MDBNavbarLink
            tag={Link}
            to="/articulos"
            onClick={() => setShowBasic(false)}
          >
            Productos
          </MDBNavbarLink>
        </MDBNavbarItem>

        {Auth ? (
          <MDBNavbarItem>
            <MDBDropdown>
              <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                Perfil
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem>
                  {auth0User?.email || user?.userEmail || "Usuario"}
                </MDBDropdownItem>
                <MDBDropdownItem>Información Personal</MDBDropdownItem>
                {rol === "admin" && (
                  <>
                    <MDBDropdownItem
                      link
                      href="/compras"
                      onClick={() => setShowBasic(false)}
                    >
                      Compras
                    </MDBDropdownItem>
                    <MDBDropdownItem
                      link
                      href="/inventarios"
                      onClick={() => setShowBasic(false)}
                    >
                      Inventarios
                    </MDBDropdownItem>
                  </>
                )}
                <MDBDropdownItem link onClick={() => { cerrarSesion(); setShowBasic(false); }}>
                  Cerrar Sesión
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarItem>
        ) : (
          <MDBNavbarItem>
            <MDBBtn
              color="primary"
              onClick={() => {
                setShowBasic(false);
                loginWithRedirect();
              }}
            >
              Iniciar Sesión
            </MDBBtn>
          </MDBNavbarItem>
        )}
      </MDBNavbarNav>
    </MDBCollapse>

    <form className='d-flex input-group w-auto'>
      <input
        type='search'
        className='form-control'
        placeholder='Buscar Articulo'
        aria-label='Buscar'
        onChange={handleInputChange}
      />
      <MDBBtn
        type="submit"
        color='primary'
        onClick={(e) => {
          e.preventDefault();
          setShowBasic(false);
          handleBuscarClick();
        }}
      >
        Buscar
      </MDBBtn>
    </form>
  </MDBContainer>
</MDBNavbar>
    );
}

