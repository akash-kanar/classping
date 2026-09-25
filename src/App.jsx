import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider

import Login from "./auth/Login";
import Register from "./auth/Register";
import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import PushNotificationListener from "./components/PushNotificationListener";

const App = () => {
  return (
    <>
      <ThemeProvider>
        <PushNotificationListener />
        {/* Wrap everything with ThemeProvider */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/auth/sign-up"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={<Navigate to="/dashboard/profile" replace />}
            />
            <Route
              path="/settings"
              element={<Navigate to="/dashboard/settings" replace />}
            />
            <Route
              path="/timetable/upload"
              element={<Navigate to="/dashboard/timetable/upload" replace />}
            />
            <Route
              path="/timetable/preview"
              element={<Navigate to="/dashboard/timetable/preview" replace />}
            />
            <Route
              path="/timetable/result"
              element={<Navigate to="/dashboard/timetable/result" replace />}
            />
            <Route
              path="/timetable/review"
              element={<Navigate to="/dashboard/timetable/preview" replace />}
            />

            <Route
              path="/holiday/upload"
              element={<Navigate to="/dashboard/holiday/upload" replace />}
            />
            <Route
              path="/holiday/review"
              element={<Navigate to="/dashboard/holiday/review" replace />}
            />

            <Route
              path="holiday/view"
              element={<Navigate to="/dashboard/holiday/view" replace />}
            />

            <Route
              path="/storage"
              element={<Navigate to="/dashboard/storage" replace />}
            />

            <Route
              path="/storage/timetable"
              element={<Navigate to="/dashboard/storage/timetable" replace />}
            />

            <Route
              path="/storage/holiday"
              element={<Navigate to="/dashboard/storage/holiday" replace />}
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;
