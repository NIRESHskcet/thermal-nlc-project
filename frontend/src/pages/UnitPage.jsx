import { useCallback, useEffect, useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import BootstrapModal from "../components/common/BootstrapModal";
import BulkActionBar from "../components/common/BulkActionBar";
import ConfirmModal from "../components/common/ConfirmModal";
import ExportDropdown from "../components/common/ExportDropdown";
import FieldError from "../components/common/FieldError";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PageToolbar from "../components/common/PageToolbar";
import SelectableDataTable from "../components/common/SelectableDataTable";
import { useBulkSelection } from "../hooks/useBulkSelection";
import { useConfirmDelete } from "../hooks/useConfirmDelete";
import { useCrudHandlers } from "../hooks/useCrudHandlers";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { usePermissions } from "../hooks/usePermissions";
import { stationService } from "../services/stationService";
import { unitService } from "../services/unitService";
import { getFieldError } from "../utils/validationErrors";

const emptyUnit = { stationId: "", unitName: "", capacityMW: "" };

function UnitPage() {
    const { isReadOnly } = usePermissions();
    const { toast, handleError } = useCrudHandlers();
    const bulk = useBulkSelection("unitId");
    const { confirmState, requestDelete, close, confirm } = useConfirmDelete();

    const [units, setUnits] = useState([]);
    const [stations, setStations] = useState([]);
    const [form, setForm] = useState(emptyUnit);
    const [fieldErrors, setFieldErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [stationFilter, setStationFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword);

    const loadStations = useCallback(async () => {
        try {
            const response = await stationService.getAll();
            setStations(response.data);
        } catch (err) {
            setError(err.message || "Failed to load stations");
        }
    }, []);

    const loadUnits = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            let response;
            if (debouncedKeyword.trim()) {
                response = await unitService.search(debouncedKeyword.trim());
                const data = stationFilter
                    ? response.data.filter((u) => String(u.stationId) === String(stationFilter))
                    : response.data;
                setUnits(data);
            } else if (stationFilter) {
                response = await unitService.getByStationId(stationFilter);
                setUnits(response.data);
            } else {
                response = await unitService.getAll();
                setUnits(response.data);
            }
            bulk.clear();
        } catch (err) {
            setError(err.message || "Failed to load units");
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword, stationFilter]);

    useEffect(() => { loadStations(); }, [loadStations]);
    useEffect(() => { loadUnits(); }, [loadUnits]);

    const openModal = (unit = null) => {
        setFieldErrors({});
        setEditId(unit?.unitId ?? null);
        setForm(unit ? { stationId: unit.stationId || "", unitName: unit.unitName || "", capacityMW: unit.capacityMW || "" } : { ...emptyUnit });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditId(null);
        setForm({ ...emptyUnit });
        setFieldErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.stationId) {
            setError("Please select a station.");
            return;
        }
        try {
            setFieldErrors({});
            if (editId) {
                await unitService.update(editId, { stationId: Number(form.stationId), unitName: form.unitName, capacityMW: form.capacityMW });
                toast.success("Unit updated successfully.");
            } else {
                await unitService.create({ station: { stationId: Number(form.stationId) }, unitName: form.unitName, capacityMW: form.capacityMW });
                toast.success("Unit added successfully.");
            }
            closeModal();
            await loadUnits();
        } catch (err) {
            handleError(err, setFieldErrors, setError);
        }
    };

    const deleteOne = (id) => {
        requestDelete({
            message: "Delete this unit?",
            onConfirm: async () => {
                await unitService.remove(id);
                toast.success("Unit deleted.");
                await loadUnits();
            },
        });
    };

    const bulkDelete = () => {
        requestDelete({
            title: "Delete selected units",
            message: `Delete ${bulk.count} unit(s)?`,
            onConfirm: async () => {
                await Promise.all(bulk.selectedIds.map((id) => unitService.remove(id)));
                toast.success(`${bulk.count} unit(s) deleted.`);
                await loadUnits();
            },
        });
    };

    const tableColumns = [
        { key: "unitId", label: "ID" },
        { key: "unitName", label: "Unit Name" },
        { key: "stationName", label: "Station" },
        { key: "capacityMW", label: "Capacity (MW)" },
    ];

    const columns = isReadOnly ? tableColumns : [...tableColumns, {
        key: "actions", label: "Actions",
        render: (row) => (
            <div className="d-flex gap-1">
                <button type="button" className="btn btn-sm btn-warning" onClick={() => openModal(row)}>Edit</button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteOne(row.unitId)}>Delete</button>
            </div>
        ),
    }];

    return (
        <div className="fade-in-up">
            <PageToolbar title="Units" subtitle="Generation units per station" searchValue={keyword} onSearchChange={setKeyword}
                onAdd={isReadOnly ? undefined : () => openModal()} addLabel="Add Unit" readOnly={isReadOnly}
                extraActions={<ExportDropdown filename="units" title="Units" columns={tableColumns} data={units} />}
                filterSlot={
                    <select className="form-select" value={stationFilter} onChange={(e) => setStationFilter(e.target.value)}>
                        <option value="">All Stations</option>
                        {stations.map((s) => <option key={s.stationId} value={s.stationId}>{s.stationName}</option>)}
                    </select>
                }
            />
            <AlertMessage message={error} onClose={() => setError("")} />
            <BulkActionBar count={bulk.count} onClear={bulk.clear}>
                {!isReadOnly && <button type="button" className="btn btn-sm btn-danger" onClick={bulkDelete}>Delete selected</button>}
            </BulkActionBar>
            {loading ? <LoadingSpinner /> : (
                <SelectableDataTable columns={columns} data={units} rowKey="unitId" readOnly={isReadOnly}
                    selectedIds={bulk.selectedIds} onToggleOne={bulk.toggleOne} onToggleAll={bulk.toggleAll} />
            )}
            <ConfirmModal show={confirmState.open} title={confirmState.title} message={confirmState.message} onConfirm={confirm} onClose={close} />
            <BootstrapModal show={modalOpen} title={editId ? "Edit Unit" : "Add Unit"} onClose={closeModal}
                footer={<><button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>{editId ? "Update" : "Save"}</button></>}>
                <div className="mb-3">
                    <label className="form-label">Station</label>
                    <select className={`form-select ${getFieldError(fieldErrors, "station") ? "is-invalid" : ""}`} name="stationId" value={form.stationId} onChange={handleChange}>
                        <option value="">Select station</option>
                        {stations.map((s) => <option key={s.stationId} value={s.stationId}>{s.stationName}</option>)}
                    </select>
                    <FieldError error={getFieldError(fieldErrors, "station")} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Unit Name</label>
                    <input className={`form-control ${getFieldError(fieldErrors, "unitName") ? "is-invalid" : ""}`} name="unitName" value={form.unitName} onChange={handleChange} />
                    <FieldError error={getFieldError(fieldErrors, "unitName")} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Capacity (MW)</label>
                    <input className={`form-control ${getFieldError(fieldErrors, "capacityMW") ? "is-invalid" : ""}`} name="capacityMW" value={form.capacityMW} onChange={handleChange} />
                    <FieldError error={getFieldError(fieldErrors, "capacityMW")} />
                </div>
            </BootstrapModal>
        </div>
    );
}

export default UnitPage;
