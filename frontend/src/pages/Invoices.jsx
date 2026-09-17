import { useEffect, useState } from "react";
import "./AdminPages.css";
import API from "../services/api";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Create invoice modal
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // View invoice modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    customerEmail: "",
    amount: "",
    status: "Pending",
    dueDate: "",
    description: "",
  });

  // ========================================
  // FETCH INVOICES
  // ========================================

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const response = await API.get("/invoices");

      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // CREATE INVOICE
  // ========================================

  const handleCreateInvoice = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await API.post("/invoices", {
        invoiceNumber: formData.invoiceNumber,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        amount: Number(formData.amount),
        status: formData.status,
        dueDate: formData.dueDate,
        description: formData.description,
      });

      setInvoices((prev) => [
        response.data.invoice,
        ...prev,
      ]);

      setFormData({
        invoiceNumber: "",
        customerName: "",
        customerEmail: "",
        amount: "",
        status: "Pending",
        dueDate: "",
        description: "",
      });

      setShowModal(false);

      alert("Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create invoice"
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // VIEW INVOICE
  // ========================================

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  // ========================================
  // CLOSE VIEW MODAL
  // ========================================

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedInvoice(null);
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = search.toLowerCase();

    return (
      invoice.invoiceNumber
        ?.toLowerCase()
        .includes(searchText) ||
      invoice.customerName
        ?.toLowerCase()
        .includes(searchText) ||
      invoice.status
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // ========================================
  // SUMMARY
  // ========================================

  const totalInvoices = invoices.length;

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "Pending"
  ).length;

  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === "Overdue"
  ).length;

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // FORMAT AMOUNT
  // ========================================

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (status) => {
    if (status === "Paid") {
      return "badge success";
    }

    if (status === "Pending") {
      return "badge pending";
    }

    return "badge failed";
  };

  return (
    <div className="admin-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="page-header">

        <div>
          <h1>Invoices</h1>

          <p>
            Manage billing invoices and payments
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Invoice
        </button>

      </div>


      {/* ========================================
          SUMMARY CARDS
      ======================================== */}

      <div className="summary-cards">

        <div className="summary-card">
          <span>Total Invoices</span>
          <strong>{totalInvoices}</strong>
        </div>

        <div className="summary-card">
          <span>Paid</span>
          <strong>{paidInvoices}</strong>
        </div>

        <div className="summary-card">
          <span>Pending</span>
          <strong>{pendingInvoices}</strong>
        </div>

        <div className="summary-card">
          <span>Overdue</span>
          <strong>{overdueInvoices}</strong>
        </div>

      </div>


      {/* ========================================
          INVOICE LIST
      ======================================== */}

      <div className="admin-card">

        <div className="card-heading">

          <div>
            <h2>Invoice List</h2>

            <p>
              Recent invoices generated by tenants
            </p>
          </div>

          <input
            type="text"
            placeholder="Search invoice..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="table-wrapper">

          {loading ? (

            <p style={{ padding: "20px" }}>
              Loading invoices...
            </p>

          ) : filteredInvoices.length === 0 ? (

            <p style={{ padding: "20px" }}>
              No invoices found.
            </p>

          ) : (

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredInvoices.map((invoice) => (

                  <tr key={invoice._id}>

                    <td>
                      <strong>
                        #{invoice.invoiceNumber}
                      </strong>
                    </td>

                    <td>
                      {invoice.customerName}
                    </td>

                    <td>
                      {formatAmount(invoice.amount)}
                    </td>

                    <td>
                      {formatDate(invoice.dueDate)}
                    </td>

                    <td>

                      <span
                        className={getStatusClass(
                          invoice.status
                        )}
                      >
                        {invoice.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="action-btn"
                        onClick={() =>
                          handleViewInvoice(invoice)
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>


      {/* ========================================
          CREATE INVOICE MODAL
      ======================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="tenant-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>Create Invoice</h2>

                <p>
                  Enter the invoice details below
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleCreateInvoice}
            >

              {/* Invoice Number */}

              <div className="modal-field">

                <label>
                  Invoice Number
                </label>

                <input
                  type="text"
                  name="invoiceNumber"
                  placeholder="e.g. INV001"
                  value={
                    formData.invoiceNumber
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>


              {/* Customer Name */}

              <div className="modal-field">

                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customerName"
                  placeholder="Enter customer name"
                  value={
                    formData.customerName
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>


              {/* Customer Email */}

              <div className="modal-field">

                <label>
                  Customer Email
                </label>

                <input
                  type="email"
                  name="customerEmail"
                  placeholder="customer@example.com"
                  value={
                    formData.customerEmail
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              {/* Amount */}

              <div className="modal-field">

                <label>
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  min="0"
                  value={formData.amount}
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>


              {/* Status */}

              <div className="modal-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={
                    handleInputChange
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Overdue">
                    Overdue
                  </option>

                </select>

              </div>


              {/* Due Date */}

              <div className="modal-field">

                <label>
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>


              {/* Description */}

              <div className="modal-field">

                <label>
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  placeholder="Optional description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              {/* Buttons */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Creating..."
                    : "Create Invoice"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ========================================
          VIEW INVOICE MODAL
      ======================================== */}

      {showViewModal &&
        selectedInvoice && (

          <div
            className="modal-overlay"
            onClick={
              handleCloseViewModal
            }
          >

            <div
              className="tenant-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* Header */}

              <div className="modal-header">

                <div>

                  <h2>
                    Invoice Details
                  </h2>

                  <p>
                    #
                    {
                      selectedInvoice.invoiceNumber
                    }
                  </p>

                </div>

                <button
                  className="modal-close"
                  onClick={
                    handleCloseViewModal
                  }
                >
                  ×
                </button>

              </div>


              {/* Details */}

              <div className="modal-field">

                <label>
                  Invoice Number
                </label>

                <strong>
                  #
                  {
                    selectedInvoice.invoiceNumber
                  }
                </strong>

              </div>


              <div className="modal-field">

                <label>
                  Customer Name
                </label>

                <strong>
                  {
                    selectedInvoice.customerName ||
                    "-"
                  }
                </strong>

              </div>


              <div className="modal-field">

                <label>
                  Customer Email
                </label>

                <strong>
                  {
                    selectedInvoice.customerEmail ||
                    "Not provided"
                  }
                </strong>

              </div>


              <div className="modal-field">

                <label>
                  Amount
                </label>

                <strong>
                  {
                    formatAmount(
                      selectedInvoice.amount
                    )
                  }
                </strong>

              </div>


              <div className="modal-field">

                <label>
                  Status
                </label>

                <div>

                  <span
                    className={getStatusClass(
                      selectedInvoice.status
                    )}
                  >
                    {
                      selectedInvoice.status
                    }
                  </span>

                </div>

              </div>


              <div className="modal-field">

                <label>
                  Due Date
                </label>

                <strong>
                  {
                    formatDate(
                      selectedInvoice.dueDate
                    )
                  }
                </strong>

              </div>


              <div className="modal-field">

                <label>
                  Description
                </label>

                <strong>
                  {
                    selectedInvoice.description ||
                    "No description"
                  }
                </strong>

              </div>


              {/* Close */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCloseViewModal
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default Invoices;