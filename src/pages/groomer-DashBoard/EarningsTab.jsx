import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Wallet, IndianRupee, CreditCard } from "lucide-react";
import "./EarningsTab.css";

const EarningsTab = () => {
  const [groomers, setGroomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminEarnings = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/groomer-Earnings/admin/all"
        );

        if (res.data.success) {
          setGroomers(res.data.groomers);
        }
      } catch (err) {
        console.error("Admin earnings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminEarnings();
  }, []);

  if (loading) return <p>Loading earnings...</p>;
  if (!groomers.length) return <p>No grooming staff data</p>;

  return (
    <div className="earnings-wrapper fade-in">
      <h2 className="page-title">💰 Grooming Staff Payments</h2>

      {groomers.map((g) => (
        <div key={g.staffId} className="groomer-card admin-card">
          <h3>{g.groomerName}</h3>
          <p>{g.email}</p>

          <div className="earnings-grid">
            <div className="earn-card">
              <IndianRupee />
              <h4>Total Revenue</h4>
              <p>₹{g.totalRevenue}</p>
            </div>

            <div className="earn-card">
              <Wallet />
              <h4>Staff Earnings</h4>
              <p className="highlight">₹{g.totalEarning}</p>
            </div>

            <div className="earn-card">
              <CreditCard />
              <h4>Commission</h4>
              <p>₹{g.totalCommission}</p>
            </div>
          </div>

          <div className="payout-box">
            {g.bankDetails ? (
              <>
                <p>
                  Bank: <strong>{g.bankDetails.bankName}</strong>
                </p>
                <p>
                  A/C: ****{g.bankDetails.accountNumber?.slice(-4)}
                </p>

                <button
                  className="btn-payout"
                  onClick={async () => {
                    try {
                      const res = await axiosInstance.post(
                        `/api/payout/grstaff/pay-groomer/${g.staffId}`,
                        { amount: g.totalEarning }
                      );

                      if (res.data.success) {
                        alert("Sandbox payout triggered!");
                        const resUpdated = await axiosInstance.get("/api/groomer-Earnings/admin/all");
                        if (resUpdated.data.success) setGroomers(resUpdated.data.groomers);
                      } else {
                        alert("Failed: " + res.data.message);
                      }
                    } catch (err) {
                      console.error(err);
                      alert("Payout failed (sandbox)");
                    }
                  }}
                >
                  Pay Groomer
                </button>
              </>
            ) : (
              <p className="warning-text">
                ⚠️ Bank details not added
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EarningsTab;