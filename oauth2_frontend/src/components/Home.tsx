import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div>loading....</div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    const handleLogout = () =>{
        
        window.location.href = "http://localhost:8080/logout";
    }
    return (
        <>
            <h1>this is home page</h1>
            <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Logout
            </button>
        </>
    );
}
export default Home;