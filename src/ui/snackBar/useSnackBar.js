import { useContext } from "react";
import { SnackbarContext } from "./SnackBarContext.js";

export function useSnackbar() {
    return useContext(SnackbarContext);
}
