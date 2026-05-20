import BootstrapModal from "./BootstrapModal";

function ConfirmModal({ show, title, message, confirmLabel = "Delete", onConfirm, onClose, variant = "danger" }) {
    return (
        <BootstrapModal
            show={show}
            title={title}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className={`btn btn-${variant}`} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </>
            }
        >
            <p className="mb-0">{message}</p>
        </BootstrapModal>
    );
}

export default ConfirmModal;
