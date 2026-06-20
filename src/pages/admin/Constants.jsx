import { FaPaw, FaHome, FaUsers, FaListAlt, FaCalendarCheck, FaRupeeSign, FaStar, FaChartBar, FaCog, FaSignOutAlt, FaBookOpen } from 'react-icons/fa';
import { useState, useEffect } from 'react';

// Define the color palette and constants
export const OYO_PRIMARY = '#ff385c'; 
export const OYO_SECONDARY = '#484848';
export const OYO_BG_LIGHT = '#f7f7f7';
export const CARD_BG = '#ffffff';
export const SIDEBAR_WIDTH = '280px'; 
export const BOX_STYLE = { boxSizing: 'border-box' };

// Mock Data for the Dashboard Overview (used as fallback/initial state)
export const MOCK_STATS = { totalListings: 327, bookingsToday: 15, activeUsers: 1243, revenueMonth: 120000, avgRating: 4.6 };

// Navigation Links Data
export const NAV_ITEMS = [
    { name: 'Dashboard', icon: FaHome, path: '/admin/dashboard', isHeading: true },
    { name: 'Users', icon: FaUsers, path: '/api/admin/users' },
    { name: 'Groomers', icon: FaPaw, isHeading: false },
    { name: 'Gr-Booking', icon: FaBookOpen, path: '/admin/gr-bookings' },  // ⭐ NEW
    { name: 'Listings', icon: FaListAlt, path: '/api/admin/dogstay' }, 
    { name: 'Bookings', icon: FaCalendarCheck, path: '/api/admin/bookings' },
    { name: 'Payments', icon: FaRupeeSign, path: '/api/admin/payments' },
    { name: 'Commission', icon: FaStar, path: '/api/admin/commission' },
];

// Custom Hook for Responsiveness
export const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 768
    );

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { isMobile: windowWidth < 768 };
};

// Reusable Card Component (SAFE UPDATED)
export const DashboardCard = ({ title, value, icon: Icon, color }) => {
    
    // 🛡 SAFE VALUE (Prevents the toLocaleString crash)
    const safeValue = value ?? 0;

    return (
        <div 
            style={{
                ...BOX_STYLE,
                backgroundColor: CARD_BG,
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `5px solid ${color}`,
                transition: 'transform 0.2s',
                cursor: 'default',
                minWidth: '250px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: OYO_SECONDARY, opacity: 0.7 }}>
                    {title}
                </p>

                <h3 style={{ margin: 0, fontSize: '24px', color: OYO_SECONDARY }}>
                    {title.includes('Revenue')
                        ? `₹${safeValue.toLocaleString('en-IN')}`
                        : title.includes('Rating')
                            ? safeValue
                            : safeValue.toLocaleString()}
                </h3>
            </div>

            <div style={{
                backgroundColor: `${color}30`,
                borderRadius: '50%',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={26} color={color} />
            </div>
        </div>
    );
};
