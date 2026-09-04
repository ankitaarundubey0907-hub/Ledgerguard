import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ setIsLoggedIn }) {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [employeeMessage, setEmployeeMessage] = useState("");

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      // Get current user
      const userResponse = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();

        if (userData.success) {
          setUser(userData.data.user);
          setCompanyName(userData.data.companyName);
        }
      }

      // Get transactions
      const transactionResponse = await fetch(
        "http://localhost:5000/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transactionData = await transactionResponse.json();

      if (transactionData.success) {
        setTransactions(transactionData.data);
      } else {
        setError(transactionData.message);
      }

      // Get company users
      const usersResponse = await fetch(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();

        if (usersData.success) {
          setUsers(usersData.data);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================
  // ADD TRANSACTION
  // =========================

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type,
            amount: Number(amount),
            description,
            category,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAmount("");
        setDescription("");
        setCategory("");

        await fetchDashboardData();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Cannot connect to backend");
    }
  };

  // =========================
  // ADD EMPLOYEE
  // =========================

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    setEmployeeMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: employeeName,
            email: employeeEmail,
            password: employeePassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setEmployeeName("");
        setEmployeeEmail("");
        setEmployeePassword("");

        setEmployeeMessage("Employee added successfully!");

        await fetchDashboardData();
      } else {
        setEmployeeMessage(data.message || "Failed to add employee");
      }
    } catch (error) {
      console.error(error);
      setEmployeeMessage("Cannot connect to backend");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
  };

  // =========================
  // CALCULATE FINANCES
  // =========================

  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const expense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const balance = income - expense;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="loading">
        Loading LedgerGuard...
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="dashboard">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="nav-brand">

          <div className="small-logo">
            L
          </div>

          <span>
            LedgerGuard
          </span>

        </div>

        {/* Username REMOVED from here */}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* ================= MAIN ================= */}

      <main className="dashboard-content">

        {/* ================= WELCOME ================= */}

        <div className="welcome-section">
  <div>
    <h1>
      {companyName || "Company"}
    </h1>

    <p>
      Welcome, Ankita 👋
    </p>

    <p>
      Here's your financial overview.
    </p>
  </div>
</div>

        {/* ================= SUMMARY CARDS ================= */}

        <div className="summary-grid">

          {/* BALANCE */}

          <div className="summary-card balance-card">

            <div className="card-title">
              Balance
            </div>

            <div className="card-value">
              ₹{balance.toLocaleString("en-IN")}
            </div>

            <div className="card-description">
              Current balance
            </div>

          </div>

          {/* INCOME */}

          <div className="summary-card income-card">

            <div className="card-title">
              Total Income
            </div>

            <div className="card-value">
              ₹{income.toLocaleString("en-IN")}
            </div>

            <div className="card-description">
              Money received
            </div>

          </div>

          {/* EXPENSE */}

          <div className="summary-card expense-card">

            <div className="card-title">
              Total Expense
            </div>

            <div className="card-value">
              ₹{expense.toLocaleString("en-IN")}
            </div>

            <div className="card-description">
              Money spent
            </div>

          </div>

        </div>

        {/* ================= TEAM SECTION ================= */}

        <div className="dashboard-grid">

          {/* TEAM MEMBERS */}

          <section className="panel">

            <h2>
              Team Members
            </h2>

            <p className="panel-subtitle">
              Employees in your company.
            </p>

            <div className="team-list">

              {users.length === 0 ? (

                <div className="empty-state">
                  <p>
                    No team members found.
                  </p>
                </div>

              ) : (

                users.map((member) => (

                  <div
                    className="team-member"
                    key={member._id}
                  >

                    <div>

                      <strong>
                        {member.name}
                      </strong>

                      <p>
                        {member.email}
                      </p>

                    </div>

                    <span className="role-badge">
                      {member.role}
                    </span>

                  </div>

                ))

              )}

            </div>

          </section>

          {/* ADD EMPLOYEE */}

          <section className="panel">

            <h2>
              Add Employee
            </h2>

            <p className="panel-subtitle">
              Add a new member to your company.
            </p>

            <form
              className="transaction-form"
              onSubmit={handleAddEmployee}
            >

              <label>
                Name
              </label>

              <input
                type="text"
                placeholder="Employee name"
                value={employeeName}
                onChange={(e) =>
                  setEmployeeName(e.target.value)
                }
                required
              />

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Employee email"
                value={employeeEmail}
                onChange={(e) =>
                  setEmployeeEmail(e.target.value)
                }
                required
              />

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Temporary password"
                value={employeePassword}
                onChange={(e) =>
                  setEmployeePassword(e.target.value)
                }
                required
              />

              <button
                className="add-button"
                type="submit"
              >
                + Add Employee
              </button>

            </form>

            {employeeMessage && (

              <p className="dashboard-success">
                {employeeMessage}
              </p>

            )}

          </section>

        </div>

        {/* ================= TRANSACTIONS ================= */}

        <div className="dashboard-grid">

          {/* ADD TRANSACTION */}

          <section className="panel">

            <h2>
              Add Transaction
            </h2>

            <p className="panel-subtitle">
              Record your income or expenses.
            </p>

            <form
              className="transaction-form"
              onSubmit={handleAddTransaction}
            >

              <label>
                Transaction Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >

                <option value="income">
                  Income
                </option>

                <option value="expense">
                  Expense
                </option>

              </select>

              <label>
                Amount
              </label>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                min="1"
                required
              />

              <label>
                Description
              </label>

              <input
                type="text"
                placeholder="e.g. Office supplies"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />

              <label>
                Category
              </label>

              <input
                type="text"
                placeholder="e.g. Office"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
              />

              <button
                className="add-button"
                type="submit"
              >
                + Add Transaction
              </button>

            </form>

            {error && (

              <p className="dashboard-error">
                {error}
              </p>

            )}

          </section>

          {/* RECENT TRANSACTIONS */}

          <section className="panel">

            <div className="transactions-header">

              <div>

                <h2>
                  Recent Transactions
                </h2>

                <p className="panel-subtitle">
                  Your latest financial activity.
                </p>

              </div>

              <span className="transaction-count">
                {transactions.length}
              </span>

            </div>

            <div className="transaction-list">

              {transactions.length === 0 ? (

                <div className="empty-state">

                  <p>
                    No transactions yet.
                  </p>

                </div>

              ) : (

                transactions.map(
                  (transaction) => (

                    <div
                      className="transaction-item"
                      key={transaction._id}
                    >

                      <div className="transaction-info">

                        <div
                          className={`transaction-icon ${
                            transaction.type
                          }`}
                        >

                          {transaction.type ===
                          "income"
                            ? "+"
                            : "-"}

                        </div>

                        <div>

                          <strong>
                            {transaction.description}
                          </strong>

                          <p>
                            {transaction.category}
                          </p>

                        </div>

                      </div>

                      <div
                        className={`transaction-amount ${
                          transaction.type
                        }`}
                      >

                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}

                        ₹
                        {Number(
                          transaction.amount
                        ).toLocaleString("en-IN")}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;
