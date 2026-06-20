import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaDog, FaTachometerAlt, FaHome, FaBook, FaMoneyCheckAlt, FaWallet,
  FaStar, FaBell, FaUserCog, FaBars, FaTimes, FaPlusCircle
} from "react-icons/fa";

import StatCard from "./StatCard";
import SectionTitle from "./SectionTitle";
import RoomsSection from "./RoomsSection";
import BookingsSection from "./BookingsSection";
import CommissionSection from "./CommissionSection";
import WalletSection from "./WalletSection";
import ReviewsSection from "./ReviewsSection";
import BookingDetailsModal from "./BookingDetailsModal";
import HostProfile from "./HostProfile";

import './A-RoomHosterDashboard.css';

const RoomHosterDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    host: {},
    rooms: [],
    bookings: [],
    reviews: [],
    wallet: {},
    summary: {
      totalBookings: 0,
      upcomingBookings: 0,
      totalEarnings: 0,
      pendingCommission: 0,
      paymentMethodsUsed: {},
    }
  });

  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newBookingsCount, setNewBookingsCount] = useState(0);
  const [hasNewBookings, setHasNewBookings] = useState(false);

  if (localStorage.getItem("token") && !localStorage.getItem("userId")) {
    localStorage.clear();
  }

  useEffect(() => {
    const storeGoogleTokenIfExists = () => {
      const params = new URLSearchParams(window.location.search);
      const hostToken = params.get("token");
      if (hostToken) {
        const decoded = JSON.parse(atob(hostToken.split(".")[1]));
        localStorage.setItem("token", hostToken);
        localStorage.setItem("authToken", hostToken);
        localStorage.setItem("userId", decoded.mongoId);
        localStorage.setItem("hostId", decoded.mongoId);
        if (decoded.googleId) localStorage.setItem("googleId", decoded.googleId);
        if (decoded.email) localStorage.setItem("email", decoded.email);
        window.history.replaceState({}, document.title, "/HostDashboard");
      }
    };

    storeGoogleTokenIfExists();

    const loadHostData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");

        if (!userId || !token) {
          navigate("/host-login");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const bookingRes = await axios.get(`http://localhost:5000/api/hostBookings/host/${userId}`, config);
        const bookings = bookingRes.data.success ? bookingRes.data.bookings : [];

        const lastSeen = localStorage.getItem("lastSeenBookingsAt");
        let newCount = 0;
        if (lastSeen) {
          newCount = bookings.filter(b => new Date(b.createdAt) > new Date(lastSeen)).length;
        }

        setNewBookingsCount(newCount);
        setHasNewBookings(newCount > 0);

        const summary = {
          totalBookings: bookings.length,
          upcomingBookings: bookings.filter(b => new Date(b.checkInDate) > new Date()).length,
          totalEarnings: bookings.reduce((sum, b) => sum + (b.totals?.totalHostEarning || 0), 0),
          pendingCommission: bookings.reduce((sum, b) => {
            if (b.paymentMethod === "Cash" && b.commissionPaid === false) {
              return sum + (b.totals?.totalCommission || 0);
            }
            return sum;
          }, 0),
          paymentMethodsUsed: bookings.reduce((acc, b) => {
            acc[b.paymentMethod] = (acc[b.paymentMethod] || 0) + 1;
            return acc;
          }, {})
        };

        const reviewRes = await axios.get(`http://localhost:5000/api/host-reviews/host/${userId}`, config);
        const reviews = reviewRes.data.reviews || [];

        const hostRes = await axios.get("http://localhost:5000/api/hosts/profile", config);
        const hostProfile = hostRes.data.success ? hostRes.data.host : {};

        const roomRes = await axios.get(`http://localhost:5000/api/rooms/user/${userId}`, config);
        const rooms = roomRes.data.rooms || [];

        if (rooms.length) {
          localStorage.setItem("hostListingIds", JSON.stringify(rooms.map(r => r._id)));
        }

        const walletRes = await axios.get(`http://localhost:5000/api/wallet/summary/${userId}`, config);
        const wallet = walletRes.data.wallet || {};

        setData({ host: hostProfile, rooms, bookings, reviews, wallet, summary });
      } catch (err) {
        console.error("Dashboard Load Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHostData();
  }, [navigate]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleMarkCommissionPaid = async (bookingId) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`http://localhost:5000/api/hostBookings/commissionPaid/${bookingId}`, {}, config);

      if (res.data.success) {
        setData(prev => {
          const updated = { ...prev };
          updated.bookings = updated.bookings.map(b => b._id === bookingId ? { ...b, commissionStatus: "Paid" } : b);
          updated.summary.pendingCommission = updated.bookings.reduce((sum, b) => b.commissionStatus === 'Pending' ? sum + b.commission : sum, 0);
          return updated;
        });
      }
    } catch (err) {
      console.error("Commission update failed:", err.response?.data || err.message);
    }
  };

  const handleWithdrawMoney = () => alert("Withdraw logic to be added.");
  const handlePayCommission = () => alert(`Pay commission ₹${data.summary.pendingCommission}`);

  if (loading) {
    return (
      <div className="loading-screen">
        <FaDog className="animate-bounce gold-text" style={{ fontSize: '3rem' }} />
        <p>Loading Your Premium Dashboard...</p>
      </div>
    );
  }

  const sections = {
    dashboard: { icon: FaTachometerAlt, title: "Dashboard Summary" },
    rooms: { icon: FaHome, title: "Rooms Management" },
    bookings: { icon: FaBook, title: "Bookings Table" },
    commission: { icon: FaMoneyCheckAlt, title: "Commission Payments" },
    // wallet: { icon: FaWallet, title: "Host Wallet" },
    reviews: { icon: FaStar, title: "Review Manager" },
    profile: { icon: FaUserCog, title: "Host Profile" },
    listRoom: { icon: FaPlusCircle, title: "List a Room" },
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="fade-in">
            <SectionTitle icon={FaTachometerAlt} title="Dashboard Summary" />
            <div className="grid-cards">
              <StatCard title="Total Bookings" value={data.summary.totalBookings} icon={() => <FaBook />} color="#D4AF37" />
              <StatCard title="Upcoming" value={data.summary.upcomingBookings} icon={() => <FaBook />} color="#C5A028" />
              <StatCard title="Total Earnings" value={data.summary.totalEarnings} icon={() => <FaDog />} color="#D4AF37" isCurrency />
              <StatCard title="Pending Commission" value={data.summary.pendingCommission} icon={() => <FaDog />} color="#AA840B" isCurrency />
            </div>
          </div>
        );
      case "rooms": return <RoomsSection rooms={data.rooms} />;
      case "bookings": return <BookingsSection bookings={data.bookings} onViewBooking={handleViewBooking} />;
      case "commission": return <CommissionSection hostId={localStorage.getItem("userId")} onPayTotalCommission={handlePayCommission} onViewBooking={handleViewBooking} />;
      case "wallet": return <WalletSection wallet={data.wallet} hostId={localStorage.getItem("userId")} onWithdraw={handleWithdrawMoney} />
      case "reviews": return <ReviewsSection reviews={data.reviews} />;
      case "profile": return <HostProfile host={data.host} />;
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="mobile-top-bar">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <FaBars />
        </button>
        <span className="mobile-logo gold-text"><FaDog /> Host Portal</span>
      </header>

      <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2><FaDog className="gold-text" /> Host Portal</h2>
          <button onClick={() => setSidebarOpen(false)} className="close-btn"><FaTimes /></button>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(sections).map(([key, { icon: Icon, title }]) => (
            <button
              key={key}
              onClick={() => {
                setSidebarOpen(false);
                if (key === "bookings") {
                  setNewBookingsCount(0);
                  setHasNewBookings(false);
                  localStorage.setItem("lastSeenBookingsAt", new Date().toISOString());
                }
                if (key === "listRoom") navigate("/owner/list-stay");
                else setActiveSection(key);
              }}
              className={`sidebar-btn ${activeSection === key ? "active" : ""} ${key === "bookings" && hasNewBookings ? "new-booking-highlight" : ""}`}
            >
              <div className="nav-btn-content">
                <div className="icon-title">
                  <Icon className="nav-icon" />
                  <span>{title}</span>
                </div>
                {key === "bookings" && newBookingsCount > 0 && (
                  <span className="notif-badge">{newBookingsCount}</span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>

      {showBookingModal && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowBookingModal(false)}
          onPayCommission={handleMarkCommissionPaid}
        />
      )}
    </div>
  );
};

export default RoomHosterDashboard;