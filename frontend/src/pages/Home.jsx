import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-box">L</span>
          LedgerGuard
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">

        <div className="hero-content">
          <p className="small-title">
            Secure Multi-Tenant Billing Platform
          </p>

          <h1>
            Manage Billing & Transactions
            <br />
            With Confidence
          </h1>

          <p className="hero-text">
            LedgerGuard provides secure billing, transaction management,
            analytics and real-time monitoring for modern enterprises.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>

            <a href="#features" className="secondary-btn">
              Explore Features
            </a>
          </div>
        </div>

      </section>

      {/* Features */}
      <section id="features" className="features">

        <h2>Powerful Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Access</h3>
            <p>
              Secure authentication and protected organizational data.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Multi-Tenant</h3>
            <p>
              Manage multiple organizations with isolated data.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Billing Management</h3>
            <p>
              Manage invoices and billing operations easily.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>
              Monitor transactions and business performance.
            </p>
          </div>

        </div>
      </section>

      {/* About */}
      <section id="about" className="about">
        <h2>About LedgerGuard</h2>

        <p>
          LedgerGuard is an enterprise billing and transaction management
          system designed for secure and reliable financial operations.
        </p>
      </section>

      <footer>
        © 2026 LedgerGuard. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;