import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BOX_STYLE, OYO_PRIMARY } from "./Constants.jsx";

const BACKEND_BASE_URL = "https://cado-dog-grooming-backend.onrender.com";

const RoomBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/Roombookings/${id}`);
      if (res.data.success) setBooking(res.data.booking);
    } catch (err) {
      console.error("Error loading booking:", err);
    }
  };

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div style={{ ...BOX_STYLE, padding: "30px" }}>
      <h2 style={{ color: OYO_PRIMARY }}>Booking Details</h2>

      <hr />

      {/* ================= CUSTOMER INFO ================= */}
      <h4>Customer Details</h4>
      <p><strong>Name:</strong> {booking.fullName}</p>
      <p><strong>Email:</strong> {booking.email}</p>
      <p><strong>Mobile:</strong> {booking.mobile}</p>
      <p><strong>User ID:</strong> {booking.userId?._id || booking.userId}</p>

      <hr />

      {/* ================= LISTING INFO ================= */}
      <h4>Listing Details</h4>
      <p><strong>Room Name:</strong> {booking.roomName}</p>
      <p><strong>Listing ID:</strong> {booking.listingId}</p>

      <p><strong>Host Name:</strong> {booking.hostId?.name || "N/A"}</p>
      <p><strong>Host ID:</strong> {booking.hostId?._id || "N/A"}</p>

      <hr />

      {/* ================= BOOKING INFO ================= */}
      <h4>Booking Information</h4>
      <p><strong>Check In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
      <p><strong>Check Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
      <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
      <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
      <p><strong>Status:</strong> {booking.bookingStatus}</p>

      {/* ================= COMMISSION ================= */}
      {booking.totals && (
        <>
          <hr />
          <h4>Commission Breakdown</h4>
          <p><strong>Nights:</strong> {booking.totals.nights}</p>
          <p><strong>Platform Commission:</strong> ₹{booking.totals.totalCommission}</p>
          <p><strong>Host Earning:</strong> ₹{booking.totals.totalHostEarning}</p>
        </>
      )}

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "20px",
          backgroundColor: OYO_PRIMARY,
          color: "#fff",
          padding: "8px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>
    </div>
  );
};

export default RoomBookingDetails;
