import {Outlet} from "react-router-dom";
import Navbar from "../ui/NavBar/Navbar.jsx";
import Footer from "../ui/Footer/Footer.jsx";
import React from "react";

export const Layout = () => (
    <>
     <Navbar />
        <Outlet />
        <Footer />
    </>
);