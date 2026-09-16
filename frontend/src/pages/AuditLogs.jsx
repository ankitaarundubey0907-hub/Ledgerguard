import { useEffect, useMemo, useState } from "react";
import "./AuditLogs.css";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const token = localStorage.getItem("token");

  // ========================================
  // FETCH AUDIT LOGS
  // ========================================

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/audit-logs/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load audit logs"
        );
      }

      setLogs(data.data || []);
    } catch (err) {
      console.error("Audit log error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    if (token) {
      fetchLogs();
    } else {
      setError("Authentication token not found.");
      setLoading(false);
    }
  }, []);

  // ========================================
  // NORMALIZE ACTION
  // ========================================

  const getAction = (log) => {
    return (
      log.action ||
      log.activity ||
      log.event ||
      "UNKNOWN_ACTION"
    );
  };

  // ========================================
  // MODULE
  // ========================================

  const getModule = (log) => {
    if (log.module) {
      return log.module;
    }

    const action = getAction(log);

    if (action.includes("TRANSACTION")) {
      return "Transactions";
    }

    if (action.includes("LOGIN")) {
      return "Authentication";
    }

    if (action.includes("USER")) {
      return "Users";
    }

    if (action.includes("EMPLOYEE")) {
      return "Employees";
    }

    if (action.includes("PAYMENT")) {
      return "Payments";
    }

    return "System";
  };

  // ========================================
  // DESCRIPTION
  // ========================================

  const getDescription = (log) => {
    return (
      log.description ||
      log.message ||
      `${getAction(log)
        .replaceAll("_", " ")
        .toLowerCase()} performed`
    );
  };

  // ========================================
  // DATE FORMAT
  // ========================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ========================================
  // ACTION CLASS
  // ========================================

  const getActionClass = (action) => {
    const value = action.toUpperCase();

    if (
      value.includes("CREATE") ||
      value.includes("LOGIN") ||
      value.includes("SUCCESS")
    ) {
      return "audit-success";
    }

    if (
      value.includes("DELETE") ||
      value.includes("FAILED") ||
      value.includes("SECURITY")
    ) {
      return "audit-danger";
    }

    if (
      value.includes("UPDATE") ||
      value.includes("EDIT")
    ) {
      return "audit-warning";
    }

    return "audit-info";
  };

  // ========================================
  // FILTER LOGS
  // ========================================

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const action = getAction(log).toLowerCase();
      const module = getModule(log).toLowerCase();
      const description = getDescription(log).toLowerCase();

      const searchValue = search.toLowerCase();

      const matchesSearch =
        action.includes(searchValue) ||
        module.includes(searchValue) ||
        description.includes(searchValue);

      const matchesFilter =
        filter === "ALL" ||
        getAction(log).toUpperCase() === filter;

      return matchesSearch && matchesFilter;
    });
  }, [logs, search, filter]);

  // ========================================
  // STATISTICS
  // ========================================

  const totalActivities = logs.length;

  const createLoginCount = logs.filter((log) => {
    const action = getAction(log).toUpperCase();

    return (
      action.includes("CREATE") ||
      action.includes("LOGIN")
    );
  }).length;

  const updateCount = logs.filter((log) => {
    const action = getAction(log).toUpperCase();

    return (
      action.includes("UPDATE") ||
      action.includes("EDIT")
    );
  }).length;

  const securityCount = logs.filter((log) => {
    const action = getAction(log).toUpperCase();

    return (
      action.includes("SECURITY") ||
      action.includes("DELETE") ||
      action.includes("FAILED")
    );
  }).length;

  // ========================================
  // UNIQUE ACTIONS
  // ========================================

  const actionOptions = [
    ...new Set(
      logs.map((log) =>
        getAction(log).toUpperCase()
      )
    ),
  ];

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="audit-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="audit-header">

        <div>
          <h1>Audit Logs</h1>

          <p>
            Track financial activity and system actions
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchLogs}
          disabled={loading}
        >
          ↻ {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>


      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="audit-summary">

        <div className="audit-summary-card green">

          <span>Total Activities</span>

          <strong>
            {loading ? "—" : totalActivities}
          </strong>

          <small>
            Recorded system activities
          </small>

        </div>


        <div className="audit-summary-card red">

          <span>Create / Login</span>

          <strong>
            {loading ? "—" : createLoginCount}
          </strong>

          <small>
            Successful activities
          </small>

        </div>


        <div className="audit-summary-card purple">

          <span>Updates</span>

          <strong>
            {loading ? "—" : updateCount}
          </strong>

          <small>
            Modified records
          </small>

        </div>


        <div className="audit-summary-card orange">

          <span>Security Actions</span>

          <strong>
            {loading ? "—" : securityCount}
          </strong>

          <small>
            Sensitive activities
          </small>

        </div>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="audit-error">
          <span>!</span>
          {error}
        </div>
      )}


      {/* =====================================
          FILTER CARD
      ===================================== */}

      <div className="audit-filter-card">

        <div className="activity-heading">

          <div>
            <h2>Activity History</h2>

            <p>
              Review actions performed in LedgerGuard
            </p>
          </div>

          <span className="live-badge">
            <i></i>
            Live Logs
          </span>

        </div>


        <div className="audit-filters">

          <div className="audit-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option value="ALL">
              All Activities
            </option>

            {actionOptions.map((action) => (
              <option
                key={action}
                value={action}
              >
                {action}
              </option>
            ))}

          </select>

        </div>

      </div>


      {/* =====================================
          LOG TABLE
      ===================================== */}

      <div className="audit-table-card">

        {loading ? (

          <div className="audit-loading">
            <div className="loading-spinner"></div>
            <p>Loading audit logs...</p>
          </div>

        ) : filteredLogs.length === 0 ? (

          <div className="audit-empty">

            <div className="empty-icon">
              ◌
            </div>

            <h3>No audit logs found</h3>

            <p>
              There are no activities matching
              your current filters.
            </p>

          </div>

        ) : (

          <div className="audit-table-wrapper">

            <table className="audit-table">

              <thead>

                <tr>
                  <th>Activity</th>
                  <th>Module</th>
                  <th>Description</th>
                  <th>IP Address</th>
                  <th>User</th>
                  <th>Date & Time</th>
                </tr>

              </thead>


              <tbody>

                {filteredLogs.map((log, index) => {

                  const action =
                    getAction(log);

                  return (

                    <tr
                      key={
                        log._id ||
                        log.id ||
                        index
                      }
                    >

                      <td>

                        <span
                          className={`activity-badge ${getActionClass(
                            action
                          )}`}
                        >
                          {action}
                        </span>

                      </td>


                      <td>

                        <span className="module-text">
                          {getModule(log)}
                        </span>

                      </td>


                      <td>

                        <span className="description-text">
                          {getDescription(log)}
                        </span>

                      </td>


                      <td>

                        <span className="ip-address">
                          {log.ipAddress ||
                            log.ip ||
                            "—"}
                        </span>

                      </td>


                      <td>

                        <div className="user-info">

                          <strong>
                            {log.userId?.name ||
                              "System"}
                          </strong>

                          <small>
                            {log.userId?.role ||
                              ""}
                          </small>

                        </div>

                      </td>


                      <td>

                        <span className="date-text">
                          {formatDate(
                            log.createdAt
                          )}
                        </span>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AuditLogs;