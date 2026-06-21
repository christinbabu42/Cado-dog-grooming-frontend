import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { OYO_PRIMARY, BOX_STYLE, CARD_BG } from "./Constants.jsx";

const BACKEND_BASE_URL = "https://cado-dog-grooming-backend.onrender.com";

const RoomBookingsPage = ({ isMobile }) => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // --- PREMIUM THEME CONSTANTS ---
  const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F9F295 50%, #B8860B 100%)";
  const PREMIUM_GOLD = "#B8860B";
  const PURE_BLACK = "#000000";
  const SOFT_WHITE = "#FFFFFF";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/Roombookings/all`);
      if (res.data.success) setBookings(res.data.bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const openBookingDetails = (bookingId) => {
    navigate(`/admin/Roombookings/${bookingId}`);
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await axios.delete(`${BACKEND_BASE_URL}/api/Roombookings/delete/${bookingId}`);
      if (res.data.success) {
        setBookings(bookings.filter(b => b._id !== bookingId));
        alert("Booking deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  };

  return (
    <div style={{ 
      ...BOX_STYLE, 
      padding: isMobile ? "15px" : "40px", 
      backgroundColor: "#F9F9F9", // Ultra light gray background to make white cards pop
      minHeight: "100vh"
    }}>
      {/* Global Style Injection for Hover Effects and Mobile Scroll */}
      <style>{`
        .premium-table-container::-webkit-scrollbar { height: 6px; }
        .premium-table-container::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }
        tr:hover { background-color: rgba(212, 175, 55, 0.05) !important; transition: 0.3s; }
        .gold-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(184, 134, 11, 0.4) !important; filter: brightness(1.1); }
        .delete-btn:hover { background-color: #8B0000 !important; transform: translateY(-2px); }
      `}</style>

      <h2 style={{ 
        color: PREMIUM_GOLD, 
        textAlign: "center", 
        fontSize: isMobile ? "24px" : "32px",
        fontWeight: "800",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: "30px",
        fontFamily: "'Playfair Display', serif"
      }}>
        Room Bookings Management
      </h2>

      <div
        className="premium-table-container"
        style={{
          marginTop: "20px",
          backgroundColor: SOFT_WHITE,
          borderRadius: "15px",
          padding: isMobile ? "10px" : "30px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          border: `1px solid rgba(184, 134, 11, 0.2)`,
          overflowX: "auto", // Makes it responsive on mobile
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "700px" : "100%" }}>
          <thead>
            <tr style={{ 
              background: GOLD_GRADIENT, 
              color: PURE_BLACK, 
              textAlign: "left"
            }}>
              <th style={{ padding: "15px", borderTopLeftRadius: "10px" }}>Customer Name</th>
              <th style={{ padding: "15px" }}>Room Type</th>
              <th style={{ padding: "15px" }}>Listing ID</th>
              <th style={{ padding: "15px" }}>Check-In</th>
              <th style={{ padding: "15px" }}>Total Price</th>
              <th style={{ padding: "15px", borderTopRightRadius: "10px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody style={{ color: PURE_BLACK }}>
            {bookings.map((booking) => (
              <tr key={booking._id} style={{ borderBottom: "1px solid #eee" }}>
                <td
                  style={{ 
                    padding: "15px", 
                    cursor: "pointer", 
                    fontWeight: "600",
                    color: PURE_BLACK 
                  }}
                  onClick={() => openBookingDetails(booking._id)}
                >
                  {booking.fullName}
                </td>

                <td style={{ padding: "15px", color: PURE_BLACK }}>{booking.roomName}</td>

                <td style={{ padding: "15px", fontSize: "12px", color: "#555" }}>
                  {booking.listingId}
                </td>

                <td style={{ padding: "15px", color: PURE_BLACK }}>
                  {new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>

                <td style={{ padding: "15px", fontWeight: "700", color: PURE_BLACK }}>
                  ₹{booking.totalAmount.toLocaleString('en-IN')}
                </td>

                <td style={{ padding: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    className="gold-btn"
                    onClick={() => openBookingDetails(booking._id)}
                    style={{
                      background: GOLD_GRADIENT,
                      color: PURE_BLACK,
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 10px rgba(184, 134, 11, 0.2)"
                    }}
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteBooking(booking._id)}
                    style={{
                      backgroundColor: "#000", // Sleek black for delete instead of bright red
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      transition: "all 0.3s ease"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {bookings.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
            No bookings found in the luxury records.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomBookingsPage;