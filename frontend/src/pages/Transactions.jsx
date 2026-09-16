import { useEffect, useState } from "react";
import "./Transactions.css";

const API_URL = "http://localhost:5000/api/transactions";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    date: "",
    sensitiveData: ""
  });

  const token = localStorage.getItem("token");

  // ========================================
  // FETCH TRANSACTIONS
  // ========================================

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (type) params.append("type", type);
      if (category) params.append("category", category);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      params.append("page", page);
      params.append("limit", limit);

      const response = await fetch(
        `${API_URL}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch transactions"
        );
      }

      setTransactions(data.data || []);

      setPagination(
        data.pagination || {}
      );

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [
    type,
    category,
    startDate,
    endDate,
    page
  ]);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ========================================
  // ADD / UPDATE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId
        ? "PATCH"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: formData.type,
          amount: Number(formData.amount),
          description: formData.description,
          category: formData.category,
          date: formData.date,
          sensitiveData: formData.sensitiveData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Transaction operation failed"
        );
      }

      resetForm();

      fetchTransactions();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // ========================================
  // EDIT
  // ========================================

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);

    setFormData({
      type: transaction.type || "expense",
      amount: transaction.amount || "",
      description: transaction.description || "",
      category: transaction.category || "",
      date: transaction.date
        ? transaction.date.substring(0, 10)
        : "",
      sensitiveData: ""
    });

    setShowForm(true);
  };

  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete transaction"
        );
      }

      fetchTransactions();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      description: "",
      category: "",
      date: "",
      sensitiveData: ""
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setType("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="transactions-page">

      <div className="transactions-header">

        <div>
          <h1>Transactions</h1>
          <p>
            Manage your organization's financial transactions
          </p>
        </div>

        <button
          className="add-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Transaction
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <div className="transaction-form-card">

          <h2>
            {editingId
              ? "Edit Transaction"
              : "Add Transaction"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div>
                <label>Type</label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>
                </select>
              </div>

              <div>
                <label>Amount</label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div>
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Salary, Food, Rent"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div>
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Transaction description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>
                Sensitive Data (optional)
              </label>

              <input
                type="text"
                name="sensitiveData"
                placeholder="Sensitive financial information"
                value={formData.sensitiveData}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">

              <button type="submit">
                {editingId
                  ? "Update Transaction"
                  : "Create Transaction"}
              </button>

              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* FILTERS */}

      <div className="filters-card">

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">
            All Types
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
        />

        <button
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>

      {/* TABLE */}

      <div className="transactions-card">

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="7">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (

                  <tr key={transaction._id}>

                    <td>
                      <span
                        className={
                          transaction.type === "income"
                            ? "income"
                            : "expense"
                        }
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td>
                      ₹{Number(
                        transaction.amount
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {transaction.category}
                    </td>

                    <td>
                      {transaction.description}
                    </td>

                    <td>
                      {transaction.createdAt
                        ? new Date(
                            transaction.createdAt
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                    <td>
                      {transaction.userId?.name ||
                        "User"}
                    </td>

                    <td>

                      <button
                        onClick={() =>
                          handleEdit(transaction)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            transaction._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="pagination">

          <button
            disabled={
              !pagination.hasPreviousPage
            }
            onClick={() =>
              setPage((prev) => prev - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {pagination.currentPage || page}
            {" "}of{" "}
            {pagination.totalPages || 1}
          </span>

          <button
            disabled={
              !pagination.hasNextPage
            }
            onClick={() =>
              setPage((prev) => prev + 1)
            }
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default Transactions;