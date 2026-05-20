function BulkActionBar({ count, onClear, children }) {
    if (!count) return null;

    return (
        <div className="bulk-action-bar alert alert-light border d-flex flex-wrap align-items-center gap-2 mb-3 py-2">
            <span className="small fw-semibold">{count} selected</span>
            {children}
            <button type="button" className="btn btn-sm btn-link ms-auto" onClick={onClear}>
                Clear
            </button>
        </div>
    );
}

export default BulkActionBar;
