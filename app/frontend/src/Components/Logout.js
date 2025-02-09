import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseService";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await auth.signOut();
                navigate("/");
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        handleLogout();
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Logout;
