import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="logo">
          <span className="logo-box">L</span>
          LedgerGuard
        </div>

        <h1>Create Account</h1>

        <p>Register your organization with LedgerGuard</p>

        <form>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Organization Name</label>
          <input
            type="text"
            placeholder="Enter organization name"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
          />

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="bottom-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;