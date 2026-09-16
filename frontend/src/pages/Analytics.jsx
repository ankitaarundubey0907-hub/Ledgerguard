import { useEffect, useState } from "react";
import "./Analytics.css";

function Analytics() {
  const [report, setReport] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeTransactions: 0,
    expenseTransactions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token");

  const formatMoney = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // ========================================
  // FETCH FINANCIAL REPORT
  // ========================================

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      let url =
        "http://localhost:5000/api/transactions/reports";

      const params = new URLSearchParams();

      if (startDate) {
        params.append("startDate", startDate);
      }

      if (endDate) {
        params.append("endDate", endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load financial report"
        );
      }

      setReport(data.data);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    if (token) {
      fetchReport();
    }
  }, []);

  // ========================================
  // DATE FILTER
  // ========================================

  const handleFilter = async (e) => {
  e.preventDefault();

  console.log("Filter clicked");
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  await fetchReport();
};

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");

    setTimeout(() => {
      fetchReport();
    }, 0);
  };

  // ========================================
  // CALCULATIONS
  // ========================================

  const totalTransactions =
    Number(report.incomeTransactions || 0) +
    Number(report.expenseTransactions || 0);

  const averageTransaction =
    totalTransactions > 0
      ? (
          (Number(report.totalIncome || 0) +
            Number(report.totalExpense || 0)) /
          totalTransactions
        )
      : 0;

  const incomePercentage =
    totalTransactions > 0
      ? Math.round(
          (report.incomeTransactions /
            totalTransactions) *
            100
        )
      : 0;

  return (
    <div className="admin-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="page-header">

        <div>
          <h1>Analytics</h1>

          <p>
            Overview of billing and transaction
            performance
          </p>
        </div>

      </div>


      {/* ========================================
          DATE FILTER
      ======================================== */}

      <div className="admin-card">

        <h2>Financial Report</h2>

        <form
          onSubmit={handleFilter}
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "end",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >

          <div>
            <label>Start Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />
          </div>

          <div>
            <label>End Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />
          </div>

          <button type="submit">
            Apply Filter
          </button>

          <button
            type="button"
            onClick={clearFilter}
          >
            Clear
          </button>

        </form>

      </div>


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* ========================================
          ANALYTICS CARDS
      ======================================== */}

      <div className="summary-cards">

        <div className="summary-card">

          <span>Total Income</span>

          <strong>
            {loading
              ? "Loading..."
              : formatMoney(report.totalIncome)}
          </strong>

          <small>
            Income transactions:{" "}
            {report.incomeTransactions}
          </small>

        </div>


        <div className="summary-card">

          <span>Total Expenses</span>

          <strong>
            {loading
              ? "Loading..."
              : formatMoney(report.totalExpense)}
          </strong>

          <small>
            Expense transactions:{" "}
            {report.expenseTransactions}
          </small>

        </div>


        <div className="summary-card">

          <span>Balance</span>

          <strong>
            {loading
              ? "Loading..."
              : formatMoney(report.balance)}
          </strong>

          <small>
            Income − Expenses
          </small>

        </div>


        <div className="summary-card">

          <span>Total Transactions</span>

          <strong>
            {loading
              ? "Loading..."
              : totalTransactions}
          </strong>

          <small>
            All transactions
          </small>

        </div>

      </div>


      {/* ========================================
          TRANSACTION OVERVIEW
      ======================================== */}

      <div className="analytics-grid">

        <div className="admin-card">

          <h2>Transaction Overview</h2>

          <div className="progress-item">

            <div>
              <span>Income</span>

              <strong>
                {incomePercentage}%
              </strong>
            </div>

            <div className="progress">

              <span
                style={{
                  width: `${incomePercentage}%`,
                }}
              ></span>

            </div>

          </div>


          <div className="progress-item">

            <div>
              <span>Expenses</span>

              <strong>
                {100 - incomePercentage}%
              </strong>
            </div>

            <div className="progress">

              <span
                style={{
                  width: `${
                    100 - incomePercentage
                  }%`,
                }}
              ></span>

            </div>

          </div>

        </div>


        {/* ========================================
            TRANSACTION DETAILS
        ======================================== */}

        <div className="admin-card">

          <h2>Transaction Details</h2>

          <div className="tenant-ranking">

            <span>01</span>

            <div>
              <strong>
                Income Transactions
              </strong>

              <small>
                {report.incomeTransactions} transactions
              </small>
            </div>

          </div>


          <div className="tenant-ranking">

            <span>02</span>

            <div>
              <strong>
                Expense Transactions
              </strong>

              <small>
                {report.expenseTransactions} transactions
              </small>
            </div>

          </div>


          <div className="tenant-ranking">

            <span>03</span>

            <div>
              <strong>
                Average Transaction
              </strong>

              <small>
                {formatMoney(averageTransaction)}
              </small>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;