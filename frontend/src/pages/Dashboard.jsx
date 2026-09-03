import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-box">L</div>
          <span>LedgerGuard</span>
        </div>

        <nav className="sidebar-menu">

          <a href="/dashboard" className="menu-item active">
            <span>▣</span>
            Dashboard
          </a>

          <a href="/tenants" className="menu-item">
            <span>▤</span>
            Tenants
          </a>

          <a href="/invoices" className="menu-item">
            <span>▧</span>
            Invoices
          </a>

          <a href="/transactions" className="menu-item">
            <span>↔</span>
            Transactions
          </a>

          <a href="/analytics" className="menu-item">
            <span>◉</span>
            Analytics
          </a>

          <a href="/settings" className="menu-item">
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
            <p>Welcome to LedgerGuard Admin Panel</p>
          </div>

          <div className="admin-profile">
            <div className="admin-circle">A</div>
            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>
          </div>

        </header>


        {/* Statistics Cards */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div>
              <p>Total Tenants</p>
              <h2>12</h2>
              <span>Active organizations</span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div>
              <p>Total Invoices</p>
              <h2>48</h2>
              <span>This month</span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">↔</div>
            <div>
              <p>Transactions</p>
              <h2>156</h2>
              <span>Processed successfully</span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">₹</div>
            <div>
              <p>Total Revenue</p>
              <h2>₹24,500</h2>
              <span>This month</span>
            </div>
          </div>

        </section>


        {/* Recent Transactions */}
        <section className="content-card">

          <div className="section-header">
            <div>
              <h2>Recent Transactions</h2>
              <p>Latest billing and payment activities</p>
            </div>

            <button className="view-button">
              View All
            </button>
          </div>


          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Tenant</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>#TRX001</td>
                  <td>ABC Enterprises</td>
                  <td>₹5,000</td>
                  <td>03 Sep 2026</td>
                  <td>
                    <span className="status success">
                      Success
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#TRX002</td>
                  <td>XYZ Solutions</td>
                  <td>₹3,500</td>
                  <td>03 Sep 2026</td>
                  <td>
                    <span className="status success">
                      Success
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#TRX003</td>
                  <td>TechNova Pvt Ltd</td>
                  <td>₹7,200</td>
                  <td>02 Sep 2026</td>
                  <td>
                    <span className="status pending">
                      Pending
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#TRX004</td>
                  <td>Global Industries</td>
                  <td>₹4,800</td>
                  <td>02 Sep 2026</td>
                  <td>
                    <span className="status success">
                      Success
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#TRX005</td>
                  <td>Smart Systems</td>
                  <td>₹2,900</td>
                  <td>01 Sep 2026</td>
                  <td>
                    <span className="status failed">
                      Failed
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>


        {/* Bottom Cards */}
        <section className="bottom-grid">

          <div className="content-card small-card">

            <div className="card-title">
              <h2>Invoice Overview</h2>
              <span>September 2026</span>
            </div>

            <div className="invoice-row">
              <span>Paid Invoices</span>
              <strong>32</strong>
            </div>

            <div className="invoice-row">
              <span>Pending Invoices</span>
              <strong>10</strong>
            </div>

            <div className="invoice-row">
              <span>Overdue Invoices</span>
              <strong>6</strong>
            </div>

          </div>


          <div className="content-card small-card">

            <div className="card-title">
              <h2>System Status</h2>
              <span>Live</span>
            </div>

            <div className="system-status">
              <span className="online-dot"></span>
              <div>
                <strong>All Systems Operational</strong>
                <p>Backend API is running normally</p>
              </div>
            </div>

            <div className="system-status">
              <span className="online-dot"></span>
              <div>
                <strong>Database Connected</strong>
                <p>MongoDB connection active</p>
              </div>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;