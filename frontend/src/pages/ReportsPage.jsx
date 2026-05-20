import { useCallback, useEffect, useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import ExportDropdown from "../components/common/ExportDropdown";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { employeeService } from "../services/employeeService";
import { employeeShiftService } from "../services/employeeShiftService";
import { stationService } from "../services/stationService";
import { getErrorMessage } from "../utils/errorUtils";
import { printHtmlReport } from "../utils/exportUtils";

function ReportsPage() {
    const [tab, setTab] = useState("roster");
    const [rosterDate, setRosterDate] = useState(new Date().toISOString().slice(0, 10));
    const [roster, setRoster] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [stations, setStations] = useState([]);
    const [deptFilter, setDeptFilter] = useState("");
    const [stationFilter, setStationFilter] = useState("");
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword);

    const loadRoster = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const res = await employeeShiftService.getAll();
            const filtered = res.data.filter((r) => r.assignDate === rosterDate);
            setRoster(filtered);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [rosterDate]);

    const loadEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            let data;
            if (debouncedKeyword.trim()) {
                const res = await employeeService.search(debouncedKeyword.trim());
                data = res.data;
            } else if (stationFilter) {
                const res = await employeeService.getByStationId(stationFilter);
                data = res.data;
            } else {
                const res = await employeeService.getAll();
                data = res.data;
            }
            if (deptFilter) {
                data = data.filter((e) => e.department === deptFilter);
            }
            setEmployees(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword, stationFilter, deptFilter]);

    useEffect(() => {
        stationService.getAll().then((r) => setStations(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (tab === "roster") loadRoster();
        else loadEmployees();
    }, [tab, loadRoster, loadEmployees]);

    const rosterColumns = [
        { key: "employeeName", label: "Employee" },
        { key: "shiftName", label: "Shift" },
        { key: "assignDate", label: "Date" },
    ];

    const employeeColumns = [
        { key: "employeeCode", label: "Code" },
        { key: "employeeName", label: "Name" },
        { key: "department", label: "Department" },
        { key: "stationName", label: "Station" },
        { key: "unitName", label: "Unit" },
        { key: "role", label: "Role" },
    ];

    const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))];

    const printRoster = () => {
        const rows = roster
            .map(
                (r) =>
                    `<tr><td>${r.employeeName}</td><td>${r.shiftName}</td><td>${r.assignDate}</td></tr>`
            )
            .join("");
        const html = `<table><thead><tr><th>Employee</th><th>Shift</th><th>Date</th></tr></thead><tbody>${rows || "<tr><td colspan='3'>No assignments</td></tr>"}</tbody></table>`;
        printHtmlReport(`Shift Roster — ${rosterDate}`, html);
    };

    return (
        <div className="fade-in-up">
            <h2 className="admin-page-title mb-1">Reports</h2>
            <p className="text-muted mb-4">Export and print operational reports</p>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        type="button"
                        className={`nav-link ${tab === "roster" ? "active" : ""}`}
                        onClick={() => setTab("roster")}
                    >
                        Shift roster
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        type="button"
                        className={`nav-link ${tab === "employees" ? "active" : ""}`}
                        onClick={() => setTab("employees")}
                    >
                        Employees by dept / station
                    </button>
                </li>
            </ul>

            <AlertMessage message={error} onClose={() => setError("")} />

            {tab === "roster" && (
                <div className="card profile-card p-3">
                    <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
                        <div>
                            <label className="form-label small">Roster date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={rosterDate}
                                onChange={(e) => setRosterDate(e.target.value)}
                            />
                        </div>
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={loadRoster}>
                            Refresh
                        </button>
                        <ExportDropdown
                            filename={`shift-roster-${rosterDate}`}
                            title={`Shift Roster ${rosterDate}`}
                            columns={rosterColumns}
                            data={roster}
                        />
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={printRoster}>
                            Print roster
                        </button>
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="table-responsive admin-table-wrap">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        {rosterColumns.map((c) => (
                                            <th key={c.key}>{c.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {roster.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted py-4">
                                                No shift assignments for this date.
                                            </td>
                                        </tr>
                                    ) : (
                                        roster.map((r) => (
                                            <tr key={r.id}>
                                                <td>{r.employeeName}</td>
                                                <td>{r.shiftName}</td>
                                                <td>{r.assignDate}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {tab === "employees" && (
                <div className="card profile-card p-3">
                    <div className="row g-2 mb-3">
                        <div className="col-md-4">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search employees..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={stationFilter}
                                onChange={(e) => setStationFilter(e.target.value)}
                            >
                                <option value="">All stations</option>
                                {stations.map((s) => (
                                    <option key={s.stationId} value={s.stationId}>
                                        {s.stationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                            >
                                <option value="">All departments</option>
                                {departments.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-start">
                            <ExportDropdown
                                filename="employees-report"
                                title="Employee Report"
                                columns={employeeColumns}
                                data={employees}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="table-responsive admin-table-wrap">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        {employeeColumns.map((c) => (
                                            <th key={c.key}>{c.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((e) => (
                                        <tr key={e.id}>
                                            <td>{e.employeeCode}</td>
                                            <td>{e.employeeName}</td>
                                            <td>{e.department}</td>
                                            <td>{e.stationName}</td>
                                            <td>{e.unitName}</td>
                                            <td>{e.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ReportsPage;
