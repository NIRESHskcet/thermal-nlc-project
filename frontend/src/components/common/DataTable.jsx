/**
 * Responsive table wrapper with configurable columns.
 * columns: [{ key, label, render?(row) }]
 */
function DataTable({ columns, data, rowKey = "id", emptyMessage = "No records found." }) {
    return (
        <div className="table-responsive admin-table-wrap">
            <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key || col.label}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center text-muted py-4">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row[rowKey] ?? row.stationId ?? row.unitId ?? JSON.stringify(row)}>
                                {columns.map((col) => (
                                    <td key={col.key || col.label}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
