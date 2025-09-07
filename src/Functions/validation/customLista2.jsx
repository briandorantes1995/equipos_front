import { useField } from "formik";
import "./validation.css";

const CustomLista2 = ({ label, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <div>
            <label>{label}</label>
            <select
                {...field}
                {...props} // style, etc.
                className={meta.touched && meta.error ? "input-error" : ""}
            >
                {props.children}
            </select>
            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
        </div>
    );
};

export default CustomLista2;






