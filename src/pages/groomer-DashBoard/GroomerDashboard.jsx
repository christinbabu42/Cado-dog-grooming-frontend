import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, CreditCard, LogOut, Menu, X, Wallet } from 'lucide-react';
import './GroomerDashboard.css';

import DashboardTab from './DashboardTab';
import BookingsTab from './BookingsTab';
import PaymentTab from './PaymentTab';
import EarningsTab from './EarningsTab';
import PayoutsTab from './PayoutsTab';

const GroomerDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     try {
  //       const response = await axiosInstance.get('/api/admin/all-bookings');

  //       const data = await response.json();
  //       if (data.success) setBookings(data.bookings);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Failed to fetch", err);
  //       setLoading(false);
  //     }
  //   };
  //   fetchBookings();
  // }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">P</div>
            <span>PetGroomer</span>
          </div>
          <button className="close-menu" onClick={toggleSidebar}><X /></button>
        </div>

        <ul className="nav-links">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabClick('dashboard')}>
            <LayoutDashboard size={20}/> <span>Dashboard</span>
          </li>
          <li className={activeTab === 'bookings' ? 'active' : ''} onClick={() => handleTabClick('bookings')}>
            <Calendar size={20}/> <span>Bookings</span>
          </li>
          <li className={activeTab === 'payment' ? 'active' : ''} onClick={() => handleTabClick('payment')}>
            <CreditCard size={20}/> <span>Payment</span>
          </li>

           <li className={activeTab === 'EarningsTab' ? 'active' : ''} onClick={() => handleTabClick('EarningsTab')}>
            <CreditCard size={20}/> <span>EarningsTab</span>
          </li>

          <li className={activeTab === 'payouts' ? 'active' : ''} onClick={() => handleTabClick('payouts')}>
            <Wallet size={20}/> <span>Payouts</span>
          </li>


        </ul>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={20}/> <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <button className="menu-toggle" onClick={toggleSidebar}><Menu /></button>
          <h1 className="capitalize">{activeTab} Overview</h1>
          <div className="user-profile">
            <img src="https://ui-avatars.com/api/?name=Groomer+Admin&background=6366f1&color=fff" alt="profile" />
          </div>
        </header>

        {/* Conditional Rendering */}
        {activeTab === 'dashboard' && <DashboardTab bookings={bookings} />}
        {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
        {activeTab === 'payment' && <PaymentTab />}
        {activeTab === 'EarningsTab' && <EarningsTab />}
        // Conditional rendering in main content
        {activeTab === 'payouts' && <PayoutsTab />}

      </main>
    </div>
  );
};

export default GroomerDashboard;
