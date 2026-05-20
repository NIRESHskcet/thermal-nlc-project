import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { getErrorMessage } from "../utils/errorUtils";

const AuthContext = createContext(null);

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [bootstrapping, setBootstrapping] = useState(true);

    const logout = useCallback(() => {
        authService.clearSession();
        setUser(null);
    }, []);

    useEffect(() => {
        setUser(authService.getSession());
        setBootstrapping(false);
    }, []);

    // Session timeout check every minute
    useEffect(() => {
        const interval = setInterval(() => {
            const session = authService.getSession();
            if (!session && user) {
                logout();
            } else if (session && !user) {
                setUser(session);
            }
        }, 60_000);
        return () => clearInterval(interval);
    }, [user, logout]);

    // Extend session on user activity
    useEffect(() => {
        if (!user) return undefined;
        const onActivity = () => authService.touchSession();
        ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
        return () => ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
    }, [user]);

    const login = useCallback(async (username, password, staySignedIn = false) => {
        const response = await authService.login(username, password);
        authService.saveSession(response.data, staySignedIn);
        setUser(response.data);
        return response.data;
    }, []);

    const value = useMemo(
        () => ({ user, bootstrapping, login, logout, isAuthenticated: Boolean(user) }),
        [user, bootstrapping, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}

export async function loginWithErrorHandling(loginFn, username, password, staySignedIn) {
    try {
        return await loginFn(username, password, staySignedIn);
    } catch (err) {
        throw new Error(getErrorMessage(err));
    }
}
