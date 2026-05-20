import { useCallback, useEffect, useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import BootstrapModal from "../components/common/BootstrapModal";
import BulkActionBar from "../components/common/BulkActionBar";
import ConfirmModal from "../components/common/ConfirmModal";
import ExportDropdown from "../components/common/ExportDropdown";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PageToolbar from "../components/common/PageToolbar";
import SelectableDataTable from "../components/common/SelectableDataTable";
import { useBulkSelection } from "../hooks/useBulkSelection";
import { useConfirmDelete } from "../hooks/useConfirmDelete";
import { useCrudHandlers } from "../hooks/useCrudHandlers";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { usePermissions } from "../hooks/usePermissions";
import { employeeService } from "../services/employeeService";
import { stationService } from "../services/stationService";
import { unitService } from "../services/unitService";
import { getErrorMessage } from "../utils/errorUtils";

const initialEmployee = {
    employeeCode: "",
    employeeName: "",
    department: "",
    role: "",
    phone: "",
    email: "",
    station: { stationId: "" },
    unit: { unitId: "" },
};

function EmployeePage() {
    const { isReadOnly } = usePermissions();
    const { toast, handleError } = useCrudHandlers();
    const bulk = useBulkSelection("id");
    const { confirmState, requestDelete, close, confirm } = useConfirmDelete();

    const [employees, setEmployees] = useState([]);
    const [, setFieldErrors] = useState({});
    const [employeeId, setEmployeeId] = useState(null);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [stations, setStations] = useState([]);
    const [units, setUnits] = useState([]);
    const [stationFilter, setStationFilter] = useState("");
    const [unitFilter, setUnitFilter] = useState("");
    const [filterUnits, setFilterUnits] = useState([]);
    const [employee, setEmployee] = useState(initialEmployee);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword);

    const loadEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            let response;

            if (debouncedKeyword.trim()) {
                response = await employeeService.search(debouncedKeyword.trim());
                const data = response.data.filter((emp) => {
                    const stationMatches = stationFilter ? String(emp.stationId) === String(stationFilter) : true;
                    const unitMatches = unitFilter ? String(emp.unitId) === String(unitFilter) : true;
                    return stationMatches && unitMatches;
                });
                setEmployees(data);
                return;
            }

            if (unitFilter) {
                response = await employeeService.getByUnitId(unitFilter);
            } else if (stationFilter) {
                response = await employeeService.getByStationId(stationFilter);
            } else {
                response = await employeeService.getAll();
            }

            setEmployees(response.data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword, stationFilter, unitFilter]);

    const loadStations = useCallback(async () => {
        try {
            const response = await stationService.getAll();
            setStations(response.data);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }, []);

    const loadUnitsByStation = useCallback(async (stationId) => {
        if (!stationId) {
            setUnits([]);
            return;
        }
        try {
            const response = await unitService.getByStationId(stationId);
            setUnits(response.data);
        } catch (err) {
            setUnits([]);
            setError(getErrorMessage(err));
        }
    }, []);

    const loadFilterUnits = useCallback(async (stationId) => {
        try {
            const response = stationId
                ? await unitService.getByStationId(stationId)
                : await unitService.getAll();
            setFilterUnits(response.data);
        } catch (err) {
            setFilterUnits([]);
            setError(getErrorMessage(err));
        }
    }, []);

    useEffect(() => {
        loadStations();
        loadFilterUnits("");
    }, [loadStations, loadFilterUnits]);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const resetEmployee = () => {
        setEmployee(initialEmployee);
        setEmployeeId(null);
        setUnits([]);
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "stationId") {
            setEmployee((current) => ({
                ...current,
                station: { stationId: value },
                unit: { unitId: "" },
            }));
            await loadUnitsByStation(value);
            return;
        }

        if (name === "unitId") {
            setEmployee((current) => ({
                ...current,
                unit: { unitId: value },
            }));
            return;
        }

        setEmployee((current) => ({ ...current, [name]: value }));
    };

    const handleStationFilterChange = async (value) => {
        setStationFilter(value);
        setUnitFilter("");
        await loadFilterUnits(value);
    };

    const validateEmployee = () => {
        if (!employee.station.stationId) return "Please select a station.";
        if (!employee.unit.unitId) return "Please select a unit.";
        return "";
    };

    const toCreatePayload = () => ({
        ...employee,
        station: { stationId: Number(employee.station.stationId) },
        unit: { unitId: Number(employee.unit.unitId) },
    });

    const toUpdatePayload = () => ({
        employeeCode: employee.employeeCode,
        employeeName: employee.employeeName,
        department: employee.department,
        role: employee.role,
        phone: employee.phone,
        email: employee.email,
        stationId: Number(employee.station.stationId),
        unitId: Number(employee.unit.unitId),
    });

    const saveEmployee = async () => {
        const validationError = validateEmployee();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            setError("");
            await employeeService.create(toCreatePayload());
            toast.success("Employee added successfully.");
            await loadEmployees();
            setAddModal(false);
            resetEmployee();
        } catch (err) {
            handleError(err, setFieldErrors, setError);
        }
    };

    const updateEmployee = async () => {
        const validationError = validateEmployee();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            setError("");
            await employeeService.update(employeeId, toUpdatePayload());
            toast.success("Employee updated successfully.");
            await loadEmployees();
            setEditModal(false);
            resetEmployee();
        } catch (err) {
            handleError(err, setFieldErrors, setError);
        }
    };

    const deleteEmployee = (id) => {
        requestDelete({
            message: "Delete this employee?",
            onConfirm: async () => {
                await employeeService.remove(id);
                toast.success("Employee deleted.");
                await loadEmployees();
            },
        });
    };

    const bulkDelete = () => {
        requestDelete({
            title: "Delete selected",
            message: `Delete ${bulk.count} employee(s)?`,
            onConfirm: async () => {
                await Promise.all(bulk.selectedIds.map((id) => employeeService.remove(id)));
                toast.success(`${bulk.count} employee(s) deleted.`);
                bulk.clear();
                await loadEmployees();
            },
        });
    };

    const editEmployee = async (emp) => {
        setError("");
        setEmployee({
            employeeCode: emp.employeeCode || "",
            employeeName: emp.employeeName || "",
            department: emp.department || "",
            role: emp.role || "",
            phone: emp.phone || "",
            email: emp.email || "",
            station: { stationId: emp.stationId || "" },
            unit: { unitId: emp.unitId || "" },
        });
        setEmployeeId(emp.id);
        await loadUnitsByStation(emp.stationId);
        setEditModal(true);
    };

    const renderEmployeeForm = () => (
        <>
            <div className="mb-3">
                <input type="text" name="employeeCode" placeholder="Employee Code" className="form-control" value={employee.employeeCode} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <input type="text" name="employeeName" placeholder="Employee Name" className="form-control" value={employee.employeeName} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <input type="text" name="department" placeholder="Department" className="form-control" value={employee.department} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <input type="text" name="role" placeholder="Role" className="form-control" value={employee.role} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <input type="text" name="phone" placeholder="Phone" className="form-control" value={employee.phone} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <input type="email" name="email" placeholder="Email" className="form-control" value={employee.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <select name="stationId" value={employee.station.stationId} className="form-select" onChange={handleChange}>
                    <option value="">Select a station</option>
                    {stations.map((station) => (
                        <option key={station.stationId} value={station.stationId}>{station.stationName}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <select name="unitId" value={employee.unit.unitId} className="form-select" onChange={handleChange} disabled={!employee.station.stationId}>
                    <option value="">Select a unit</option>
                    {units.map((unit) => (
                        <option key={unit.unitId} value={unit.unitId}>{unit.unitName}</option>
                    ))}
                </select>
            </div>
        </>
    );

    const tableColumns = [
        { key: "id", label: "ID" },
        { key: "employeeCode", label: "Code" },
        { key: "employeeName", label: "Name" },
        { key: "department", label: "Department" },
        { key: "stationName", label: "Station" },
        { key: "unitName", label: "Unit" },
        { key: "role", label: "Role" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "createdAt", label: "Joined" },
    ];

    const columns = isReadOnly ? tableColumns : [...tableColumns, {
        key: "actions", label: "Actions",
        render: (row) => (
            <div className="d-flex gap-1">
                <button type="button" className="btn btn-sm btn-warning" onClick={() => editEmployee(row)}>Edit</button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteEmployee(row.id)}>Delete</button>
            </div>
        ),
    }];

    const modalFooter = (onSave, saveLabel) => (
        <>
            <button type="button" className="btn btn-secondary" onClick={() => { setAddModal(false); setEditModal(false); resetEmployee(); }}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onSave}>{saveLabel}</button>
        </>
    );

    return (
        <div className="fade-in-up">
            <PageToolbar
                title="Employees"
                subtitle="Plant workforce records"
                searchValue={keyword}
                onSearchChange={setKeyword}
                onAdd={isReadOnly ? undefined : () => { resetEmployee(); setAddModal(true); }}
                addLabel="Add Employee"
                readOnly={isReadOnly}
                extraActions={<ExportDropdown filename="employees" title="Employees" columns={tableColumns} data={employees} />}
                filterSlotClassName="col-md-6 col-lg-6"
                filterSlot={
                    <div className="row g-2">
                        <div className="col-md-6">
                            <select className="form-select" value={stationFilter} onChange={(e) => handleStationFilterChange(e.target.value)}>
                                <option value="">All Stations</option>
                                {stations.map((station) => (
                                    <option key={station.stationId} value={station.stationId}>{station.stationName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <select className="form-select" value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)}>
                                <option value="">All Units</option>
                                {filterUnits.map((unit) => (
                                    <option key={unit.unitId} value={unit.unitId}>{unit.unitName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                }
            />

            <AlertMessage message={error} onClose={() => setError("")} />

            <BulkActionBar count={bulk.count} onClear={bulk.clear}>
                {!isReadOnly && (
                    <button type="button" className="btn btn-sm btn-danger" onClick={bulkDelete}>Delete selected</button>
                )}
            </BulkActionBar>

            {loading ? <LoadingSpinner /> : (
                <SelectableDataTable columns={columns} data={employees} readOnly={isReadOnly}
                    selectedIds={bulk.selectedIds} onToggleOne={bulk.toggleOne} onToggleAll={bulk.toggleAll} />
            )}

            <ConfirmModal show={confirmState.open} title={confirmState.title} message={confirmState.message} onConfirm={confirm} onClose={close} />

            <BootstrapModal
                show={addModal}
                title="Add Employee"
                onClose={() => { setAddModal(false); resetEmployee(); }}
                footer={modalFooter(saveEmployee, "Add")}
            >
                {renderEmployeeForm()}
            </BootstrapModal>

            <BootstrapModal
                show={editModal}
                title="Edit Employee"
                onClose={() => { setEditModal(false); resetEmployee(); }}
                footer={modalFooter(updateEmployee, "Update")}
            >
                {renderEmployeeForm()}
            </BootstrapModal>
        </div>
    );
}

export default EmployeePage;
