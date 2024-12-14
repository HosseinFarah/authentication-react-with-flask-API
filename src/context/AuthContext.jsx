import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('authTokens') || !!sessionStorage.getItem('authTokens')
    );

    const setAuth = (authState) => {
        setIsAuthenticated(authState);
    };

    const logout = () => {
        localStorage.removeItem('authTokens');
        sessionStorage.removeItem('authTokens');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

