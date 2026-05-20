import { useEffect, useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import FieldError from "../components/common/FieldError";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCrudHandlers } from "../hooks/useCrudHandlers";
import { authService } from "../services/authService";
import { getFieldError } from "../utils/validationErrors";

function ProfilePage() {
    const { user } = useAuth();
    const toast = useToast();
    const { handleError } = useCrudHandlers();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const res = await authService.getProfile(user.id);
                setProfile(res.data);
            } catch (err) {
                setError(err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user?.id]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setError("");
        if (pwd.newPassword !== pwd.confirm) {
            setError("New passwords do not match.");
            return;
        }
        if (pwd.newPassword.length < 4) {
            setError("New password must be at least 4 characters.");
            return;
        }
        try {
            setSaving(true);
            await authService.changePassword({
                userId: user.id,
                currentPassword: pwd.currentPassword,
                newPassword: pwd.newPassword,
            });
            toast.success("Password updated successfully.");
            setPwd({ currentPassword: "", newPassword: "", confirm: "" });
        } catch (err) {
            handleError(err, setFieldErrors, setError);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading profile..." />;

    return (
        <div className="fade-in-up">
            <h2 className="admin-page-title mb-4">My Profile</h2>
            <AlertMessage message={error} onClose={() => setError("")} />

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card profile-card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Account</h5>
                            <dl className="row mb-0 small">
                                <dt className="col-4 text-muted">Username</dt>
                                <dd className="col-8">{profile?.username}</dd>
                                <dt className="col-4 text-muted">Role</dt>
                                <dd className="col-8">
                                    <span className="admin-user-badge">{profile?.role}</span>
                                </dd>
                            </dl>
                            <hr />
                            <h6 className="text-muted text-uppercase small">Linked employee</h6>
                            <dl className="row mb-0 small">
                                <dt className="col-4 text-muted">Code</dt>
                                <dd className="col-8">{profile?.employeeCode || "—"}</dd>
                                <dt className="col-4 text-muted">Name</dt>
                                <dd className="col-8">{profile?.employeeName || "—"}</dd>
                                <dt className="col-4 text-muted">Department</dt>
                                <dd className="col-8">{profile?.department || "—"}</dd>
                                <dt className="col-4 text-muted">Station</dt>
                                <dd className="col-8">{profile?.stationName || "—"}</dd>
                                <dt className="col-4 text-muted">Unit</dt>
                                <dd className="col-8">{profile?.unitName || "—"}</dd>
                                <dt className="col-4 text-muted">Phone</dt>
                                <dd className="col-8">{profile?.phone || "—"}</dd>
                                <dt className="col-4 text-muted">Email</dt>
                                <dd className="col-8">{profile?.email || "—"}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card profile-card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Change password</h5>
                            <form onSubmit={handlePasswordChange}>
                                <div className="mb-3">
                                    <label className="form-label">Current password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${getFieldError(fieldErrors, "currentPassword") ? "is-invalid" : ""}`}
                                        value={pwd.currentPassword}
                                        onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
                                        required
                                    />
                                    <FieldError error={getFieldError(fieldErrors, "currentPassword")} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${getFieldError(fieldErrors, "newPassword") ? "is-invalid" : ""}`}
                                        value={pwd.newPassword}
                                        onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
                                        required
                                    />
                                    <FieldError error={getFieldError(fieldErrors, "newPassword")} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm new password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={pwd.confirm}
                                        onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? "Saving..." : "Update password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
