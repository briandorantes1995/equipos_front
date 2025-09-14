import {Navigate, Outlet} from "react-router-dom";
import Navbar from "../ui/NavBar/NavBar.jsx";
import Footer from "../ui/Footer/Footer.jsx";
import React from "react";
import {useSelector} from "react-redux";

export const Layout = () => (
    <>
     <Navbar />
        <Outlet />
        <Footer />
    </>
);


export const RequireAuth = ({ allowedRoles = [] }) => {
    const rol = useSelector(state => state.user.rol);
    if (rol === null || rol === undefined) {
        return null;
    }

    if (!allowedRoles.includes(rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};