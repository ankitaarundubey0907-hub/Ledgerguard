// 


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tenants from "./pages/Tenants";
import Invoices from "./pages/Invoices";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Employees from "./pages/Employees";
import Payment from "./pages/Payment";
import AuditLogs from "./pages/AuditLogs";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={
            token
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            token
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Other pages */}
        <Route
          path="/tenants"
          element={
            token
              ? <Tenants />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/invoices"
          element={
            token
              ? <Invoices />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/transactions"
          element={
            token
              ? <Transactions />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/employees"
          element={
            token
              ? <Employees />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/analytics"
          element={
            token
              ? <Analytics />
              : <Navigate to="/login" replace />
          }
        />

         <Route path="/payments" element={<Payment />} />
         <Route
  path="/audit-logs"
  element={<AuditLogs />}
/>
        <Route
          path="/settings"
          element={
            token
              ? <Settings />
              : <Navigate to="/login" replace />
          }
        />

         <Route
  path="/payments"
  element={<Payment />}
/>

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;