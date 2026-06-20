import React, { useState, useEffect } from "react"; 
import axiosInstance from "../../utils/axiosInstance";
import {
  FaTrash,
  FaSearch,
  FaFilter,
  FaDog,
  FaCat,
  FaEye,
  FaCheckCircle,
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCalendarAlt,
  FaPaw,
  FaCalendarDay,
  FaUserTie,
  FaCreditCard,
  FaRoute
} from "react-icons/fa";
import "../groomer-DashBoard/BookingTab.css";

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- PREMIUM THEME CONSTANTS ---
  const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F9F295 50%, #B8860B 100%)";
  const PREMIUM_GOLD = "#B8860B";
  const PURE_BLACK = "#000000";
  const SOFT_WHITE = "#FFFFFF";

  // --- FILTER STATES ---
  const [dateRange, setDateRange] = useState("all"); 
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ✅ FETCH ALL BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/groomer/all-bookings");
        if (response.data.success) {
          const mappedBookings = response.data.bookings
            .map((b) => ({
              _id: b._id,
              userName: b.name || "Unknown User",
              petType: b.breed || "Dog",
              date: new Date(b.createdAt),
              finalAmount: b.finalAmount ?? 0,
              paymentStatus: b.paymentStatus || "pending",
              groomingStatus: b.groomingStatus || "waiting",
              rawData: b,
            }))
            .sort((a, b) => b.date - a.date); 

          setBookings(mappedBookings);
        } else {
          setError("Failed to fetch bookings.");
        }
      } catch (err) {
        setError("Server error while fetching bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ✅ DELETE BOOKING
  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await axiosInstance.delete(`/api/groomer/delete/${id}`);
      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      alert("Failed to delete booking");
    }
  };

  // ✅ TOGGLE GROOMING STATUS
  const toggleGroomingStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "waiting" : "completed";
    try {
      const res = await axiosInstance.put(`/api/groomer/update-status/${id}`, { status: newStatus });
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, groomingStatus: newStatus } : b))
        );
      }
    } catch (err) {
      alert("Failed to update grooming status");
    }
  };

  // ✅ TOGGLE PAYMENT STATUS
  const togglePaymentStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "paid" ? "pending" : "paid";
    try {
      const res = await axiosInstance.put(`/api/admin/groomer/update-payment/${id}`, { paymentStatus: newStatus });
      if (res.data.success) {
        setBookings(prev =>
          prev.map(b => (b._id === id ? { ...b, paymentStatus: newStatus } : b))
        );
      }
    } catch (err) {
      alert("Failed to update payment status");
      console.error(err);
    }
  };

  // ✅ VIEW DETAILS
  const openDetailsModal = async (bookingId) => {
    setModalLoading(true);
    try {
      const res = await axiosInstance.get(`/api/groomer/details/${bookingId}`);
      if (res.data.success) {
        setSelectedBooking(res.data.booking);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Error loading details.");
    } finally {
      setModalLoading(false);
    }
  };

  // ✅ FILTER LOGIC
  const filteredBookings = bookings.filter((b) => {
    const bookingDate = b.date;
    const now = new Date();
    const matchesSearch = 
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.petType.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;

    if (dateRange === "custom") {
      if (customStartDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && bookingDate >= start;
      }
      if (customEndDate) {
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && bookingDate <= end;
      }
    } else if (dateRange !== "all") {
      const timeDiff = now.getTime() - bookingDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      if (dateRange === "today") matchesDate = bookingDate.toDateString() === now.toDateString();
      if (dateRange === "2days") matchesDate = daysDiff <= 2;
      if (dateRange === "1week") matchesDate = daysDiff <= 7;
      if (dateRange === "1month") matchesDate = daysDiff <= 30;
      if (dateRange === "6month") matchesDate = daysDiff <= 180;
      if (dateRange === "1year") matchesDate = daysDiff <= 365;
    }

    return matchesSearch && matchesDate;
  });

  if (loading) return <div className="loader-container"><div className="spinner"></div><p>Loading luxury schedule...</p></div>;

  return (
    <div className="tab-content fade-in premium-theme" style={{ position: 'relative', background: '#fcfcfc', minHeight: '100vh' }}>
      
      {/* 0. INJECTED PREMIUM STYLES */}
      <style>{`
        .premium-theme * { color: #000000; }
        .premium-theme h2, .premium-theme h3, .premium-theme h4 { color: ${PREMIUM_GOLD} !important; font-family: 'Playfair Display', serif; }
        
        .premium-search-container {
            background: #fff;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.05);
            border: 1px solid rgba(184, 134, 11, 0.2);
            margin-bottom: 25px;
        }

        .gold-pill-btn {
            background: ${GOLD_GRADIENT} !important;
            color: #000 !important;
            font-weight: 700 !important;
            border-radius: 50px !important;
            border: none !important;
            padding: 8px 16px !important;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
            cursor: pointer;
            transition: 0.3s;
        }

        .gold-pill-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(184, 134, 11, 0.4);
        }

        .premium-table thead {
            background: ${GOLD_GRADIENT} !important;
        }

        .premium-table th {
            color: #000 !important;
            font-weight: 800 !important;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
        }

        .status-pill.paid { background: #dcfce7 !important; color: #15803d !important; border: 1px solid #15803d; }
        .status-pill.pending { background: #000 !important; color: #fff !important; }

        .grooming-btn-toggle.completed { background: ${GOLD_GRADIENT} !important; color: #000 !important; }
        .grooming-btn-toggle.waiting { background: #f3f4f6 !important; border: 1px solid #d1d5db !important; }

        .modal-header-premium {
            background: ${GOLD_GRADIENT} !important;
        }
      `}</style>

      {/* 1. HEADER ACTIONS */}
      <div className="premium-search-container section-header-actions-complex">
        <div className="search-bar-alt" style={{ border: `1px solid ${PREMIUM_GOLD}` }}>
          <FaSearch className="search-icon" style={{ color: PREMIUM_GOLD }} />
          <input
            type="text"
            placeholder="Search luxury bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ color: '#000' }}
          />
        </div>

        <div className="date-filter-group">
          <div className="select-wrapper">
            <FaCalendarDay className="select-icon" style={{ color: PREMIUM_GOLD }} />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
              style={{ border: `1px solid ${PREMIUM_GOLD}`, color: '#000' }}
            >
              <option value="all">All Records</option>
              <option value="today">Today's Schedule</option>
              <option value="2days">Last 2 Days</option>
              <option value="1week">Last 1 Week</option>
              <option value="1month">Last 1 Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === "custom" && (
            <div className="custom-date-inputs">
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
              <span>to</span>
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
            </div>
          )}
        </div>
      </div>

      {/* 2. TABLE */}
      <div className="glass-card table-container-alt" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(184, 134, 11, 0.1)' }}>
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <p style={{ color: '#666' }}>No bookings found for this selection.</p>
            <button className="gold-pill-btn" onClick={() => {setDateRange("all"); setSearchTerm("");}}>Clear Filters</button>
          </div>
        ) : (
          <div className="custom-table-wrapper">
            <table className="modern-table premium-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Pet Detail</th>
                  <th>Appointment</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Grooming</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="table-row-hover" style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td data-label="Customer">
                      <div className="user-cell">
                        <div className="user-avatar-small" style={{ background: PREMIUM_GOLD }}>{b.userName.charAt(0)}</div>
                        <div>
                          <p className="user-name-text" style={{ fontWeight: '700' }}>{b.userName}</p>
                          <p className="user-subtext">REF: {b._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td data-label="Pet Detail">
                      <div className="pet-tag" style={{ background: '#fff', border: `1px solid ${PREMIUM_GOLD}` }}>
                        {b.petType.toLowerCase().includes("cat") ? <FaCat color={PREMIUM_GOLD}/> : <FaDog color={PREMIUM_GOLD}/>}
                        <span style={{ fontWeight: '600' }}>{b.petType}</span>
                      </div>
                    </td>
                    <td data-label="Appointment">
                      <p className="date-text" style={{ fontWeight: 'bold' }}>{b.date.toLocaleDateString()}</p>
                      <p className="time-text" style={{ opacity: 0.7 }}>{b.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </td>
                    <td data-label="Amount"><span className="price-text" style={{ color: '#000', fontWeight: '800' }}>₹{b.finalAmount}</span></td>
                    <td data-label="Payment">
                      <button 
                        className={`status-pill ${b.paymentStatus}`} 
                        onClick={() => togglePaymentStatus(b._id, b.paymentStatus)}
                        style={{ cursor: 'pointer', borderRadius: '50px', fontWeight: 'bold' }}
                      >
                        {b.paymentStatus}
                      </button>
                    </td>
                    <td data-label="Grooming">
                      <button 
                        onClick={() => toggleGroomingStatus(b._id, b.groomingStatus)}
                        className={`grooming-btn-toggle ${b.groomingStatus}`}
                        style={{ fontWeight: '700', borderRadius: '50px' }}
                      >
                        <FaCheckCircle /> {b.groomingStatus}
                      </button>
                    </td>
                    <td data-label="Actions" style={{ display: 'flex', gap: '5px' }}>
                      <button className="gold-pill-btn" onClick={() => openDetailsModal(b._id)}>
                        {modalLoading && selectedBooking?._id === b._id ? "..." : <FaEye />}
                      </button>
                      <button className="delete-icon-btn" onClick={() => deleteBooking(b._id)} style={{ color: '#ff4d4d' }}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. MODAL COMPONENT */}
      {isModalOpen && selectedBooking && (
        <div className="custom-modal-portal">
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)} />
          <div className="modal-card-container">
            <div className="modal-card">
              <div className="modal-header-premium">
                <div>
                  <h3>Booking Details</h3>
                  <p className="modal-subtitle">ID: {selectedBooking._id}</p>
                </div>
                <button className="close-x-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
              </div>
              
              <div className="modal-scroll-body">
                {/* User & Pet Info */}
                <div className="modal-section-title">Customer & Pet Information</div>
                <div className="modal-user-profile">
                  <div className="avatar-circle-lg">{selectedBooking.name?.charAt(0) || "U"}</div>
                  <div className="profile-details">
                    <h4>{selectedBooking.name}</h4>
                    <span><FaPhoneAlt /> {selectedBooking.phone}</span>
                    <p style={{marginTop: '5px'}}><FaPaw /> <strong>{selectedBooking.petName}</strong> ({selectedBooking.breed})</p>
                  </div>
                </div>

                {/* Groomer / Staff Info */}
                <div className="modal-section-title">Assigned Groomer</div>
                <div className="info-box-highlight">
                   <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <FaUserTie size={24} color="#4f46e5" />
                      <div>
                        <p style={{margin: 0, fontWeight: 'bold'}}>{selectedBooking.staffName || "Not Assigned"}</p>
                        <p style={{margin: 0, fontSize: '12px', opacity: 0.7}}>Staff ID: {selectedBooking.staffId}</p>
                                              {/* ✅ NEW PHONE FIELDS */}
                      <p style={{ marginTop: "6px", fontSize: "13px" }}>
                        <FaPhoneAlt /> Primary:{" "}
                        <strong>
                          {selectedBooking.staffPhone || "N/A"}
                        </strong>
                      </p>

                      <p style={{ fontSize: "13px" }}>
                        <FaPhoneAlt /> Alternate:{" "}
                        <strong>
                          {selectedBooking.staffAlternatePhone || "N/A"}
                        </strong>
                      </p>
                      </div>
                   </div>
                </div>

                {/* Service Details Grid */}
                <div className="modal-section-title">Service & Pricing</div>
                <div className="modal-info-grid">
                  <div className="info-box">
                    <label>Package</label>
                    <p className="highlight-text">{selectedBooking.service}</p>
                  </div>
                  <div className="info-box">
                    <label><FaCalendarAlt /> Date & Time</label>
                    <p>{new Date(selectedBooking.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  <div className="info-box">
                    <label><FaCreditCard /> Payment Method</label>
                    <p>{selectedBooking.paymentMethod} ({selectedBooking.paymentStatus})</p>
                  </div>
                  <div className="info-box">
                    <label>Booking Status</label>
                    <p>{selectedBooking.groomingStatus}</p>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="pricing-breakdown">
                    <div className="price-row"><span>Base Price:</span> <span>₹{selectedBooking.price}</span></div>
                    <div className="price-row"><span><FaRoute /> Travel Charge:</span> <span>₹{selectedBooking.travelCharge}</span></div>
                    <div className="price-row total"><span>Grand Total:</span> <span>₹{selectedBooking.finalAmount}</span></div>
                </div>

                {/* Location Section with Maps */}
                <div className="modal-section-title">Location Tracking</div>
                
                <div className="map-dual-container" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                   {/* User Location Map */}
                   <div className="address-section">
                    <label><FaMapMarkerAlt color="#ef4444"/> Customer Pickup Address</label>
                    <p className="address-text">{selectedBooking.address}</p>
                    <div className="small-map-frame">
                        <iframe 
                          title="user-map"
                          width="100%" 
                          height="150" 
                          style={{ border: 0, borderRadius: '8px', marginTop: '10px' }}
                          loading="lazy"
                          src={`https://maps.google.com/maps?q=${selectedBooking.userLocation?.lat},${selectedBooking.userLocation?.lng}&z=15&output=embed`}
                        ></iframe>
                    </div>
                  </div>

                  {/* Staff Location Map */}
                  <div className="address-section">
                    <label><FaUserTie color="#4f46e5"/> Groomer (Staff) Current Location</label>
                    <div className="small-map-frame">
                        <iframe 
                          title="staff-map"
                          width="100%" 
                          height="150" 
                          style={{ border: 0, borderRadius: '8px', marginTop: '10px' }}
                          loading="lazy"
                          src={`https://maps.google.com/maps?q=${selectedBooking.staffLocation?.lat},${selectedBooking.staffLocation?.lng}&z=15&output=embed`}
                        ></iframe>
                    </div>
                  </div>
                </div>

                <div className="modal-footer-status" style={{ marginTop: '20px', justifyContent: 'center' }}>
                  <span className={`pill-status p-${selectedBooking.paymentStatus}`} style={{ borderRadius: '50px' }}>{selectedBooking.paymentStatus}</span>
                  <span className={`pill-status g-${selectedBooking.groomingStatus}`} style={{ borderRadius: '50px' }}>{selectedBooking.groomingStatus}</span>
                </div>
                
                <button className="gold-pill-btn" style={{ width: '100%', marginTop: '20px', padding: '15px !important' }} onClick={() => setIsModalOpen(false)}>
                    Close Securely
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;