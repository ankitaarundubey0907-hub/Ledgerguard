import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Abhi frontend demo ke liye
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="logo">
          <span className="logo-box">L</span>
          LedgerGuard
        </div>

        <h1>Welcome Back</h1>

        <p>Sign in to manage your billing & transactions</p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="bottom-text">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;