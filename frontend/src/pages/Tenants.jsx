import "./AdminPages.css";

function Tenants() {
  const tenants = [
    {
      id: "TEN001",
      name: "ABC Enterprises",
      email: "abc@gmail.com",
      plan: "Premium",
      status: "Active",
    },
    {
      id: "TEN002",
      name: "XYZ Solutions",
      email: "xyz@gmail.com",
      plan: "Basic",
      status: "Active",
    },
    {
      id: "TEN003",
      name: "TechNova Pvt Ltd",
      email: "technova@gmail.com",
      plan: "Premium",
      status: "Active",
    },
    {
      id: "TEN004",
      name: "Global Industries",
      email: "global@gmail.com",
      plan: "Enterprise",
      status: "Active",
    },
    {
      id: "TEN005",
      name: "Smart Systems",
      email: "smart@gmail.com",
      plan: "Basic",
      status: "Inactive",
    },
  ];

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Tenants</h1>
          <p>Manage all registered organizations</p>
        </div>

        <button className="primary-btn">
          + Add Tenant
        </button>
      </div>

      <div className="summary-cards">

        <div className="summary-card">
          <span>Total Tenants</span>
          <strong>12</strong>
        </div>

        <div className="summary-card">
          <span>Active</span>
          <strong>10</strong>
        </div>

        <div className="summary-card">
          <span>Inactive</span>
          <strong>2</strong>
        </div>

      </div>

      <div className="admin-card">

        <div className="card-heading">
          <h2>All Tenants</h2>

          <input
            type="text"
            placeholder="Search tenants..."
            className="search-input"
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

              {tenants.map((tenant) => (
                <tr key={tenant.id}>

                  <td>{tenant.id}</td>

                  <td>
                    <strong>{tenant.name}</strong>
                  </td>

                  <td>{tenant.email}</td>

                  <td>{tenant.plan}</td>

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
                    <button className="action-btn">
                      View
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Tenants;