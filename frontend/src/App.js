import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import AdminLayout from "./components/layout/AdminLayout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";
import EmployeeShiftPage from "./pages/EmployeeShiftPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import ShiftPage from "./pages/ShiftPage";
import StationPage from "./pages/StationPage";
import UnitPage from "./pages/UnitPage";
import UsersPage from "./pages/UsersPage";

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route element={<ProtectedRoute />}>
                                <Route element={<AdminLayout />}>
                                    <Route element={<RoleRoute />}>
                                        <Route index element={<DashboardPage />} />
                                        <Route path="employees" element={<EmployeePage />} />
                                        <Route path="stations" element={<StationPage />} />
                                        <Route path="units" element={<UnitPage />} />
                                        <Route path="shifts" element={<ShiftPage />} />
                                        <Route path="employee-shifts" element={<EmployeeShiftPage />} />
                                        <Route path="users" element={<UsersPage />} />
                                        <Route path="reports" element={<ReportsPage />} />
                                        <Route path="profile" element={<ProfilePage />} />
                                    </Route>
                                </Route>
                            </Route>
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
