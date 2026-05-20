import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API = "http://localhost:8080";

const emptyForm = {
    employeeId: "",
    shiftId: "",
    assignDate: "",
};

function EmployeeShiftPage() {

    const [records, setRecords] = useState([]);

    const [employees, setEmployees] = useState([]);

    const [shifts, setShifts] = useState([]);

    const [form, setForm] = useState(emptyForm);

    const [keyword, setKeyword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [editId, setEditId] = useState(null);

    // =========================================
    // LOAD DROPDOWNS
    // =========================================

    const loadDropdowns = useCallback(async () => {

        try {

            const [empRes, shiftRes] = await Promise.all([

                axios.get(API + "/employees"),

                axios.get(API + "/shift")

            ]);

            setEmployees(empRes.data);

            setShifts(shiftRes.data);

        } catch (err) {

            console.error(err);

            setError("Failed to load dropdowns");

        }

    }, []);

    // =========================================
    // LOAD RECORDS
    // =========================================

    const loadRecords = useCallback(async () => {

        try {

            setLoading(true);

            setError("");

            const response = keyword.trim()

                ? await axios.get(
                    API + "/employeeShift/search?keyword=" + keyword
                )

                : await axios.get(
                    API + "/employeeShift"
                );

            setRecords(response.data);

        } catch (err) {

            console.error(err);

            setError("Failed to load records");

        } finally {

            setLoading(false);

        }

    }, [keyword]);

    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        loadDropdowns();

    }, [loadDropdowns]);

    useEffect(() => {

        loadRecords();

    }, [loadRecords]);

    // =========================================
    // HANDLE CHANGE
    // =========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================================
    // OPEN MODAL
    // =========================================

    const openModal = (row = null) => {

        if (row) {

            setEditId(row.id);

            setForm({

                employeeId: row.employeeId || "",

                shiftId: row.shiftId || "",

                assignDate: row.assignDate || "",

            });

        } else {

            setEditId(null);

            setForm({

                employeeId: "",

                shiftId: "",

                assignDate: new Date()
                    .toISOString()
                    .slice(0, 10),

            });
        }

        const modal = new window.bootstrap.Modal(
            document.getElementById("shiftModal")
        );

        modal.show();
    };

    // =========================================
    // CLOSE MODAL
    // =========================================

    const closeModal = () => {

        const modalEl =
            document.getElementById("shiftModal");

        const modal =
            window.bootstrap.Modal.getInstance(modalEl);

        if (modal) {

            modal.hide();
        }

        setForm(emptyForm);

        setEditId(null);
    };

    // =========================================
    // SAVE
    // =========================================

    const handleSave = async () => {

        if (
            !form.employeeId ||
            !form.shiftId ||
            !form.assignDate
        ) {

            alert("All fields are required");

            return;
        }

        try {

            const payload = {

                employee: {
                    id: Number(form.employeeId)
                },

                shift: {
                    id: Number(form.shiftId)
                },

                assignDate: form.assignDate

            };

            if (editId) {

                await axios.put(

                    API + "/employeeShift/" + editId,

                    payload

                );

            } else {

                await axios.post(

                    API + "/employeeShift",

                    payload

                );
            }

            closeModal();

            loadRecords();

        } catch (err) {

            console.error(err);

            alert("Save failed");

        }
    };

    // =========================================
    // DELETE
    // =========================================

    const deleteRecord = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this assignment?"
        );

        if (!confirmDelete) return;

        try {

            await axios.delete(
                API + "/employeeShift/" + id
            );

            loadRecords();

        } catch (err) {

            console.error(err);

            alert("Delete failed");

        }
    };

    // =========================================
    // FILTERED RECORDS
    // =========================================

    const filteredRecords = records.filter((row) =>

        row.employeeName
            ?.toLowerCase()
            .includes(keyword.toLowerCase())

        ||

        row.shiftName
            ?.toLowerCase()
            .includes(keyword.toLowerCase())

    );

    // =========================================
    // UI
    // =========================================

    return (

        <div className="container-fluid mt-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Employee Shifts
                    </h2>

                    <p className="text-muted">
                        Assign employees to shifts
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => openModal()}
                >
                    + Assign Shift
                </button>

            </div>

            {/* ERROR */}

            {error && (

                <div className="alert alert-danger">
                    {error}
                </div>

            )}

            {/* SEARCH */}

            <div className="row mb-4">

                <div className="col-md-4">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search employee or shift..."
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                    />

                </div>

            </div>

            {/* TABLE */}

            {loading ? (

                <div className="text-center mt-5">

                    <div className="spinner-border text-primary"></div>

                </div>

            ) : (

                <div className="table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                        <thead className="table-light">

                            <tr>

                                <th>ID</th>

                                <th>Employee</th>

                                <th>Shift</th>

                                <th>Assign Date</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredRecords.map((row) => (

                                <tr key={row.id}>

                                    <td>{row.id}</td>

                                    <td>{row.employeeName}</td>

                                    <td>{row.shiftName}</td>

                                    <td>{row.assignDate}</td>

                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => openModal(row)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteRecord(row.id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            {/* ========================================= */}
            {/* MODAL */}
            {/* ========================================= */}

            <div
                className="modal fade"
                id="shiftModal"
                tabIndex="-1"
            >

                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title">

                                {editId
                                    ? "Edit Assignment"
                                    : "Assign Shift"}

                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            ></button>

                        </div>

                        <div className="modal-body">

                            {/* EMPLOYEE */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Employee
                                </label>

                                <select
                                    className="form-select"
                                    name="employeeId"
                                    value={form.employeeId}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Employee
                                    </option>

                                    {employees.map((e) => (

                                        <option
                                            key={e.id}
                                            value={e.id}
                                        >
                                            {e.employeeName}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* SHIFT */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Shift
                                </label>

                                <select
                                    className="form-select"
                                    name="shiftId"
                                    value={form.shiftId}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Shift
                                    </option>

                                    {shifts.map((s) => (

                                        <option
                                            key={s.id}
                                            value={s.id}
                                        >
                                            {s.shiftName}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* DATE */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Assign Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="assignDate"
                                    value={form.assignDate}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSave}
                            >
                                {editId
                                    ? "Update"
                                    : "Save"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EmployeeShiftPage;

