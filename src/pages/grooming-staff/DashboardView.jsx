import React, { useEffect, useState } from "react";
import { TrendingUp, Wallet, ChevronRight, Calendar } from "lucide-react";
import axios from "axios";
import "./DashboardView.css"; 

const DashboardView = ({ staffProfile, earnings: initialEarnings }) => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [filteredEarnings, setFilteredEarnings] = useState(initialEarnings);
  const [timeRange, setTimeRange] = useState("today");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataByRange = async () => {
      if (!staffProfile?._id) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        // API call includes the range parameter to filter data on the backend
        const { data } = await axios.get(
          `http://localhost:5000/api/groomer/staff/earnings/${staffProfile._id}?range=${timeRange}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          // Update the table data
          setRecentBookings(data.recentBookings || []);
          // Update the stat cards data based on selection
          setFilteredEarnings(data.stats || initialEarnings);
        }
      } catch (err) {
        console.error("Error fetching filtered data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataByRange();
  }, [staffProfile, timeRange, initialEarnings]);

  return (
    <>
      <div className="dashboard-header">
        <div className="welcome-banner">
          <h1>Welcome back, {staffProfile?.fullName?.split(" ")[0]}! 👋</h1>
          <p>Displaying performance for <strong>{timeRange.replace("1", "1 ")}</strong></p>
        </div>

        <div className="filter-container">
          <div className="select-wrapper">
            <Calendar size={18} className="calendar-icon" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
              disabled={loading}
            >
              <option value="today">Today</option>
              <option value="1week">1 Week</option>
              <option value="1month">1 Month</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`stats-grid ${loading ? "opacity-50" : ""}`}>
        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp />
          </div>
          <div className="stat-data">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-value">{filteredEarnings?.totalBookings || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Wallet />
          </div>
          <div className="stat-data">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">
              ₹{filteredEarnings?.totalRevenue?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <ChevronRight />
          </div>
          <div className="stat-data">
            <span className="stat-label">Platform Charges</span>
            <span className="stat-value">
              ₹{filteredEarnings?.totalCommission?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon white">
            <TrendingUp />
          </div>
          <div className="stat-data">
            <span className="stat-label">Net Earnings</span>
            <span className="stat-value">
              ₹{filteredEarnings?.totalEarning?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Performance Details</h3>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody className={loading ? "opacity-50" : ""}>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.service}</td>
                    <td>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          booking.groomingStatus === "completed"
                            ? "success"
                            : booking.groomingStatus === "waiting"
                            ? "warning"
                            : "pending"
                        }`}
                      >
                        {booking.groomingStatus.charAt(0).toUpperCase() +
                          booking.groomingStatus.slice(1)}
                      </span>
                    </td>
                    <td>₹{booking.staffEarning?.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                    {loading ? "Loading data..." : "No bookings found for this period."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardView;