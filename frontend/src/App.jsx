
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Tenants from "./pages/Tenants";
import Invoices from "./pages/Invoices";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Employees from "./pages/Employees";
import Notifications from "./pages/Notifications";
import Payment from "./pages/Payment";
import AuditLogs from "./pages/AuditLogs";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================
            DEFAULT
        ======================================== */}

        <Route
          path="/"
          element={
            token
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            AUTHENTICATION
        ======================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ========================================
            DASHBOARD
        ======================================== */}

        <Route
          path="/dashboard"
          element={
            token
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            PROFILE
        ======================================== */}

        <Route
          path="/profile"
          element={
            token
              ? <Profile />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            TENANTS
        ======================================== */}

        <Route
          path="/tenants"
          element={
            token
              ? <Tenants />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            INVOICES
        ======================================== */}

        <Route
          path="/invoices"
          element={
            token
              ? <Invoices />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            TRANSACTIONS
        ======================================== */}

        <Route
          path="/transactions"
          element={
            token
              ? <Transactions />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            EMPLOYEES
        ======================================== */}

        <Route
          path="/employees"
          element={
            token
              ? <Employees />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            ANALYTICS
        ======================================== */}

        <Route
          path="/analytics"
          element={
            token
              ? <Analytics />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            NOTIFICATIONS
        ======================================== */}

        <Route
          path="/notifications"
          element={
            token
              ? <Notifications />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            PAYMENTS
        ======================================== */}

        <Route
          path="/payments"
          element={
            token
              ? <Payment />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            AUDIT LOGS
        ======================================== */}

        <Route
          path="/audit-logs"
          element={
            token
              ? <AuditLogs />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            SETTINGS
        ======================================== */}

        <Route
          path="/settings"
          element={
            token
              ? <Settings />
              : <Navigate to="/login" replace />
          }
        />


        {/* ========================================
            UNKNOWN ROUTE
        ======================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
