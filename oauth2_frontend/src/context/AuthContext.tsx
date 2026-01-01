import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: false
})

export const useAuth = () => useContext(AuthContext);

type Props = {
    children: ReactNode
}
export const AuthProvider = ({ children }: Props) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    console.log("auth provider");
    useEffect(() => {
        fetch("http://localhost:8080/api/user", {
            credentials: "include"
        })
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(data => {
                console.log("this is data: ", data);
                if(data !== null && data !== undefined){
                    setIsAuthenticated(true);
                }
                else{
                    setIsAuthenticated(false);
                }
            })
            .catch((e) => console.log("Error: ", e))
            .finally(() => {
                setLoading(false);
            })
    })


    return (
        <AuthContext.Provider value={{ loading, isAuthenticated}} >
            {children}
        </AuthContext.Provider>
    );
}