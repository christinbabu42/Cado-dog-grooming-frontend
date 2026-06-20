import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance.js';

import { 
    FaUsers, FaPaw, FaCalendarCheck, FaRupeeSign, FaStar, FaBookOpen 
} from 'react-icons/fa';

import { 
    OYO_PRIMARY, 
    OYO_SECONDARY, 
    OYO_BG_LIGHT, 
    BOX_STYLE, 
    DashboardCard 
} from './Constants.jsx';

// Premium Theme Constants
const GOLD_GRADIENT = 'linear-gradient(135deg, #D4AF37 0%, #F1D37E 50%, #B8860B 100%)';
const PREMIUM_WHITE = '#FFFFFF';
const SOFT_GOLD = '#F9F6EE';
const TEXT_DARK = '#2C2C2C'; // Elegant dark grey/black
const BORDER_GOLD = '1px solid rgba(212, 175, 55, 0.3)';

const DashboardPage = ({ isMobile }) => {

    const [dashboardStats, setDashboardStats] = useState({
        activeUsers: 0,
        totalListings: 0,
        bookingsToday: 0,
        revenueMonth: 0,
        avgRating: 0,
        listingtoday: 0
    });

    // Groomer bookings today
    const [groomerBookingsToday, setGroomerBookingsToday] = useState(0);

    // ✅ Groomer revenue this month
    const [groomerRevenueMonth, setGroomerRevenueMonth] = useState(0);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Dashboard stats
                const res = await axios.get("/api/admin/dashboard");
                setDashboardStats(res.data);

                // Groomer bookings (same API as GrBookingPage)
                const bookingRes = await axios.get("/api/admin/groomer/all-bookings");
                const bookings = bookingRes.data.bookings || [];

                const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                // ✅ Groomer bookings today
                const todayGroomerBookings = bookings.filter(b => {
                    if (b.date) {
                        return b.date === today;
                    }

                    if (b.createdAt) {
                        return new Date(b.createdAt).toLocaleDateString("en-CA") === today;
                    }

                    return false;
                });

                setGroomerBookingsToday(todayGroomerBookings.length);

                // ✅ Groomer revenue this month (PAID ONLY)
                const monthlyRevenue = bookings.reduce((total, b) => {
                    if (!b.createdAt) return total;

                    const d = new Date(b.createdAt);

                    if (
                        d.getMonth() === currentMonth &&
                        d.getFullYear() === currentYear &&
                        b.paymentStatus === "paid"
                    ) {
                        return total + Number(b.finalAmount || b.price || 0);
                    }

                    return total;
                }, 0);

                setGroomerRevenueMonth(monthlyRevenue);

            } catch (err) {
                console.error("Dashboard loading error:", err);
            }
        };

        fetchDashboard();
    }, []);

    const dashboardCards = [
        { title: "Total Users", value: dashboardStats.activeUsers, icon: FaUsers, color: '#B8860B' },
        { title: "Total Listings", value: dashboardStats.totalListings, icon: FaPaw, color: '#D4AF37' },
        { title: "Room Bookings Today", value: dashboardStats.bookingsToday, icon: FaCalendarCheck, color: '#C5A028' },
        { title: "Groomer Bookings Today", value: groomerBookingsToday, icon: FaCalendarCheck, color: '#B8860B' },

        // ✅ NEW CARD
        { title: "Groomer Turnover This Month", value: groomerRevenueMonth, icon: FaRupeeSign, color: '#AA8207' },

        { title: "Revenue This Month", value: dashboardStats.revenueMonth, icon: FaRupeeSign, color: '#D4AF37' },
        { title: "New Hosts Today", value: dashboardStats.listingtoday, icon: FaBookOpen, color: '#B8860B' },
    ];

    return (
        <div style={{ 
            ...BOX_STYLE, 
            padding: isMobile ? '25px' : '50px',
            backgroundColor: SOFT_GOLD, // Very light luxury cream/white
            minHeight: '100vh',
            transition: 'all 0.3s ease'
        }}>

            <header style={{ marginBottom: '40px', textAlign: isMobile ? 'center' : 'left' }}>
                <h1 style={{
                    color: TEXT_DARK,
                    fontSize: isMobile ? '28px' : '42px',
                    fontWeight: '800',
                    letterSpacing: '-0.5px',
                    marginBottom: '8px',
                    fontFamily: "'Playfair Display', serif" // Suggested premium font
                }}>
                    Dashboard <span style={{ color: '#D4AF37' }}>Overview</span>
                </h1>

                <div style={{
                    height: '4px',
                    width: '60px',
                    background: GOLD_GRADIENT,
                    borderRadius: '10px',
                    margin: isMobile ? '0 auto' : '0 0 15px 0'
                }}></div>

                <p style={{ 
                    color: TEXT_DARK, 
                    opacity: 0.6, 
                    fontSize: isMobile ? '15px' : '18px',
                    fontWeight: '400'
                }}>
                    Real-time performance metrics for your luxury platform.
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '25px',
                marginTop: '30px'
            }}>
                {dashboardCards.map((card, index) => (
                    <div key={index} style={{
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                    }}>
                        <DashboardCard 
                            {...card} 
                            // Overriding styles via props if DashboardCard supports it, 
                            // otherwise, the 'color' passed in dashboardCards handles the icons.
                            style={{
                                background: PREMIUM_WHITE,
                                borderRadius: '16px',
                                border: BORDER_GOLD,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Premium Subtle Footer */}
            <div style={{ 
                marginTop: '50px', 
                borderTop: BORDER_GOLD, 
                paddingTop: '20px', 
                textAlign: 'center',
                color: '#B8860B',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                opacity: 0.8
            }}>
                © {new Date().getFullYear()} Premium Admin Portal
            </div>

        </div>
    );
};

export default DashboardPage;