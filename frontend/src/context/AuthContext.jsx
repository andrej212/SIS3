import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function parseJwt(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        if (decoded.exp && decoded.exp < Date.now() / 1000) return null;
        return decoded;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        const stored = localStorage.getItem('token');
        if (!stored) return null;
        if (!parseJwt(stored)) {
            localStorage.removeItem('token');
            return null;
        }
        return stored;
    });

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('token');
        return stored ? parseJwt(stored) : null;
    });

    function login(newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(parseJwt(newToken));
    }

    function logout() {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
