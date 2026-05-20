import { useCallback, useMemo, useState } from "react";

export function useBulkSelection(rowKey = "id") {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleOne = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }, []);

    const toggleAll = useCallback((data) => {
        const ids = data.map((row) => row[rowKey] ?? row.stationId ?? row.unitId);
        setSelectedIds((prev) => (prev.length === ids.length ? [] : ids));
    }, [rowKey]);

    const clear = useCallback(() => setSelectedIds([]), []);

    const isSelected = useCallback((id) => selectedIds.includes(id), [selectedIds]);

    const selectedRows = useCallback(
        (data) => data.filter((row) => selectedIds.includes(row[rowKey] ?? row.stationId ?? row.unitId)),
        [selectedIds, rowKey]
    );

    return useMemo(
        () => ({
            selectedIds,
            setSelectedIds,
            toggleOne,
            toggleAll,
            clear,
            isSelected,
            selectedRows,
            hasSelection: selectedIds.length > 0,
            count: selectedIds.length,
        }),
        [selectedIds, toggleOne, toggleAll, clear, isSelected, selectedRows]
    );
}
