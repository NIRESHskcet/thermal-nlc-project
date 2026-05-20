import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message, variant = "success", durationMs = 4000) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => removeToast(id), durationMs);
    }, [removeToast]);

    const value = useMemo(
        () => ({
            showToast,
            success: (msg) => showToast(msg, "success"),
            error: (msg) => showToast(msg, "danger", 6000),
            info: (msg) => showToast(msg, "info"),
        }),
        [showToast]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`toast show align-items-center text-bg-${t.variant} border-0 mb-2`}
                        role="alert"
                    >
                        <div className="d-flex">
                            <div className="toast-body">{t.message}</div>
                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                onClick={() => removeToast(t.id)}
                                aria-label="Close"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
