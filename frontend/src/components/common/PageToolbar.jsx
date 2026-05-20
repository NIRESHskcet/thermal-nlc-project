/**
 * Standard page toolbar: title, search, filters, export, add button.
 */
function PageToolbar({
    title,
    subtitle,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    filterSlot,
    filterSlotClassName = "col-md-6 col-lg-4",
    onAdd,
    addLabel = "Add New",
    extraActions,
    readOnly = false,
}) {
    return (
        <div className="admin-page-toolbar mb-4 fade-in-up">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                    <h2 className="admin-page-title mb-0">{title}</h2>
                    {subtitle && <p className="text-muted mb-0 small">{subtitle}</p>}
                    {readOnly && <span className="badge bg-secondary-subtle text-secondary mt-1">Read only</span>}
                </div>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                    {extraActions}
                    {onAdd && !readOnly && (
                        <button type="button" className="btn btn-primary" onClick={onAdd}>
                            + {addLabel}
                        </button>
                    )}
                </div>
            </div>
            <div className="row g-2 align-items-center">
                <div className={filterSlot ? "col-md-6 col-lg-4" : "col-12 col-md-6 col-lg-4"}>
                    <input
                        type="search"
                        className="form-control"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                {filterSlot && <div className={filterSlotClassName}>{filterSlot}</div>}
            </div>
        </div>
    );
}

export default PageToolbar;
