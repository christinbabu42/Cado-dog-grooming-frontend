import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaEye,
  FaPhone,
  FaMoneyBill,
  FaCheckCircle,
  FaTimes,
  FaDog,
  FaCalendarAlt,
  FaWallet,
  FaEnvelope,
  FaInfoCircle,
  FaReceipt
} from "react-icons/fa";
import axios from "axios";
import "./BookingsSection.css";

const HostBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const hostId = localStorage.getItem("userId");

  useEffect(() => {
    if (!hostId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/hostBookings/host/${hostId}`
        );

        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error("Booking Fetch Error:", err);
      }
    };

    fetchData();
  }, [hostId]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handlePayCommission = (booking) => {
    alert(`Pay commission for booking ${booking._id}`);
  };

  const handleContactGuest = (booking) => {
    alert(`Contact guest: ${booking.fullName} (${booking.email})`);
  };

  const BookingsSection = ({ bookings, onlyPending = false }) => {
    const filtered = onlyPending
      ? bookings.filter((b) => b.commissionStatus === "Pending")
      : bookings;

    return (
      <div className="bookings-wrapper">
        <h2 className="section-title gold-text">
          <FaBook className="mr-3" />
          {onlyPending ? "Pending Commissions" : "Bookings Registry"}
        </h2>

        {filtered.length === 0 ? (
          <div className="empty-state-gold">
            <FaCheckCircle className="gold-text" /> 
            <p className="gold-text font-bold text-lg">Your registry is clear!</p>
            <span className="text-dim">No records found for this section.</span>
          </div>
        ) : (
          <div className="premium-surface">
            <div className="desktop-only">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Guest Details</th>
                    <th>Dogs</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b._id} className="table-row-hover">
                      <td className="guest-cell">{b.fullName}</td>
                      <td><FaDog className="gold-text mr-2" /> {b.numDogs}</td>
                      <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                      <td>{b.paymentMethod}</td>
                      <td>
                        <span className={`status-pill ${b.paymentStatus === "paid" ? "paid" : "unpaid"}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="gold-text font-bold">₹{b.totalAmount}</td>
                      <td>
                        <div className="action-row">
                          <button onClick={() => handleViewBooking(b)} className="icon-btn" title="View Detail">
                            <FaEye />
                          </button>
                          {b.commissionStatus === "Pending" && (
                            <button onClick={() => handlePayCommission(b)} className="icon-btn pay-gold-hover" title="Pay Now">
                              <FaMoneyBill />
                            </button>
                          )}
                          <button onClick={() => handleContactGuest(b)} className="icon-btn" title="Contact">
                            <FaPhone />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-only card-stack">
              {filtered.map((b) => (
                <div key={b._id} className="booking-mobile-card">
                  <div className="card-top">
                    <span className="mobile-guest">{b.fullName}</span>
                    <span className={`status-pill ${b.paymentStatus === "paid" ? "paid" : "unpaid"}`}>
                        {b.paymentStatus}
                    </span>
                  </div>
                  <div className="card-mid">
                    <div className="mid-item"><FaDog className="gold-text" /> {b.numDogs} Dogs</div>
                    <div className="mid-item"><FaCalendarAlt className="gold-text" /> {new Date(b.checkInDate).toLocaleDateString()}</div>
                    <div className="mid-item price">₹{b.totalAmount}</div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleViewBooking(b)} className="m-btn view-m">
                      <FaEye /> View
                    </button>
                    {b.commissionStatus === "Pending" && (
                      <button onClick={() => handlePayCommission(b)} className="m-btn pay-m">
                        <FaWallet /> Pay Fee
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;

    return (
      <div className="gold-modal-overlay" onClick={onClose}>
        <div className="gold-modal-content slide-up" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="gold-text font-bold text-xl uppercase tracking-widest">Booking Details</h2>
            <button onClick={onClose} className="close-x"><FaTimes /></button>
          </div>
          
          <div className="modal-body custom-scrollbar" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            
            {/* --- GUEST INFO --- */}
            <div className="modal-section-label"><FaInfoCircle className="mr-2"/> Guest Information</div>
            <div className="detail-row">
              <span className="label">Guest Name:</span>
              <span className="value">{booking.fullName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{booking.email}</span>
            </div>
            <div className="detail-row">
              <span className="label">Mobile:</span>
              <span className="value">{booking.mobile}</span>
            </div>

            {/* --- STAY DETAILS --- */}
            {/* --- FINANCIAL DETAILS --- */}
<div className="modal-section-label mt-4">
  <FaReceipt className="mr-2"/> Pricing & Payment
</div>

<div className="detail-row">
  <span className="label">Payment Method:</span>
  <span className="value" style={{ textTransform: 'capitalize' }}>
    {booking.paymentMethod}
  </span>
</div>

<div className="detail-row">
  <span className="label">Payment Status:</span>
  <span
    className={`value status-pill ${booking.paymentStatus === "paid" ? "paid" : "unpaid"}`}
    style={{ fontSize: '0.8rem' }}
  >
    {booking.paymentStatus}
  </span>
</div>

{/* ✅ NEW — PAYMENT ID */}
<div className="detail-row">
  <span className="label">Payment ID:</span>
  <span
    className="value"
    style={{
      color: booking.paymentId ? "#D4AF37" : "#9ca3af",
      fontSize: "0.8rem",
      wordBreak: "break-all",
      fontWeight: "600"
    }}
  >
    {booking.paymentId || "Not paid yet"}
  </span>
</div>



            <div className="detail-row">
              <span className="label">Room Name:</span>
              <span className="value">{booking.roomName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Number of Dogs:</span>
              <span className="value">{booking.numDogs}</span>
            </div>
            <div className="detail-row">
              <span className="label">Stay Dates:</span>
              <span className="value">
                {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
              </span>
            </div>

            {/* --- FINANCIAL DETAILS --- */}
            <div className="modal-section-label mt-4"><FaReceipt className="mr-2"/> Pricing & Payment</div>
            <div className="detail-row">
              <span className="label">Price per Day:</span>
              <span className="value">₹{booking.pricePerDay || 0}</span>
            </div>
            <div className="detail-row">
              <span className="label">Additional Pet Charge:</span>
              <span className="value">₹{booking.additionalPetCharge || 0}</span>
            </div>
            <div className="detail-row">
              <span className="label">Coupon Discount:</span>
              <span className="value text-red-400">-₹{booking.couponDiscount || 0}</span>
            </div>
            <div className="detail-row">
              <span className="label">Instant Discount:</span>
              <span className="value text-red-400">-₹{booking.instantDiscount || 0}</span>
            </div>
            <div className="detail-row">
              <span className="label">Tax Rate:</span>
              <span className="value">{booking.taxRate || 0}%</span>
            </div>
            
            <div className="detail-row highlight-gold">
              <span className="label">Total Amount:</span>
              <span className="value">₹{booking.totalAmount}</span>
            </div>

            <div className="detail-row">
              <span className="label">Payment Method:</span>
              <span className="value" style={{textTransform: 'capitalize'}}>{booking.paymentMethod}</span>
            </div>
            <div className="detail-row">
              <span className="label">Payment Status:</span>
              <span className={`value status-pill ${booking.paymentStatus === "paid" ? "paid" : "unpaid"}`} style={{fontSize: '0.8rem'}}>
                {booking.paymentStatus}
              </span>
            </div>

            {/* --- SYSTEM INFO --- */}
            <div className="modal-section-label mt-4"><FaBook className="mr-2"/> System Status</div>
            <div className="detail-row">
              <span className="label">Booking Status:</span>
              <span className="value" style={{textTransform: 'capitalize', color: '#4ade80'}}>{booking.status || 'Active'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Created At:</span>
              <span className="value" style={{fontSize: '0.85rem'}}>
                {new Date(booking.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <button className="contact-btn-full" onClick={() => handleContactGuest(booking)}>
            <FaPhone className="mr-2" /> Contact Guest Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="premium-page-container">
      <BookingsSection bookings={bookings} />
      {showBookingModal && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default HostBookingsPage;