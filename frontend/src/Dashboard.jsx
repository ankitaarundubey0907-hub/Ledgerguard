import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ setIsLoggedIn }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setTransactions(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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

        await fetchTransactions();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Cannot connect to backend");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const balance = income - expense;

  if (loading) {
    return (
      <div className="loading">
        Loading LedgerGuard...
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <header className="navbar">

        <div className="nav-brand">
          <div className="small-logo">L</div>
          <span>LedgerGuard</span>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* MAIN */}

      <main className="dashboard-content">

        <div className="welcome-section">
          <div>
            <h1>Dashboard</h1>
            <p>Here's your financial overview.</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}

        <div className="summary-grid">

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

        {/* TWO COLUMN SECTION */}

        <div className="dashboard-grid">

          {/* ADD TRANSACTION */}

          <section className="panel">

            <h2>Add Transaction</h2>
            <p className="panel-subtitle">
              Record your income or expenses.
            </p>

            <form
              className="transaction-form"
              onSubmit={handleAddTransaction}
            >

              <label>Transaction Type</label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="income">
                  Income
                </option>

                <option value="expense">
                  Expense
                </option>
              </select>

              <label>Amount</label>

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

              <label>Description</label>

              <input
                type="text"
                placeholder="e.g. Office supplies"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />

              <label>Category</label>

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

          {/* TRANSACTIONS */}

          <section className="panel">

            <div className="transactions-header">
              <div>
                <h2>Recent Transactions</h2>
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
                  <p>No transactions yet.</p>
                </div>
              ) : (
                transactions.map((transaction) => (

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
                        {transaction.type === "income"
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
                      {transaction.type === "income"
                        ? "+"
                        : "-"}
                      ₹
                      {transaction.amount.toLocaleString(
                        "en-IN"
                      )}
                    </div>

                  </div>

                ))
              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;