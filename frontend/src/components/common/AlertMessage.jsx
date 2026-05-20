/**
 * Bootstrap alert for API / validation errors and success messages.
 */
function AlertMessage({ message, variant = "danger", onClose }) {
    if (!message) {
        return null;
    }

    return (
        <div className={`alert alert-${variant} alert-dismissible fade show`} role="alert">
            {message}
            {onClose && (
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            )}
        </div>
    );
}

export default AlertMessage;
