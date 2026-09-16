import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ========================================
  // LOAD USER
  // ========================================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ========================================
  // LOAD DASHBOARD DATA
  // ========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // -------------------------------
        // Financial Summary
        // -------------------------------

        const summaryResponse = await fetch(
          "http://localhost:5000/api/transactions/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const summaryData = await summaryResponse.json();

        if (!summaryResponse.ok) {
          throw new Error(
            summaryData.message ||
              "Failed to load financial summary"
          );
        }

        setSummary(summaryData.data);

        // -------------------------------
        // Recent Transactions
        // -------------------------------

        const transactionResponse = await fetch(
          "http://localhost:5000/api/transactions?limit=5&page=1",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactionData =
          await transactionResponse.json();

        if (!transactionResponse.ok) {
          throw new Error(
            transactionData.message ||
              "Failed to load transactions"
          );
        }

        setTransactions(transactionData.data || []);

      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // ========================================
  // FORMAT MONEY
  // ========================================

  const formatMoney = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-box">L</div>
          <span>LedgerGuard</span>
        </div>

        <nav className="sidebar-menu">

          <a
            href="/dashboard"
            className="menu-item active"
          >
            <span>▣</span>
            Dashboard
          </a>

          <a
            href="/tenants"
            className="menu-item"
          >
            <span>▤</span>
            Tenants
          </a>

          <a
            href="/invoices"
            className="menu-item"
          >
            <span>▧</span>
            Invoices
          </a>

          <a
            href="/transactions"
            className="menu-item"
          >
            <span>↔</span>
            Transactions
          </a>

          <a
            href="/employees"
            className="menu-item"
          >
            <span>👥</span>
            Employees
          </a>

          <a
            href="/analytics"
            className="menu-item"
          >
            <span>◉</span>
            Analytics
          </a>

         <a
  href="/payments"
  className="menu-item"
>
  <span>₹</span>
  Payments
</a>

<a
  href="/audit-logs"
  className="menu-item"
>
  <span>◌</span>
  Audit Logs
</a>

          <a
            href="/settings"
            className="menu-item"
          >
            <span>⚙</span>
            Settings
          </a>

        </nav>

        <div className="sidebar-bottom">
          <p>LedgerGuard</p>
          <small>Secure Billing Platform</small>
        </div>

      </aside>


      {/* Main Content */}
      <main className="main-content">

        {/* Top Header */}
        <header className="top-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome,{" "}
              {user?.name || "User"}
            </p>
          </div>

          <div className="admin-profile">

            <div className="admin-circle">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <strong>
                {user?.name || "User"}
              </strong>

              <small>
                {user?.role || "Administrator"}
              </small>
            </div>

          </div>

        </header>


        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* Statistics Cards */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>
              <p>Total Income</p>

              <h2>
                {loading
                  ? "Loading..."
                  : formatMoney(
                      summary.totalIncome
                    )}
              </h2>

              <span>
                Total income
              </span>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              💸
            </div>

            <div>
              <p>Total Expenses</p>

              <h2>
                {loading
                  ? "Loading..."
                  : formatMoney(
                      summary.totalExpense
                    )}
              </h2>

              <span>
                Total expenses
              </span>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ↔
            </div>

            <div>
              <p>Transactions</p>

              <h2>
                {loading
                  ? "..."
                  : transactions.length}
              </h2>

              <span>
                Recent transactions
              </span>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div>
              <p>Balance</p>

              <h2>
                {loading
                  ? "Loading..."
                  : formatMoney(
                      summary.balance
                    )}
              </h2>

              <span>
                Income − Expenses
              </span>
            </div>

          </div>

        </section>


        {/* Recent Transactions */}
        <section className="content-card">

          <div className="section-header">

            <div>
              <h2>
                Recent Transactions
              </h2>

              <p>
                Latest financial activities
              </p>
            </div>

            <button
              className="view-button"
              onClick={() =>
                window.location.href =
                  "/transactions"
              }
            >
              View All
            </button>

          </div>


          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Transaction ID</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Type</th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td colSpan="5">
                      Loading transactions...
                    </td>
                  </tr>

                ) : transactions.length === 0 ? (

                  <tr>
                    <td colSpan="5">
                      No transactions found.
                    </td>
                  </tr>

                ) : (

                  transactions.map(
                    (transaction) => (

                      <tr
                        key={transaction._id}
                      >

                        <td>
                          #
                          {transaction._id.slice(
                            -6
                          ).toUpperCase()}
                        </td>

                        <td>
                          {transaction.category}
                        </td>

                        <td>
                          {formatMoney(
                            transaction.amount
                          )}
                        </td>

                        <td>
                          {transaction.createdAt
                            ? new Date(
                                transaction.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                        <td>
                          <span
                            className={
                              transaction.type ===
                              "income"
                                ? "status success"
                                : "status failed"
                            }
                          >
                            {transaction.type}
                          </span>
                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* Bottom Cards */}
        <section className="bottom-grid">

          <div className="content-card small-card">

            <div className="card-title">

              <h2>
                Financial Overview
              </h2>

              <span>
                Current
              </span>

            </div>

            <div className="invoice-row">
              <span>
                Total Income
              </span>

              <strong>
                {formatMoney(
                  summary.totalIncome
                )}
              </strong>
            </div>

            <div className="invoice-row">
              <span>
                Total Expenses
              </span>

              <strong>
                {formatMoney(
                  summary.totalExpense
                )}
              </strong>
            </div>

            <div className="invoice-row">
              <span>
                Balance
              </span>

              <strong>
                {formatMoney(
                  summary.balance
                )}
              </strong>
            </div>

          </div>


          <div className="content-card small-card">

            <div className="card-title">

              <h2>
                System Status
              </h2>

              <span>
                Live
              </span>

            </div>


            <div className="system-status">

              <span className="online-dot"></span>

              <div>

                <strong>
                  Backend API
                </strong>

                <p>
                  Connected
                </p>

              </div>

            </div>


            <div className="system-status">

              <span className="online-dot"></span>

              <div>

                <strong>
                  MongoDB
                </strong>

                <p>
                  Financial data available
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;