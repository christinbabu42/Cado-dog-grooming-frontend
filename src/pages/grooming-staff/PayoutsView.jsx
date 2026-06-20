import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const PayoutsView = () => {
  const [availableAmount, setAvailableAmount] = useState(0);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayoutSummary = async () => {
      try {
       const res = await axiosInstance.get("/api/payout/grstaff/staff/summary");

setAvailableAmount(res.data.availableForWithdrawal);
setPayouts(res.data.payouts);


        if (res.data.success) {
          setAvailableAmount(res.data.availableForWithdrawal);
          setPayouts(res.data.payouts);
        }
      } catch (err) {
        console.error("Failed to load payout summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutSummary();
  }, []);

  if (loading) return <p>Loading payouts...</p>;

  return (
    <div className="payouts-section">
      <div className="section-header">
        <h2>Payout History</h2>
        <p>Track your bank transfers and pending settlements.</p>
      </div>

      <div className="payout-summary-card">
        <div className="payout-balance">
          <span>Available for Withdrawal</span>
          <h2>₹{availableAmount.toLocaleString()}</h2>
        </div>

      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Reference ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.length > 0 ? (
              payouts.map((p) => (
                <tr key={p._id}>
<td>{p.payoutId}</td>
<td>{new Date(p.createdAt).toLocaleDateString()}</td>
<td>₹{p.amount.toLocaleString()}</td>
<td>Bank Transfer</td>
<td>
  <span className={`badge ${p.status === "processed" ? "success" : "warning"}`}>
    {p.status}
  </span>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No payout history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutsView;
