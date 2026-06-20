import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { DollarSign, CheckCircle, Clock } from 'lucide-react';
import './DashboardTab.css'; // ✅ separate CSS file

const DashboardTab = ({ bookings: initialBookings = [] }) => {
  const [bookings, setBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/admin/groomer/all-bookings");
        if (res.data.success) {
        const mappedBookings = res.data.bookings
          .map((b) => ({
            _id: b._id,
            userName: b.name || "Pet Parent",
            serviceName: b.service || "Grooming",
            date: new Date(b.createdAt),
            finalAmount: b.finalAmount ?? 0,
            paymentStatus: b.paymentStatus || "pending",
            groomingStatus: b.groomingStatus || "waiting",
          }))
          .sort((a, b) => b.date - a.date); // 🔥 NEWEST FIRST

        setBookings(mappedBookings);

        } else {
          setError("Failed to fetch bookings from server.");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Server error while fetching bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (initialBookings.length === 0) fetchBookings();
  }, [initialBookings]);

  const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.finalAmount || 0), 0);
  const completedCount = bookings.filter(b => b.paymentStatus === "paid").length;
  const pendingCount = bookings.filter(b => b.paymentStatus === "pending").length;

  if (loading) return <p className="loading-text">Loading dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <>
      {/* Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><DollarSign /></div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p>₹{totalRevenue}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle /></div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p>{completedCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Clock /></div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p>{pendingCount}</p>
          </div>
        </div>
      </section>

      {/* Recent Bookings Table */}
      <section className="table-container">
        <div className="table-header">
          <h2>Recent Bookings</h2>
        </div>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.userName || "Pet Parent"}</td>
                  <td>{booking.serviceName || "Grooming"}</td>
                  <td>{booking.date.toLocaleDateString('en-IN')}</td>
                  <td>₹{booking.finalAmount}</td>
                  <td>
                    <span className={`status-badge ${booking.paymentStatus}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-row">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default DashboardTab;
