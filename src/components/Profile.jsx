import React, {useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";


const Profile = () => {
    const { user, isAuthenticated, isLoading,getAccessTokenSilently } = useAuth0();
    console.log({ isAuthenticated, isLoading, user });

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const obtenerToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                console.log("Access Token:", token);
                // Ahora puedes usarlo para peticiones fetch o axios
            } catch (e) {
                console.error("Error al obtener el token", e);
            }
        };

        obtenerToken();
    }, [getAccessTokenSilently]);

    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        )
    );
};

export default Profile;