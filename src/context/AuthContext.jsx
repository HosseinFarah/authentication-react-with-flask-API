import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('authTokens') || !!sessionStorage.getItem('authTokens')
    );
    const [isConfirmed, setIsConfirmed] = useState(
        JSON.parse(sessionStorage.getItem('isConfirmed')) || false
    );
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);

    const setAuth = (authState) => {
        setIsAuthenticated(authState);
    };

    const setAdmin = (adminState) => {
        setIsAdmin(adminState);
    };

    const logout = () => {
        localStorage.removeItem('authTokens');
        sessionStorage.removeItem('authTokens');
        localStorage.removeItem('isConfirmed');
        sessionStorage.removeItem('isConfirmed');
        localStorage.removeItem('loggedInEmail'); // Ensure all relevant data is cleared
        sessionStorage.removeItem('loggedInEmail'); // Ensure all relevant data is cleared
        sessionStorage.removeItem('csrf_token'); // Ensure CSRF token is cleared
        setIsAuthenticated(false);
        setIsConfirmed(false);
        setIsAdmin(false);
        setUser(null);
        setAuth(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuth, logout, isConfirmed, setIsConfirmed, isAdmin, setAdmin, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};