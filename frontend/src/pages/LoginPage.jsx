import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { loginWithErrorHandling, useAuth } from "../context/AuthContext";
import { getDefaultRoute } from "../utils/roleConfig";
import "../styles/login.css";

function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [staySignedIn, setStaySignedIn] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.classList.add("login-page-active");
        return () => document.body.classList.remove("login-page-active");
    }, []);

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const loggedIn = await loginWithErrorHandling(login, username.trim(), password, staySignedIn);
            navigate(getDefaultRoute(loggedIn.role), { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg-shape login-bg-shape-1" />
            <div className="login-bg-shape login-bg-shape-2" />

            <div className="login-card fade-in-up">
                <div className="login-brand">
                    <div className="login-logo">TN</div>
                    <div>
                        <h1 className="login-title">Thermal NLC</h1>
                        <p className="login-subtitle">Power Plant Management System</p>
                    </div>
                </div>

                <p className="login-hint text-muted small mb-4">
                    Sign in with credentials from the <strong>Users</strong> module. Access is limited to registered accounts.
                </p>

                <AlertMessage message={error} onClose={() => setError("")} />

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-control login-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <div className="form-check mb-4">
                        <input
                            id="staySignedIn"
                            type="checkbox"
                            className="form-check-input"
                            checked={staySignedIn}
                            onChange={(e) => setStaySignedIn(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="staySignedIn">
                            Stay signed in (7 days)
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 login-submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {loading && (
                    <div className="mt-3">
                        <LoadingSpinner message="Verifying account..." />
                    </div>
                )}
            </div>

            <p className="login-footer text-muted small">
                Neyveli Lignite Corporation &mdash; Internal use only
            </p>
        </div>
    );
}

export default LoginPage;
