import { useState } from "react";
import "./Payment.css";

function Payment() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    setMessage("");
    setLoading(true);

    // Demo payment only — NO real transaction
    setTimeout(() => {
      setLoading(false);
      setMessage("Payment completed successfully.");
      setAmount("");
      setDescription("");
    }, 1200);
  };

  return (
    <div className="payment-page">

      {/* Header */}
      <div className="payment-header">
        <div className="payment-title">
          <div className="payment-logo">L</div>

          <div>
            <h1>Payments</h1>
            <p>Secure business payment management</p>
          </div>
        </div>

        <div className="secure-badge">
          🔒 Secure Payment
        </div>
      </div>


      <div className="payment-layout">

        {/* LEFT SIDE */}
        <div className="payment-info">

          <div className="welcome-payment">
            <span className="payment-small-label">
              LEDGERGUARD PAYMENTS
            </span>

            <h2>
              Simple.
              <br />
              Secure.
              <br />
              <span>Powerful.</span>
            </h2>

            <p>
              Manage your business payments through
              LedgerGuard's secure payment interface.
            </p>
          </div>


          <div className="payment-benefits">

            <div className="benefit">
              <div className="benefit-icon">✓</div>

              <div>
                <strong>Secure transactions</strong>
                <span>
                  Designed for secure business payments.
                </span>
              </div>
            </div>


            <div className="benefit">
              <div className="benefit-icon">₹</div>

              <div>
                <strong>INR payments</strong>
                <span>
                  Accept payments in Indian Rupees.
                </span>
              </div>
            </div>


            <div className="benefit">
              <div className="benefit-icon">⚡</div>

              <div>
                <strong>Instant confirmation</strong>
                <span>
                  Payment status is confirmed instantly.
                </span>
              </div>
            </div>

          </div>

        </div>


        {/* PAYMENT CARD */}
        <div className="payment-card">

          <div className="payment-card-header">

            <div>
              <span>MAKE A PAYMENT</span>
              <h2>Payment Details</h2>
            </div>

            <div className="card-icon">
              ₹
            </div>

          </div>


          <form onSubmit={handlePayment}>

            {/* Amount */}
            <div className="input-group">

              <label>Payment Amount</label>

              <div className="amount-input">

                <span>₹</span>

                <input
                  type="number"
                  min="1"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* Description */}
            <div className="input-group">

              <label>
                Description
                <small>Optional</small>
              </label>

              <input
                type="text"
                placeholder="e.g. Invoice payment"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>


            {/* PAYMENT METHODS */}
            <div className="input-group">

              <label>Payment Method</label>

              <div className="payment-methods">

                <button
                  type="button"
                  className={
                    method === "card"
                      ? "method active"
                      : "method"
                  }
                  onClick={() => setMethod("card")}
                >
                  💳
                  <span>Card</span>
                </button>


                <button
                  type="button"
                  className={
                    method === "upi"
                      ? "method active"
                      : "method"
                  }
                  onClick={() => setMethod("upi")}
                >
                  📱
                  <span>UPI</span>
                </button>


                <button
                  type="button"
                  className={
                    method === "bank"
                      ? "method active"
                      : "method"
                  }
                  onClick={() => setMethod("bank")}
                >
                  🏦
                  <span>Net Banking</span>
                </button>


                <button
                  type="button"
                  className={
                    method === "wallet"
                      ? "method active"
                      : "method"
                  }
                  onClick={() => setMethod("wallet")}
                >
                  👛
                  <span>Wallet</span>
                </button>

              </div>

            </div>


            {/* CARD INPUTS */}
            {method === "card" && (
              <div className="demo-fields">

                <input
                  type="text"
                  placeholder="Card number"
                />

                <div className="two-inputs">

                  <input
                    type="text"
                    placeholder="MM / YY"
                  />

                  <input
                    type="password"
                    placeholder="CVV"
                  />

                </div>

              </div>
            )}


            {/* UPI */}
            {method === "upi" && (
              <div className="demo-fields">

                <input
                  type="text"
                  placeholder="Enter UPI ID"
                />

              </div>
            )}


            {/* BANK */}
            {method === "bank" && (
              <div className="demo-fields">

                <select defaultValue="">
                  <option value="" disabled>
                    Select your bank
                  </option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>

              </div>
            )}


            {/* WALLET */}
            {method === "wallet" && (
              <div className="demo-fields">

                <select defaultValue="">
                  <option value="" disabled>
                    Select wallet
                  </option>
                  <option>Paytm</option>
                  <option>PhonePe</option>
                  <option>Amazon Pay</option>
                </select>

              </div>
            )}


            {/* SUMMARY */}
            {amount && (
              <div className="payment-summary">

                <div>
                  <span>Amount</span>

                  <strong>
                    ₹
                    {Number(amount).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>Payment method</span>

                  <strong>
                    {method === "card"
                      ? "Card"
                      : method === "upi"
                      ? "UPI"
                      : method === "bank"
                      ? "Net Banking"
                      : "Wallet"}
                  </strong>
                </div>

              </div>
            )}


            {/* BUTTON */}
            <button
              className="pay-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  Pay Now
                  <span>→</span>
                </>
              )}
            </button>

          </form>


          {/* MESSAGE */}
          {message && (
            <div className="payment-message success">
              <span>✓</span>
              {message}
            </div>
          )}


          <div className="payment-footer">
            🔒
            <p>
              Demo payment interface. No real money
              is charged or transferred.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Payment;