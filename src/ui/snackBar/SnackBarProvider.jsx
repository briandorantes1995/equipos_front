import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Slide } from "@mui/material";
import { SnackbarContext } from "./SnackbarContext";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionRight(props) {
    return <Slide {...props} direction="right" />;
}

export function SnackbarProvider({ children }) {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        level: "info",
        vertical: "top",
        horizontal: "right",
    });

    const showSnackbar = ({
                              message,
                              level = "info",
                              vertical = "top",
                              horizontal = "right",
                          }) => {
        setSnackbar({ open: true, message, level, vertical, horizontal });
    };

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleClose}
                TransitionComponent={TransitionRight}
                anchorOrigin={{
                    vertical: snackbar.vertical,
                    horizontal: snackbar.horizontal,
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.level}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}
