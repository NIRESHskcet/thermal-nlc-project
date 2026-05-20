import { useCallback, useEffect, useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import BootstrapModal from "../components/common/BootstrapModal";
import DataTable from "../components/common/DataTable";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PageToolbar from "../components/common/PageToolbar";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { employeeService } from "../services/employeeService";
import { usersService } from "../services/usersService";
import ConfirmModal from "../components/common/ConfirmModal";
import ExportDropdown from "../components/common/ExportDropdown";
import { useConfirmDelete } from "../hooks/useConfirmDelete";
import { useCrudHandlers } from "../hooks/useCrudHandlers";
import { usePermissions } from "../hooks/usePermissions";
import { getErrorMessage } from "../utils/errorUtils";

const ROLES = ["OPERATOR", "ADMIN", "HR"];

const emptyUser = {
    employeeId: "",
    username: "",
    email: "",
    password: "",
    role: "OPERATOR",
};

function UsersPage() {
    const { isReadOnly } = usePermissions();
    const { toast } = useCrudHandlers();
    const { confirmState, requestDelete, close, confirm } = useConfirmDelete();

    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState(emptyUser);
    const [editId, setEditId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedKeyword = useDebouncedValue(keyword);

    const loadEmployees = useCallback(async () => {
        try {
            const response = await employeeService.getAll();
            setEmployees(response.data);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            let response;
            if (roleFilter) {
                response = await usersService.getByRole(roleFilter);
            } else if (debouncedKeyword.trim()) {
                response = await usersService.search(debouncedKeyword.trim());
            } else {
                response = await usersService.getAll();
            }
            setUsers(response.data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword, roleFilter]);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const openModal = (user = null) => {
        setEditId(user?.id ?? null);
        setForm(
            user
                ? {
                      employeeId: user.employeeId || user.EmployeeId || "",
                      username: user.username || "",
                      email: user.email || "",
                      password: "",
                      role: user.role || "OPERATOR",
                  }
                : { ...emptyUser }
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditId(null);
        setForm({ ...emptyUser });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.employeeId || !form.username || !form.role) {
            setError("Employee, username, and role are required.");
            return;
        }
        try {
            setError("");
            if (editId) {
                await usersService.update(editId, {
                    employeeId: Number(form.employeeId),
                    username: form.username,
                    role: form.role,
                });
                toast.success("User updated successfully.");
            } else {
                if (!form.password) {
                    setError("Password is required for new users.");
                    return;
                }
                await usersService.create({
                    employee: { id: Number(form.employeeId) },
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                });
                toast.success("User created successfully.");
            }
            closeModal();
            await loadUsers();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const handleDelete = async (id) => {
        requestDelete({
            message: "Delete this user?",
            onConfirm: async () => {
                await usersService.remove(id);
                toast.success("User deleted.");
                await loadUsers();
            },
        });
    };

    const employeeName = (employeeId) => {
        const emp = employees.find((e) => e.id === employeeId);
        return emp ? emp.employeeName : employeeId;
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "username", label: "Username" },
        {
            key: "employeeId",
            label: "Employee",
            render: (row) => row.employeeName || employeeName(row.employeeId ?? row.EmployeeId),
        },
        { key: "role", label: "Role" },
        { key: "createdAt", label: "Created At" },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <div className="d-flex gap-1">
                    <button type="button" className="btn btn-sm btn-warning" onClick={() => openModal(row)}>Edit</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id)}>Delete</button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <PageToolbar
                title="Users"
                subtitle="System user accounts"
                searchValue={keyword}
                onSearchChange={setKeyword}
                onAdd={isReadOnly ? undefined : () => openModal()}
                addLabel="Add User"
                readOnly={isReadOnly}
                extraActions={
                    <ExportDropdown filename="users" title="Users" columns={columns.filter((c) => c.key !== "actions")} data={users} />
                }
                filterSlot={
                    <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="">All Roles</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                }
            />

            <AlertMessage message={error} onClose={() => setError("")} />
            <ConfirmModal show={confirmState.open} title={confirmState.title} message={confirmState.message} onConfirm={confirm} onClose={close} />

            {loading ? <LoadingSpinner /> : <DataTable columns={columns} data={users} />}

            <BootstrapModal
                show={modalOpen}
                title={editId ? "Edit User" : "Add User"}
                onClose={closeModal}
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>{editId ? "Update" : "Save"}</button>
                    </>
                }
            >
                <div className="mb-3">
                    <label className="form-label">Employee</label>
                    <select className="form-select" name="employeeId" value={form.employeeId} onChange={handleChange}>
                        <option value="">Select employee</option>
                        {employees.map((e) => (
                            <option key={e.id} value={e.id}>{e.employeeName}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input className="form-control" name="username" value={form.username} onChange={handleChange} />
                </div>
                {!editId && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} />
                        </div>
                    </>
                )}
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </BootstrapModal>
        </div>
    );
}

export default UsersPage;
