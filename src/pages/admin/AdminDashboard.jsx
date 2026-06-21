import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaPaw } from 'react-icons/fa';
import './AdminDashboard.css';
import axios from "axios";
import { useLocation } from "react-router-dom";

import { 
    OYO_PRIMARY, 
    OYO_SECONDARY, 
    OYO_BG_LIGHT, 
    SIDEBAR_WIDTH, 
    BOX_STYLE, 
    MOCK_STATS, 
    NAV_ITEMS, 
    useWindowWidth, 
} from './Constants.jsx';

import DashboardPage from './DashboardPage.jsx';
import UsersPage from './UsersPage.jsx';
import ListingsPage from './ListingsPage.jsx';
import RoomBookingsPage from './RoomBookingsPage.jsx';
import PaymentsPage from './PaymentsPage.jsx';
import CommissionPage from './CommissionPage.jsx';
import GroomersPage from './GroomersPage.jsx';
import GrBookingPage from './GrBookingPage.jsx';

/* =======================
   AXIOS INSTANCE
======================= */
const axiosInstance = axios.create({
    baseURL: "https://cado-dog-grooming-backend.onrender.com/api",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const AdminDashboard = () => {
    const { isMobile } = useWindowWidth();
    const [activePage, setActivePage] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const [dashboardStats, setDashboardStats] = useState(MOCK_STATS);
    const [selectedListing, setSelectedListing] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        setIsSidebarOpen(!isMobile);
    }, [isMobile]);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("authToken", token);
            window.history.replaceState({}, document.title, "/admin");
        }
    }, [location]);

    useEffect(() => {
        if (activePage === 'Dashboard') {
            axiosInstance
                .get("/admin/dashboard")
                .then(res => {
                    if (res.data && res.data.dashboardStats) {
                        setDashboardStats(res.data.dashboardStats);
                    }
                })
                .catch(err =>
                    console.error("Error fetching dashboard stats:", err)
                );
        }

        if (activePage !== 'Listings') setSelectedListing(null);
    }, [activePage]);

    const handleApproveReject = async (listingId, approve) => {
        const action = approve ? 'APPROVE' : 'REJECT';
        if (!window.confirm(`Are you sure you want to ${action} listing ID ${listingId.slice(-4)}?`)) return;

        const url = approve
            ? `https://cado-dog-grooming-backend.onrender.com/api/admin/dogstay/approve/${listingId}`
            : `https://cado-dog-grooming-backend.onrender.com/api/admin/dogstay/status/${listingId}`;

        const body = approve ? {} : { isApproved: false, isRejected: true };

        try {
            const response = await fetch(url, {
                method: approve ? 'PUT' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: approve ? undefined : JSON.stringify(body),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update status');
            }

            alert(`Listing ${listingId.slice(-4)} successfully ${approve ? 'approved' : 'rejected'}.`);
            setSelectedListing(null);
            setRefetchTrigger(prev => prev + 1);
        } catch (err) {
            console.error(`${action} Error:`, err);
            alert(`Error: ${err.message}`);
        }
    };

    const handleEdit = (listingId) => {
        console.log("Editing listing with ID:", listingId);
    };

    const renderContent = () => {
        switch (activePage) {
            case 'Dashboard':
                return <DashboardPage isMobile={isMobile} dashboardStats={dashboardStats} />;
            case 'Users':
                return <UsersPage isMobile={isMobile} />;
            case 'Listings':
                return (
                    <ListingsPage
                        isMobile={isMobile}
                        selectedListing={selectedListing}
                        setSelectedListing={setSelectedListing}
                        refetchTrigger={refetchTrigger}
                        handleApproveReject={handleApproveReject}
                        handleEdit={handleEdit}
                    />
                );
            case 'Groomers':
                return <GroomersPage isMobile={isMobile} />;
            case 'Bookings':
                return <RoomBookingsPage isMobile={isMobile} />;
            case 'Payments':
                return <PaymentsPage isMobile={isMobile} />;
            case 'Commission':
                return <CommissionPage isMobile={isMobile} />;
            case 'Gr-Booking':
                return <GrBookingPage isMobile={isMobile} />;
            default:
                return <div className="not-found">Page Not Found</div>;
        }
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2><FaPaw className="paw-icon" /> Admin Panel</h2>
                    {isMobile && (
                        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                            <FaTimes size={20} />
                        </button>
                    )}
                </div>
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(item => (
                        <div
                            key={item.name}
                            className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                            onClick={() => {
                                setActivePage(item.name);
                                if (isMobile) setIsSidebarOpen(false);
                            }}
                        >
                            <item.icon size={18} className="nav-icon" />
                            <span>{item.name}</span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <main className={`main-content ${isSidebarOpen && !isMobile ? 'sidebar-expanded' : ''}`}>
                <header className="main-header">
                    <div className="header-left">
                        {isMobile && (
                            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                                <FaBars size={20} />
                            </button>
                        )}
                        <h1>{activePage}</h1>
                    </div>
                    <div className="welcome-text">Welcome, <strong>Admin</strong></div>
                </header>

                <div className="page-content">{renderContent()}</div>
            </main>

            {/* Overlay */}
            {isMobile && isSidebarOpen && (
                <div className="overlay" onClick={() => setIsSidebarOpen(false)} />
            )}
        </div>
    );
};

export default AdminDashboard;