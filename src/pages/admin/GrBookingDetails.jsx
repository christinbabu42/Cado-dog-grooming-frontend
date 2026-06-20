import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./GrBookingDetails.css"; // We will define this below for a premium feel

const BACKEND_BASE_URL = "http://localhost:5000";

const GrBookingDetails = ({ isMobile }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/admin/groomer/groomer-booking-details/${id}`);
      setBooking(res.data.booking || null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-status-container">
        <div className="premium-loader"></div>
        <p>Fetching Golden Details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-status-container">
        <p>Booking not found.</p>
        <button className="gold-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="premium-page-container">
      <div className="booking-card">
        <div className="card-header">
          <button className="back-arrow" onClick={() => navigate(-1)}>←</button>
          <h2>Groomer Booking Details</h2>
          <div className="gold-divider"></div>
        </div>

<div className="card-body">

  {/* CUSTOMER INFO */}
  <section className="detail-section">
    <h3><span className="gold-dot"></span> Customer Info</h3>
    <div className="grid-info">
      <p><strong>Name:</strong> {booking.name}</p>
      <p><strong>Phone:</strong> {booking.phone}</p>
      <p><strong>Address:</strong> {booking.address}, {booking.city}</p>
      <p>
        <strong>User Location:</strong>{" "}
        {booking.userLocation
          ? `${booking.userLocation.lat}, ${booking.userLocation.lng}`
          : "N/A"}
      </p>
    </div>
  </section>

  {/* PET DETAILS */}
  <section className="detail-section">
    <h3><span className="gold-dot"></span> Pet Details</h3>
    <div className="grid-info">
      <p><strong>Pet Name:</strong> {booking.petName}</p>
      <p><strong>Breed:</strong> {booking.breed}</p>
    </div>
  </section>

  {/* BOOKING INFO */}
  <section className="detail-section">
    <h3><span className="gold-dot"></span> Booking Info</h3>
    <div className="grid-info">
      <p><strong>Service:</strong> {booking.service}</p>
      <p><strong>Date:</strong> {booking.date || "N/A"}</p>
      <p><strong>Time:</strong> {booking.time || "N/A"}</p>
      <p>
        <strong>Status:</strong>
        <span className={`status-tag ${booking.groomingStatus}`}>
          {booking.groomingStatus}
        </span>
      </p>
      <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
    </div>
  </section>

  {/* STAFF DETAILS */}
  <section className="detail-section">
    <h3><span className="gold-dot"></span> Staff Info</h3>
    <div className="grid-info">
      <p><strong>Name:</strong> {booking.staffName}</p>
      <p><strong>Phone:</strong> {booking.staffPhone || "N/A"}</p>
      <p><strong>Alt Phone:</strong> {booking.staffAlternatePhone || "N/A"}</p>
      <p><strong>Staff ID:</strong> {booking.staffId}</p>
      <p>
        <strong>Staff Location:</strong>{" "}
        {booking.staffLocation
          ? `${booking.staffLocation.lat}, ${booking.staffLocation.lng}`
          : "N/A"}
      </p>
    </div>
  </section>

  {/* PAYMENT DETAILS */}
  <section className="detail-section payment-highlight">
    <h3><span className="gold-dot"></span> Payment Details</h3>
    <div className="grid-info">
      <p><strong>Method:</strong> {booking.paymentMethod}</p>
      <p><strong>Status:</strong> {booking.paymentStatus}</p>
      <p><strong>Payment ID:</strong> {booking.paymentId || "N/A"}</p>
      <p><strong>Base Price:</strong> ₹{booking.price}</p>
      <p><strong>Travel Charge:</strong> ₹{booking.travelCharge || 0}</p>
      <p><strong>Distance:</strong> {booking.distanceKm || 0} km</p>
      <p className="price-tag">
        <strong>Final Amount:</strong> ₹{booking.finalAmount || booking.price}
      </p>
    </div>
  </section>

  {/* COMMISSION */}
  <section className="detail-section">
    <h3><span className="gold-dot"></span> Commission</h3>
    <div className="grid-info">
      <p><strong>Commission %:</strong> {booking.commissionPercent}%</p>
      <p><strong>Commission Amount:</strong> ₹{booking.commissionAmount || 0}</p>
      <p><strong>Staff Earning:</strong> ₹{booking.staffEarning || 0}</p>
    </div>
  </section>

  {/* PAYOUT */}
  <section className="detail-section">
    <h3><span className="gold-dot"></span> Payout Info</h3>
    <div className="grid-info">
      <p><strong>Status:</strong> {booking.payoutStatus}</p>
      <p><strong>Amount:</strong> ₹{booking.payoutAmount || "N/A"}</p>
      <p><strong>Currency:</strong> {booking.payoutCurrency || "INR"}</p>
      <p><strong>Payout ID:</strong> {booking.payoutId || "N/A"}</p>
      <p>
        <strong>Payout Date:</strong>{" "}
        {booking.payoutCreatedAt
          ? new Date(booking.payoutCreatedAt).toLocaleString()
          : "N/A"}
      </p>
    </div>
  </section>

  <button className="gold-btn-full" onClick={() => navigate(-1)}>
    Return to Dashboard
  </button>

</div>

      </div>
    </div>
  );
};

export default GrBookingDetails;