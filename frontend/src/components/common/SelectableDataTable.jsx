import DataTable from "./DataTable";

/**
 * Table with row selection checkboxes for bulk actions.
 */
function SelectableDataTable({
    columns,
    data,
    rowKey = "id",
    emptyMessage,
    selectable = true,
    selectedIds = [],
    onToggleOne,
    onToggleAll,
    readOnly = false,
}) {
    const getRowId = (row) => row[rowKey] ?? row.stationId ?? row.unitId;

    const allIds = data.map(getRowId);
    const allSelected = data.length > 0 && selectedIds.length === data.length;

    const selectColumn = selectable && !readOnly
        ? {
              key: "select",
              label: (
                  <input
                      type="checkbox"
                      className="form-check-input"
                      checked={allSelected}
                      onChange={() => onToggleAll?.(data)}
                      aria-label="Select all"
                  />
              ),
              render: (row) => {
                  const id = getRowId(row);
                  return (
                      <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedIds.includes(id)}
                          onChange={() => onToggleOne?.(id)}
                          aria-label={`Select row ${id}`}
                      />
                  );
              },
          }
        : null;

    const tableColumns = selectColumn ? [selectColumn, ...columns] : columns;

    return (
        <DataTable
            columns={tableColumns}
            data={data}
            rowKey={rowKey}
            emptyMessage={emptyMessage}
        />
    );
}

export default SelectableDataTable;
