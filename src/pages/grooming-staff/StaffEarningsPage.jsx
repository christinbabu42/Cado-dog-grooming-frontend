import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { LayoutDashboard, Wallet, Users, Menu, X, LogOut } from "lucide-react";
import DashboardView from "./DashboardView";
import PayoutsView from "./PayoutsView";
import ProfileView from "./ProfileView";
import "./StaffEarningsPage.css";

const StaffEarningsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [earnings, setEarnings] = useState(null);
  const [staffProfile, setStaffProfile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const initStaff = async () => {
      try {
        // Clean URL query token if arriving from an external redirect link link
        const queryParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = queryParams.get("token");

        if (tokenFromUrl) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Relying safely on central HttpOnly session cookies via shared axiosInstance
        const { data } = await axiosInstance.get("/api/user/me");

        if (data.role === "grstaff" && data.staffProfile) {
          setStaffProfile(data.staffProfile);
          const res = await axiosInstance.get(
            `/api/groomer/staff/earnings/${data.staffProfile._id}`
          );
          if (res.data.success) setEarnings(res.data);
        } else {
          setError("Access Denied: Staff only.");
        }
      } catch (err) {
        // Catch unauthorized or validation failures from server
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Session expired. Please login again.");
        } else {
          setError("Unable to connect to server.");
        }
      } finally {
        setLoading(false);
      }
    };

    initStaff();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return <div className="error-container" style={{ padding: "40px", textAlign: "center", color: "red" }}><p>{error}</p></div>;

  return (
    <div className="dashboard-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">G</div>
          <span>GroomerPro</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            onClick={() => handleNavClick("dashboard")} 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
          >
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <button 
            onClick={() => handleNavClick("payouts")} 
            className={`nav-item ${activeTab === "payouts" ? "active" : ""}`}
          >
            <Wallet size={20}/> Payouts
          </button>
          <button 
            onClick={() => handleNavClick("profile")} 
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
          >
            <Users size={20}/> Profile
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{staffProfile?.fullName || "Staff Member"}</span>
              <span className="user-role">Professional Staff</span>
            </div>
            <img src={localStorage.getItem("userPhoto") || "https://via.placeholder.com/40"} alt="profile" />
          </div>
        </header>

        <section className="content-body">
          {activeTab === "dashboard" && <DashboardView staffProfile={staffProfile} earnings={earnings} />}
          {activeTab === "payouts" && <PayoutsView earnings={earnings} />}
          {activeTab === "profile" && <ProfileView staffProfile={staffProfile} />}
        </section>
      </main>
    </div>
  );
};

export default StaffEarningsPage;