import "./AdminPages.css";

function Settings() {
  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your LedgerGuard admin settings</p>
        </div>
      </div>


      <div className="settings-grid">

        {/* Profile */}

        <div className="admin-card">

          <h2>Admin Profile</h2>
          <p className="card-description">
            Update your administrator information
          </p>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value="Admin"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value="admin@ledgerguard.com"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              value="Administrator"
              readOnly
            />
          </div>

          <button className="primary-btn">
            Update Profile
          </button>

        </div>


        {/* Security */}

        <div className="admin-card">

          <h2>Security</h2>
          <p className="card-description">
            Manage account security settings
          </p>

          <div className="setting-row">
            <div>
              <strong>Two-Factor Authentication</strong>
              <p>Add an extra layer of security</p>
            </div>

            <label className="switch">
              <input type="checkbox" />
              <span></span>
            </label>
          </div>

          <div className="setting-row">
            <div>
              <strong>Email Notifications</strong>
              <p>Receive important account updates</p>
            </div>

            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>

          <div className="setting-row">
            <div>
              <strong>Transaction Alerts</strong>
              <p>Get notified about transactions</p>
            </div>

            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>

        </div>


        {/* System */}

        <div className="admin-card">

          <h2>System Information</h2>

          <div className="info-row">
            <span>Application</span>
            <strong>LedgerGuard</strong>
          </div>

          <div className="info-row">
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>

          <div className="info-row">
            <span>Backend</span>
            <strong className="online-text">
              ● Connected
            </strong>
          </div>

          <div className="info-row">
            <span>Database</span>
            <strong className="online-text">
              ● MongoDB
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;