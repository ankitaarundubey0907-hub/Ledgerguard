import { useState } from "react";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");

  const [message, setMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Save JWT token
        localStorage.setItem(
          "token",
          data.data.token
        );

        // Save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(data.data.user)
        );

        setIsLoggedIn(true);
      } else {
        setMessage(
          data.message || "Login failed"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Cannot connect to backend"
      );
    }
  };

  // =========================
  // REGISTER COMPANY
  // =========================

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(
          "Company created successfully. Please login."
        );

        setIsRegister(false);

        setCompanyName("");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(
          data.message || "Registration failed"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Cannot connect to backend"
      );
    }
  };

  // =========================
  // DASHBOARD
  // =========================

  if (isLoggedIn) {
    return (
      <Dashboard
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  // =========================
  // LOGIN / REGISTER PAGE
  // =========================

  return (
    <div className="login-page">

      <div className="login-card">

        {/* BRAND */}

        <div className="brand">

          <div className="brand-icon">
            L
          </div>

          <h1>
            Ledger<span>Guard</span>
          </h1>

        </div>

        <p className="login-subtitle">
          Smart financial management for your business
        </p>


        {/* =========================
            REGISTER
        ========================= */}

        {isRegister ? (

          <form onSubmit={handleRegister}>

            <label>
              Company Name
            </label>

            <input
              type="text"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
              required
            />


            <label>
              Admin Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />


            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />


            <button
              className="login-button"
              type="submit"
            >
              Create Company
            </button>

          </form>

        ) : (

          /* =========================
             LOGIN
          ========================= */

          <form onSubmit={handleLogin}>

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />


            <button
              className="login-button"
              type="submit"
            >
              Login
            </button>

          </form>

        )}


        {/* MESSAGE */}

        {message && (
          <p className="error-message">
            {message}
          </p>
        )}


        {/* SWITCH */}

        <button
          type="button"
          className="switch-auth-button"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New company? Create an account"}
        </button>


        <p className="login-footer">
          Secure business finance management
        </p>

      </div>

    </div>
  );
}

export default App;