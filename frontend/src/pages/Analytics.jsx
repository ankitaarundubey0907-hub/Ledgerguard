import "./AdminPages.css";

function Analytics() {
  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Overview of billing and transaction performance</p>
        </div>

        <select className="period-select">
          <option>This Month</option>
          <option>Last Month</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>


      {/* Analytics Cards */}

      <div className="summary-cards">

        <div className="summary-card">
          <span>Total Revenue</span>
          <strong>₹24,500</strong>
          <small className="growth">↑ 12.5%</small>
        </div>

        <div className="summary-card">
          <span>Total Payments</span>
          <strong>156</strong>
          <small className="growth">↑ 8.2%</small>
        </div>

        <div className="summary-card">
          <span>Average Invoice</span>
          <strong>₹4,900</strong>
          <small className="growth">↑ 5.4%</small>
        </div>

        <div className="summary-card">
          <span>Success Rate</span>
          <strong>91%</strong>
          <small className="growth">↑ 3.1%</small>
        </div>

      </div>


      {/* Revenue Chart */}

      <div className="admin-card">

        <div className="card-heading">
          <div>
            <h2>Revenue Overview</h2>
            <p>Monthly revenue performance</p>
          </div>
        </div>

        <div className="chart">

          <div className="chart-bar">
            <span style={{ height: "45%" }}></span>
            <label>Apr</label>
          </div>

          <div className="chart-bar">
            <span style={{ height: "60%" }}></span>
            <label>May</label>
          </div>

          <div className="chart-bar">
            <span style={{ height: "50%" }}></span>
            <label>Jun</label>
          </div>

          <div className="chart-bar">
            <span style={{ height: "75%" }}></span>
            <label>Jul</label>
          </div>

          <div className="chart-bar">
            <span style={{ height: "65%" }}></span>
            <label>Aug</label>
          </div>

          <div className="chart-bar">
            <span style={{ height: "90%" }}></span>
            <label>Sep</label>
          </div>

        </div>

      </div>


      {/* Analytics Bottom */}

      <div className="analytics-grid">

        <div className="admin-card">

          <h2>Invoice Statistics</h2>

          <div className="progress-item">
            <div>
              <span>Paid</span>
              <strong>67%</strong>
            </div>

            <div className="progress">
              <span style={{ width: "67%" }}></span>
            </div>
          </div>

          <div className="progress-item">
            <div>
              <span>Pending</span>
              <strong>21%</strong>
            </div>

            <div className="progress">
              <span style={{ width: "21%" }}></span>
            </div>
          </div>

          <div className="progress-item">
            <div>
              <span>Overdue</span>
              <strong>12%</strong>
            </div>

            <div className="progress">
              <span style={{ width: "12%" }}></span>
            </div>
          </div>

        </div>


        <div className="admin-card">

          <h2>Top Tenants</h2>

          <div className="tenant-ranking">
            <span>01</span>
            <div>
              <strong>ABC Enterprises</strong>
              <small>₹8,500 revenue</small>
            </div>
          </div>

          <div className="tenant-ranking">
            <span>02</span>
            <div>
              <strong>TechNova Pvt Ltd</strong>
              <small>₹6,700 revenue</small>
            </div>
          </div>

          <div className="tenant-ranking">
            <span>03</span>
            <div>
              <strong>Global Industries</strong>
              <small>₹4,800 revenue</small>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;