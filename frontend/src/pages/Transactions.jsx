import "./AdminPages.css";

function Transactions() {
  const transactions = [
    {
      id: "#TRX001",
      tenant: "ABC Enterprises",
      type: "Payment",
      amount: "₹5,000",
      date: "03 Sep 2026",
      status: "Success",
    },
    {
      id: "#TRX002",
      tenant: "XYZ Solutions",
      type: "Payment",
      amount: "₹3,500",
      date: "03 Sep 2026",
      status: "Success",
    },
    {
      id: "#TRX003",
      tenant: "TechNova Pvt Ltd",
      type: "Invoice",
      amount: "₹7,200",
      date: "02 Sep 2026",
      status: "Pending",
    },
    {
      id: "#TRX004",
      tenant: "Global Industries",
      type: "Payment",
      amount: "₹4,800",
      date: "02 Sep 2026",
      status: "Success",
    },
    {
      id: "#TRX005",
      tenant: "Smart Systems",
      type: "Payment",
      amount: "₹2,900",
      date: "01 Sep 2026",
      status: "Failed",
    },
  ];

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Monitor all billing transactions</p>
        </div>
      </div>

      <div className="summary-cards">

        <div className="summary-card">
          <span>Total Transactions</span>
          <strong>156</strong>
        </div>

        <div className="summary-card">
          <span>Successful</span>
          <strong>142</strong>
        </div>

        <div className="summary-card">
          <span>Pending</span>
          <strong>9</strong>
        </div>

        <div className="summary-card">
          <span>Failed</span>
          <strong>5</strong>
        </div>

      </div>

      <div className="admin-card">

        <div className="card-heading">

          <div>
            <h2>Transaction History</h2>
            <p>All recent transaction activities</p>
          </div>

          <button className="filter-btn">
            Filter
          </button>

        </div>

        <div className="table-wrapper">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Tenant</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {transactions.map((transaction) => (
                <tr key={transaction.id}>

                  <td>
                    <strong>{transaction.id}</strong>
                  </td>

                  <td>{transaction.tenant}</td>

                  <td>{transaction.type}</td>

                  <td>{transaction.amount}</td>

                  <td>{transaction.date}</td>

                  <td>

                    <span
                      className={
                        transaction.status === "Success"
                          ? "badge success"
                          : transaction.status === "Pending"
                          ? "badge pending"
                          : "badge failed"
                      }
                    >
                      {transaction.status}
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Transactions;