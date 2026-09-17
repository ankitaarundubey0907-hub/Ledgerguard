import { useEffect, useState } from "react";
import "./AdminPages.css";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>View your LedgerGuard account information</p>
        </div>
      </div>

      <div className="admin-card">

        <div className="card-heading">
          <div>
            <h2>Profile Information</h2>
            <p>Your account details</p>
          </div>
        </div>

        <div style={{ padding: "20px" }}>

          <div className="modal-field">
            <label>Name</label>
            <strong>
              {user?.name || "Not available"}
            </strong>
          </div>

          <div className="modal-field">
            <label>Email</label>
            <strong>
              {user?.email || "Not available"}
            </strong>
          </div>

          <div className="modal-field">
            <label>Role</label>
            <strong>
              {user?.role || "Administrator"}
            </strong>
          </div>

          <div className="modal-field">
            <label>Account Status</label>
            <strong style={{ color: "#16a34a" }}>
              Active
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;