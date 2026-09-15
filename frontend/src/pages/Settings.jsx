import { useEffect, useState } from "react";
import "./AdminPages.css";

function Settings() {

  // =========================
  // ADMIN PROFILE
  // =========================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: ""
  });

  const [editing, setEditing] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [loading, setLoading] = useState(true);


  // =========================
  // COMPANY PROFILE
  // =========================

  const [company, setCompany] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: ""
  });

  const [companyEditing, setCompanyEditing] = useState(false);
  const [companyMessage, setCompanyMessage] = useState("");
  const [companyLoading, setCompanyLoading] = useState(true);


  // =========================
  // GET ADMIN PROFILE
  // =========================

  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {

        setProfile({
          name: data.data.name || "",
          email: data.data.email || "",
          role: data.data.role || ""
        });

      } else {

        setProfileMessage(
          data.message || "Failed to load profile"
        );

      }

    } catch (error) {

      setProfileMessage(
        "Unable to connect to backend"
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // GET COMPANY PROFILE
  // =========================

  const fetchCompany = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/tenants/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {

        setCompany({
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
          website: data.data.website || ""
        });

      } else {

        setCompanyMessage(
          data.message || "Failed to load company profile"
        );

      }

    } catch (error) {

      setCompanyMessage(
        "Unable to connect to backend"
      );

    } finally {

      setCompanyLoading(false);

    }
  };


  // =========================
  // LOAD BOTH PROFILES
  // =========================

  useEffect(() => {

    fetchProfile();
    fetchCompany();

  }, []);


  // =========================
  // ADMIN INPUT CHANGE
  // =========================

  const handleProfileChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });

  };


  // =========================
  // COMPANY INPUT CHANGE
  // =========================

  const handleCompanyChange = (e) => {

    setCompany({
      ...company,
      [e.target.name]: e.target.value
    });

  };


  // =========================
  // UPDATE ADMIN PROFILE
  // =========================

  const handleUpdateProfile = async (e) => {

    e.preventDefault();

    setProfileMessage("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name: profile.name,
            email: profile.email
          })
        }
      );

      const data = await response.json();

      if (data.success) {

        setProfileMessage(
          "Profile updated successfully!"
        );

        setEditing(false);

        localStorage.setItem(
          "user",
          JSON.stringify(data.data)
        );

        fetchProfile();

      } else {

        setProfileMessage(
          data.message || "Failed to update profile"
        );

      }

    } catch (error) {

      setProfileMessage(
        "Unable to connect to backend"
      );

    }

  };


  // =========================
  // UPDATE COMPANY PROFILE
  // =========================

  const handleUpdateCompany = async (e) => {

    e.preventDefault();

    setCompanyMessage("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/tenants/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name: company.name,
            email: company.email,
            phone: company.phone,
            address: company.address,
            website: company.website
          })
        }
      );

      const data = await response.json();

      if (data.success) {

        setCompanyMessage(
          "Company profile updated successfully!"
        );

        setCompanyEditing(false);

        fetchCompany();

      } else {

        setCompanyMessage(
          data.message || "Failed to update company profile"
        );

      }

    } catch (error) {

      setCompanyMessage(
        "Unable to connect to backend"
      );

    }

  };


  return (
    <div className="admin-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">

        <div>

          <h1>Settings</h1>

          <p>
            Manage your LedgerGuard settings
          </p>

        </div>

      </div>


      <div className="settings-grid">


        {/* =========================
            ADMIN PROFILE
        ========================= */}

        <div className="admin-card">

          <h2>Admin Profile</h2>

          <p className="card-description">
            Update your administrator information
          </p>


          {loading ? (

            <p>Loading profile...</p>

          ) : (

            <form onSubmit={handleUpdateProfile}>

              <div className="form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  readOnly={!editing}
                  required
                />

              </div>


              <div className="form-group">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  readOnly={!editing}
                  required
                />

              </div>


              <div className="form-group">

                <label>Role</label>

                <input
                  type="text"
                  value={
                    profile.role === "admin"
                      ? "Administrator"
                      : "User"
                  }
                  readOnly
                />

              </div>


              {editing ? (

                <>

                  <button
                    type="submit"
                    className="primary-btn"
                  >
                    Save Changes
                  </button>


                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {

                      setEditing(false);
                      setProfileMessage("");
                      fetchProfile();

                    }}
                    style={{
                      marginLeft: "10px"
                    }}
                  >
                    Cancel
                  </button>

                </>

              ) : (

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {

                    setEditing(true);
                    setProfileMessage("");

                  }}
                >
                  Update Profile
                </button>

              )}

            </form>

          )}


          {profileMessage && (

            <p
              style={{
                marginTop: "15px",
                fontWeight: "bold"
              }}
            >
              {profileMessage}
            </p>

          )}

        </div>


        {/* =========================
            COMPANY PROFILE
        ========================= */}

        <div className="admin-card">

          <h2>Company Profile</h2>

          <p className="card-description">
            Manage your company's information
          </p>


          {companyLoading ? (

            <p>Loading company information...</p>

          ) : (

            <form onSubmit={handleUpdateCompany}>

              <div className="form-group">

                <label>Company Name</label>

                <input
                  type="text"
                  name="name"
                  value={company.name}
                  onChange={handleCompanyChange}
                  readOnly={!companyEditing}
                  required
                />

              </div>


              <div className="form-group">

                <label>Company Email</label>

                <input
                  type="email"
                  name="email"
                  value={company.email}
                  onChange={handleCompanyChange}
                  readOnly={!companyEditing}
                />

              </div>


              <div className="form-group">

                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={company.phone}
                  onChange={handleCompanyChange}
                  readOnly={!companyEditing}
                  placeholder="Enter company phone"
                />

              </div>


              <div className="form-group">

                <label>Address</label>

                <input
                  type="text"
                  name="address"
                  value={company.address}
                  onChange={handleCompanyChange}
                  readOnly={!companyEditing}
                  placeholder="Enter company address"
                />

              </div>


              <div className="form-group">

                <label>Website</label>

                <input
                  type="text"
                  name="website"
                  value={company.website}
                  onChange={handleCompanyChange}
                  readOnly={!companyEditing}
                  placeholder="https://example.com"
                />

              </div>


              {companyEditing ? (

                <>

                  <button
                    type="submit"
                    className="primary-btn"
                  >
                    Save Company
                  </button>


                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {

                      setCompanyEditing(false);
                      setCompanyMessage("");
                      fetchCompany();

                    }}
                    style={{
                      marginLeft: "10px"
                    }}
                  >
                    Cancel
                  </button>

                </>

              ) : (

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {

                    setCompanyEditing(true);
                    setCompanyMessage("");

                  }}
                >
                  Update Company

                </button>

              )}

            </form>

          )}


          {companyMessage && (

            <p
              style={{
                marginTop: "15px",
                fontWeight: "bold"
              }}
            >
              {companyMessage}
            </p>

          )}

        </div>


        {/* =========================
            SECURITY
        ========================= */}

        <div className="admin-card">

          <h2>Security</h2>

          <p className="card-description">
            Manage account security settings
          </p>


          <div className="setting-row">

            <div>

              <strong>
                Two-Factor Authentication
              </strong>

              <p>
                Add an extra layer of security
              </p>

            </div>


            <label className="switch">

              <input type="checkbox" />

              <span></span>

            </label>

          </div>


          <div className="setting-row">

            <div>

              <strong>
                Email Notifications
              </strong>

              <p>
                Receive important account updates
              </p>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>


          <div className="setting-row">

            <div>

              <strong>
                Transaction Alerts
              </strong>

              <p>
                Get notified about transactions
              </p>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>

        </div>


        {/* =========================
            SYSTEM INFORMATION
        ========================= */}

        <div className="admin-card">

          <h2>System Information</h2>


          <div className="info-row">

            <span>Application</span>

            <strong>
              LedgerGuard
            </strong>

          </div>


          <div className="info-row">

            <span>Version</span>

            <strong>
              1.0.0
            </strong>

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