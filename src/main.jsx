import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";
import { store, persistor } from './store/store.jsx';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from './App.jsx'
import {SnackbarProvider} from "./ui/snackBar/SnackBarProvider.jsx";


createRoot(document.getElementById('root')).render(
<Auth0Provider
    domain="dev-0prfnimtqo8j1gzl.us.auth0.com"
    clientId="pv4lc4UyGKHJ21UkHRf9qXVea6qPmY8B"
    authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://equiposmedicos/api",
    }
}
    cacheLocation="localstorage"
>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <SnackbarProvider>
                    <App />
                </SnackbarProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>
</Auth0Provider>,
)
