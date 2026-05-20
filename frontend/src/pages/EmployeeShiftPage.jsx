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
import { ROLES } from "../utils/roleConfig";
import { useAuth } from "../context/AuthContext";
import { useBulkSelection } from "../hooks/useBulkSelection";
import { useConfirmDelete } from "../hooks/useConfirmDelete";
import { useCrudHandlers } from "../hooks/useCrudHandlers";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { usePermissions } from "../hooks/usePermissions";
import { employeeService } from "../services/employeeService";
import { employeeShiftService } from "../services/employeeShiftService";
import { shiftService } from "../services/shiftService";
import { getFieldError } from "../utils/validationErrors";

const emptyForm = { employeeId: "", shiftId: "", assignDate: "" };

function EmployeeShiftPage() {
    const { user } = useAuth();
    const { isReadOnly, role, employeeId: myEmployeeId } = usePermissions();
    const { toast, handleError } = useCrudHandlers();
    const bulk = useBulkSelection("id");
    const { confirmState, requestDelete, close, confirm } = useConfirmDelete();

    const [records, setRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [fieldErrors, setFieldErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
    const [bulkForm, setBulkForm] = useState({ shiftId: "", assignDate: "" });
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword);

    const isOperator = role === ROLES.OPERATOR;

    const loadDropdowns = useCallback(async () => {
        try {
            const [empRes, shiftRes] = await Promise.all([
                isOperator ? Promise.resolve({ data: [] }) : employeeService.getAll(),
                shiftService.getAll(),
            ]);
            if (!isOperator) setEmployees(empRes.data);
            setShifts(shiftRes.data);
        } catch (err) {
            setError(err.message || "Failed to load options");
        }
    }, [isOperator]);

    const loadRecords = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            let response;
            if (isOperator && myEmployeeId) {
                response = await employeeShiftService.getByEmployeeId(myEmployeeId);
            } else if (debouncedKeyword.trim()) {
                response = await employeeShiftService.search(debouncedKeyword.trim());
            } else {
                response = await employeeShiftService.getAll();
            }
            setRecords(response.data);
        } catch (err) {
            setError(err.message || "Failed to load assignments");
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword, isOperator, myEmployeeId]);

    useEffect(() => {
        loadDropdowns();
    }, [loadDropdowns]);

    useEffect(() => {
        loadRecords();
    }, [loadRecords]);

    const openModal = (row = null) => {
        setFieldErrors({});
        setEditId(row?.id ?? null);
        setForm(
            row
                ? {
                      employeeId: row.employeeId || "",
                      shiftId: row.shiftId || "",
                      assignDate: row.assignDate || "",
                  }
                : {
                      ...emptyForm,
                      employeeId: isOperator ? String(myEmployeeId || "") : "",
                      assignDate: new Date().toISOString().slice(0, 10),
                  }
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditId(null);
        setForm({ ...emptyForm });
        setFieldErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.employeeId || !form.shiftId || !form.assignDate) {
            setError("Employee, shift, and assign date are required.");
            return;
        }
        try {
            setFieldErrors({});
            setError("");
            if (editId) {
                await employeeShiftService.update(editId, {
                    employeeId: Number(form.employeeId),
                    shiftId: Number(form.shiftId),
                    assignDate: form.assignDate,
                });
                toast.success("Assignment updated.");
            } else {
                await employeeShiftService.create({
                    employee: { id: Number(form.employeeId) },
                    shift: { id: Number(form.shiftId) },
                    assignDate: form.assignDate,
                });
                toast.success("Assignment created.");
            }
            closeModal();
            await loadRecords();
        } catch (err) {
            handleError(err, setFieldErrors, setError);
        }
    };

    const deleteOne = (id) => {
        requestDelete({
            message: "Delete this shift assignment?",
            onConfirm: async () => {
                await employeeShiftService.remove(id);
                toast.success("Assignment deleted.");
                await loadRecords();
            },
        });
    };

    const bulkDelete = () => {
        requestDelete({
            title: "Delete selected",
            message: `Delete ${bulk.count} assignment(s)?`,
            onConfirm: async () => {
                await Promise.all(bulk.selectedIds.map((id) => employeeShiftService.remove(id)));
                toast.success(`${bulk.count} assignment(s) deleted.`);
                bulk.clear();
                await loadRecords();
            },
        });
    };

    const openBulkAssign = async () => {
        if (!employees.length) {
            const res = await employeeService.getAll();
            setEmployees(res.data);
        }
        setBulkForm({ shiftId: "", assignDate: new Date().toISOString().slice(0, 10) });
        setBulkModalOpen(true);
    };

    const handleBulkAssign = async () => {
        if (!bulkForm.shiftId || !bulkForm.assignDate) {
            setError("Select shift and date for bulk assignment.");
            return;
        }
        const selectedEmployees = bulk.selectedRows(
            employees.map((e) => ({ ...e, id: e.id }))
        );
        const empIds =
            selectedEmployees.length > 0
                ? selectedEmployees.map((e) => e.id)
                : bulk.selectedIds;

        if (!empIds.length) {
            setError("Select employees from the table or employee list.");
            return;
        }
        try {
            await Promise.all(
                empIds.map((empId) =>
                    employeeShiftService.create({
                        employee: { id: Number(empId) },
                        shift: { id: Number(bulkForm.shiftId) },
                        assignDate: bulkForm.assignDate,
                    })
                )
            );
            toast.success(`Assigned shift to ${empIds.length} employee(s).`);
            setBulkModalOpen(false);
            bulk.clear();
            await loadRecords();
        } catch (err) {
            handleError(err, setFieldErrors, setError);
        }
    };

    const tableColumns = [
        { key: "id", label: "ID" },
        { key: "employeeName", label: "Employee" },
        { key: "shiftName", label: "Shift" },
        { key: "assignDate", label: "Assign Date" },
    ];

    const columns = isReadOnly
        ? tableColumns
        : [
              ...tableColumns,
              {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                      <div className="d-flex gap-1">
                          <button type="button" className="btn btn-sm btn-warning" onClick={() => openModal(row)}>
                              Edit
                          </button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteOne(row.id)}>
                              Delete
                          </button>
                      </div>
                  ),
              },
          ];

    return (
        <div className="fade-in-up">
            <PageToolbar
                title="Employee Shifts"
                subtitle={
                    isOperator
                        ? "Your shift assignments (read-only)"
                        : "Assign employees to shifts"
                }
                searchValue={keyword}
                onSearchChange={setKeyword}
                onAdd={isReadOnly ? undefined : () => openModal()}
                addLabel="Assign Shift"
                readOnly={isReadOnly}
                extraActions={
                    <ExportDropdown
                        filename="employee-shifts"
                        title="Employee Shifts"
                        columns={tableColumns}
                        data={records}
                    />
                }
            />

            <AlertMessage message={error} onClose={() => setError("")} />

            <BulkActionBar count={bulk.count} onClear={bulk.clear}>
                {!isReadOnly && (
                    <>
                        <button type="button" className="btn btn-sm btn-primary" onClick={openBulkAssign}>
                            Bulk assign shift
                        </button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={bulkDelete}>
                            Delete selected
                        </button>
                    </>
                )}
            </BulkActionBar>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <SelectableDataTable
                    columns={columns}
                    data={records}
                    readOnly={isReadOnly}
                    selectedIds={bulk.selectedIds}
                    onToggleOne={bulk.toggleOne}
                    onToggleAll={bulk.toggleAll}
                />
            )}

            <ConfirmModal
                show={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirm}
                onClose={close}
            />

            <BootstrapModal
                show={modalOpen}
                title={editId ? "Edit Assignment" : "New Assignment"}
                onClose={closeModal}
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            {editId ? "Update" : "Save"}
                        </button>
                    </>
                }
            >
                <div className="mb-3">
                    <label className="form-label">Employee</label>
                    <select
                        className={`form-select ${getFieldError(fieldErrors, "employee") ? "is-invalid" : ""}`}
                        name="employeeId"
                        value={form.employeeId}
                        onChange={handleChange}
                        disabled={isOperator}
                    >
                        <option value="">Select employee</option>
                        {(isOperator
                            ? [{ id: myEmployeeId, employeeName: user?.username || "Me" }]
                            : employees
                        ).map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.employeeName} {e.employeeCode ? `(${e.employeeCode})` : ""}
                            </option>
                        ))}
                    </select>
                    <FieldError error={getFieldError(fieldErrors, "employee")} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Shift</label>
                    <select
                        className={`form-select ${getFieldError(fieldErrors, "shift") ? "is-invalid" : ""}`}
                        name="shiftId"
                        value={form.shiftId}
                        onChange={handleChange}
                    >
                        <option value="">Select shift</option>
                        {shifts.map((s) => (
                            <option key={s.id} value={s.id}>{s.shiftName}</option>
                        ))}
                    </select>
                    <FieldError error={getFieldError(fieldErrors, "shift")} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Assign Date</label>
                    <input
                        type="date"
                        className={`form-control ${getFieldError(fieldErrors, "assignDate") ? "is-invalid" : ""}`}
                        name="assignDate"
                        value={form.assignDate}
                        onChange={handleChange}
                    />
                    <FieldError error={getFieldError(fieldErrors, "assignDate")} />
                </div>
            </BootstrapModal>

            <BootstrapModal
                show={bulkModalOpen}
                title="Bulk assign shift"
                onClose={() => setBulkModalOpen(false)}
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setBulkModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleBulkAssign}>
                            Assign
                        </button>
                    </>
                }
            >
                <p className="small text-muted">
                    Assigns the same shift and date to all selected rows ({bulk.count} selected), or select employees below.
                </p>
                <div className="mb-3">
                    <label className="form-label">Shift</label>
                    <select
                        className="form-select"
                        value={bulkForm.shiftId}
                        onChange={(e) => setBulkForm((p) => ({ ...p, shiftId: e.target.value }))}
                    >
                        <option value="">Select shift</option>
                        {shifts.map((s) => (
                            <option key={s.id} value={s.id}>{s.shiftName}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Assign date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={bulkForm.assignDate}
                        onChange={(e) => setBulkForm((p) => ({ ...p, assignDate: e.target.value }))}
                    />
                </div>
                <div className="mb-0">
                    <label className="form-label">Or pick employees</label>
                    <select
                        multiple
                        className="form-select"
                        size={5}
                        value={bulk.selectedIds.map(String)}
                        onChange={(e) => {
                            const ids = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
                            bulk.setSelectedIds(ids);
                        }}
                    >
                        {employees.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.employeeName}
                            </option>
                        ))}
                    </select>
                </div>
            </BootstrapModal>
        </div>
    );
}

export default EmployeeShiftPage;
