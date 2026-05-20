/**
 * Reusable Bootstrap modal (CSS-only show/hide — no bootstrap JS required).
 */
function BootstrapModal({ show, title, children, onClose, footer }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal d-block admin-modal-backdrop" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
                    </div>
                    <div className="modal-body">{children}</div>
                    {footer && <div className="modal-footer">{footer}</div>}
                </div>
            </div>
        </div>
    );
}

export default BootstrapModal;
