import { useEffect, useState } from "react";
import "./AdminPages.css";

function Tenants() {
  const [tenants, setTenants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plan: "Basic",
  });

  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");

  // ========================================
  // FETCH TENANTS
  // ========================================

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/tenants",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load tenants"
        );
      }

      setTenants(data.data || []);
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
      fetchTenants();
    }
  }, []);

  // ========================================
  // CREATE TENANT
  // ========================================

  const handleCreateTenant = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/tenants",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create tenant"
        );
      }

      // Add new tenant immediately to UI
      setTenants((prev) => [
        data.data,
        ...prev,
      ]);

      // Close modal
      setShowModal(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        plan: "Basic",
      });

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredTenants = tenants.filter((tenant) => {
    const searchText = search.toLowerCase();

    return (
      tenant.name
        ?.toLowerCase()
        .includes(searchText) ||
      tenant.email
        ?.toLowerCase()
        .includes(searchText) ||
      tenant.plan
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // ========================================
  // COUNTS
  // ========================================

  const totalTenants = tenants.length;

  const activeTenants = tenants.filter(
    (tenant) => tenant.status === "Active"
  ).length;

  const inactiveTenants = tenants.filter(
    (tenant) => tenant.status === "Inactive"
  ).length;

  // ========================================
  // UI
  // ========================================

  return (
    <div className="admin-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="page-header">

        <div>
          <h1>Tenants</h1>

          <p>
            Manage all registered organizations
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Tenant
        </button>

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
          SUMMARY
      ======================================== */}

      <div className="summary-cards">

        <div className="summary-card">
          <span>Total Tenants</span>

          <strong>
            {loading ? "..." : totalTenants}
          </strong>
        </div>


        <div className="summary-card">
          <span>Active</span>

          <strong>
            {loading ? "..." : activeTenants}
          </strong>
        </div>


        <div className="summary-card">
          <span>Inactive</span>

          <strong>
            {loading ? "..." : inactiveTenants}
          </strong>
        </div>

      </div>


      {/* ========================================
          TENANTS TABLE
      ======================================== */}

      <div className="admin-card">

        <div className="card-heading">

          <h2>
            All Tenants
          </h2>

          <input
            type="text"
            placeholder="Search tenants..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Tenant ID</th>
                <th>Organization</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Loading tenants...
                  </td>
                </tr>

              ) : filteredTenants.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No tenants found.
                  </td>
                </tr>

              ) : (

                filteredTenants.map((tenant, index) => (

                  <tr key={tenant._id}>

                    <td>
                      TEN
                      {String(
                        index + 1
                      ).padStart(3, "0")}
                    </td>


                    <td>
                      <strong>
                        {tenant.name}
                      </strong>
                    </td>


                    <td>
                      {tenant.email}
                    </td>


                    <td>
                      {tenant.plan}
                    </td>


                    <td>

                      <span
                        className={
                          tenant.status === "Active"
                            ? "badge success"
                            : "badge failed"
                        }
                      >
                        {tenant.status}
                      </span>

                    </td>


                    <td>

                      <button
                        className="action-btn"
                        onClick={() =>
                          alert(
                            `Tenant: ${tenant.name}`
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ========================================
          ADD TENANT MODAL
      ======================================== */}

      {showModal && (

        <div className="modal-overlay">

          <div className="tenant-modal">

            <div className="modal-header">

              <div>
                <h2>
                  Add New Tenant
                </h2>

                <p>
                  Create a new organization
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
              onSubmit={handleCreateTenant}
            >

              <div className="modal-field">

                <label>
                  Organization Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. ABC Enterprises"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </div>


              <div className="modal-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="company@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  required
                />

              </div>


              <div className="modal-field">

                <label>
                  Plan
                </label>

                <select
                  value={formData.plan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plan: e.target.value,
                    })
                  }
                >

                  <option value="Basic">
                    Basic
                  </option>

                  <option value="Premium">
                    Premium
                  </option>

                  <option value="Enterprise">
                    Enterprise
                  </option>

                </select>

              </div>


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
                  disabled={creating}
                >
                  {creating
                    ? "Creating..."
                    : "Create Tenant"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Tenants;