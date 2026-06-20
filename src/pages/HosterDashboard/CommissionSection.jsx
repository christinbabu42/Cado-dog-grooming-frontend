import React, { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "./SectionTitle";
import { FaMoneyCheckAlt, FaDog, FaCrown, FaHistory } from "react-icons/fa";
import "./CommissionSection.css"; // Import the separate CSS file

const CommissionSection = ({ hostId, onViewBooking }) => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({
    totalCashCommission: 0,
    pendingCommission: 0,
    totalProfit: 0
  });

  const [razorpayKey, setRazorpayKey] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/host/commission/razorpay-key")
      .then(res => setRazorpayKey(res.data.key));
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!hostId) return;

    const fetchCommissionData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/host/commission/${hostId}`
        );

        if (res.data?.success) {
          const cashBookings = (res.data.bookings || []).filter(
            b => b.paymentMethod === "Cash"
          );

          const totalCashCommission = cashBookings.reduce(
            (sum, b) => sum + (b.totals?.totalCommission || 0),
            0
          );

          const pendingCommission = cashBookings.reduce((sum, b) => {
            if (b.commissionPaid === false) {
              return sum + (b.totals?.totalCommission || 0);
            }
            return sum;
          }, 0);

          const totalProfit = cashBookings.reduce(
            (sum, b) => sum + (b.totals?.totalHostEarning || 0),
            0
          );

          setBookings(cashBookings);
          setSummary({
            totalCashCommission,
            pendingCommission,
            totalProfit
          });
        }
      } catch (err) {
        console.error("Failed to fetch commission data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionData();
  }, [hostId]);

  const handlePayCommission = async (amount) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/host/commission/create-order",
        { amount, hostId }
      );

      if (!res.data.success) return;

      const { order } = res.data;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: "Platform Commission",
        description: "Cash Booking Commission",
        order_id: order.id,
        handler: async function (response) {
          await axios.post(
            "http://localhost:5000/api/host/commission/verify",
            { ...response, hostId }
          );

          alert("✅ Commission paid successfully");
          window.location.reload();
        },
        theme: { color: "#D4AF37" } // Changed theme color to Gold
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="gold-spinner"></div>
        <p>Loading your royal earnings...</p>
      </div>
    );
  }

  return (
    <div className="commission-container">
      <SectionTitle
        icon={FaMoneyCheckAlt}
        title="Revenue Dashboard"
        description="Exclusive summary of your cash-based bookings and dues."
      />

      {/* ================= SUMMARY CARDS ================= */}
      <div className="summary-grid">
        <div className="summary-card">
          <p className="card-label">Total Commission</p>
          <p className="card-value">₹{summary.totalCashCommission.toLocaleString()}</p>
        </div>

        <div className="summary-card highlight-profit">
          <p className="card-label">Net Profit</p>
          <p className="card-value">₹{summary.totalProfit.toLocaleString()}</p>
        </div>

        <div className="summary-card highlight-pending">
          <p className="card-label">Outstanding Due</p>
          <p className="card-value">₹{summary.pendingCommission.toLocaleString()}</p>
        </div>

        <div className="action-card">
          {summary.pendingCommission > 0 ? (
            <button
              onClick={() => handlePayCommission(summary.pendingCommission)}
              className="pay-button"
            >
              Settle Due Now
            </button>
          ) : (
            <div className="all-settled">
              <FaCrown className="crown-icon" />
              <span>Fully Settled</span>
            </div>
          )}
        </div>
      </div>

      {/* ================= BOOKINGS LIST ================= */}
      <div className="list-header">
        <FaHistory />
        <h3>Transaction History</h3>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No cash commission pending. You're all caught up! 🎉</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map(b => (
            <div key={b._id} className="booking-card">
              <div className="card-left">
                <div className="dog-icon-wrapper">
                  <FaDog />
                </div>
                <div className="booking-info">
                  <h4>{b.roomName}</h4>
                  <p className="guest-name">Guest: <span>{b.fullName}</span></p>
                  <span className="payment-tag">Cash Payment</span>
                </div>
              </div>

              <div className="card-right">
                <div className="amount-group">
                  <p className="profit-text">Profit: <span>₹{b.totals?.totalHostEarning}</span></p>
                  <p className="commission-text">Fee: <span>₹{b.totals?.totalCommission}</span></p>
                </div>
                <button
                  onClick={() => onViewBooking(b)}
                  className="details-button"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommissionSection;