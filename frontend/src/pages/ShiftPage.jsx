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
import { shiftService } from "../services/shiftService";
import { getFieldError } from "../utils/validationErrors";

const emptyShift = { shiftName: "", startTime: "", endTime: "" };
const toTimeInput = (value) => (value ? String(value).slice(0, 5) : "");

function ShiftPage() {
    const { isReadOnly } = usePermissions();
    const { toast, handleError } = useCrudHandlers();
    const bulk = useBulkSelection("id");
    const { confirmState, requestDelete, close, confirm } = useConfirmDelete();

    const [shifts, setShifts] = useState([]);
    const [form, setForm] = useState(emptyShift);
    const [fieldErrors, setFieldErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword);

    const loadShifts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = debouncedKeyword.trim()
                ? await shiftService.search(debouncedKeyword.trim())
                : await shiftService.getAll();
            setShifts(response.data);
            bulk.clear();
        } catch (err) {
            setError(err.message || "Failed to load shifts");
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword]);

    useEffect(() => { loadShifts(); }, [loadShifts]);

    const openModal = (shift = null) => {
        setFieldErrors({});
        setEditId(shift?.id ?? null);
        setForm(shift ? { shiftName: shift.shiftName || "", startTime: toTimeInput(shift.startTime), endTime: toTimeInput(shift.endTime) } : { ...emptyShift });
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditId(null); setForm({ ...emptyShift }); setFieldErrors({}); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setFieldErrors({});
            const payload = {
                shiftName: form.shiftName,
                startTime: form.startTime.length === 5 ? `${form.startTime}:00` : form.startTime,
                endTime: form.endTime.length === 5 ? `${form.endTime}:00` : form.endTime,
            };
            if (editId) {
                await shiftService.update(editId, payload);
                toast.success("Shift updated successfully.");
            } else {
                await shiftService.create(payload);
                toast.success("Shift added successfully.");
            }
            closeModal();
            await loadShifts();
        } catch (err) {
            handleError(err, setFieldErrors, setError);
        }
    };

    const deleteOne = (id) => {
        requestDelete({
            message: "Delete this shift?",
            onConfirm: async () => {
                await shiftService.remove(id);
                toast.success("Shift deleted.");
                await loadShifts();
            },
        });
    };

    const bulkDelete = () => {
        requestDelete({
            title: "Delete selected shifts",
            message: `Delete ${bulk.count} shift(s)?`,
            onConfirm: async () => {
                await Promise.all(bulk.selectedIds.map((id) => shiftService.remove(id)));
                toast.success(`${bulk.count} shift(s) deleted.`);
                await loadShifts();
            },
        });
    };

    const tableColumns = [
        { key: "id", label: "ID" },
        { key: "shiftName", label: "Shift Name" },
        { key: "startTime", label: "Start" },
        { key: "endTime", label: "End" },
    ];

    const columns = isReadOnly ? tableColumns : [...tableColumns, {
        key: "actions", label: "Actions",
        render: (row) => (
            <div className="d-flex gap-1">
                <button type="button" className="btn btn-sm btn-warning" onClick={() => openModal(row)}>Edit</button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteOne(row.id)}>Delete</button>
            </div>
        ),
    }];

    return (
        <div className="fade-in-up">
            <PageToolbar title="Shifts" subtitle={isReadOnly ? "View shift schedules" : "Work shift schedules"}
                searchValue={keyword} onSearchChange={setKeyword}
                onAdd={isReadOnly ? undefined : () => openModal()} addLabel="Add Shift" readOnly={isReadOnly}
                extraActions={<ExportDropdown filename="shifts" title="Shifts" columns={tableColumns} data={shifts} />} />
            <AlertMessage message={error} onClose={() => setError("")} />
            <BulkActionBar count={bulk.count} onClear={bulk.clear}>
                {!isReadOnly && <button type="button" className="btn btn-sm btn-danger" onClick={bulkDelete}>Delete selected</button>}
            </BulkActionBar>
            {loading ? <LoadingSpinner /> : (
                <SelectableDataTable columns={columns} data={shifts} readOnly={isReadOnly}
                    selectedIds={bulk.selectedIds} onToggleOne={bulk.toggleOne} onToggleAll={bulk.toggleAll} />
            )}
            <ConfirmModal show={confirmState.open} title={confirmState.title} message={confirmState.message} onConfirm={confirm} onClose={close} />
            <BootstrapModal show={modalOpen} title={editId ? "Edit Shift" : "Add Shift"} onClose={closeModal}
                footer={<><button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>{editId ? "Update" : "Save"}</button></>}>
                <div className="mb-3">
                    <label className="form-label">Shift Name</label>
                    <input className={`form-control ${getFieldError(fieldErrors, "shiftName") ? "is-invalid" : ""}`} name="shiftName" value={form.shiftName} onChange={handleChange} />
                    <FieldError error={getFieldError(fieldErrors, "shiftName")} />
                </div>
                <div className="row">
                    <div className="col-6 mb-3">
                        <label className="form-label">Start Time</label>
                        <input type="time" className="form-control" name="startTime" value={form.startTime} onChange={handleChange} />
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label">End Time</label>
                        <input type="time" className="form-control" name="endTime" value={form.endTime} onChange={handleChange} />
                    </div>
                </div>
            </BootstrapModal>
        </div>
    );
}

export default ShiftPage;
