import React, { useEffect, useState } from 'react';
import axios from "axios";
import { OYO_PRIMARY, OYO_SECONDARY, BOX_STYLE, CARD_BG } from './Constants.jsx';

const CommissionPage = ({ isMobile }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedHost, setSelectedHost] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // --- PREMIUM THEME CONSTANTS ---
    const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F9F295 50%, #B8860B 100%)";
    const PREMIUM_GOLD = "#B8860B";
    const PURE_BLACK = "#000000";
    const SOFT_WHITE = "#FFFFFF";

    useEffect(() => {
        fetchCommissions();
    }, []);

    const fetchCommissions = async () => {
        try {
            const res = await axios.get("https://cado-dog-grooming-backend.onrender.com/api/admin/commissions");
            setData(res.data);
        } catch (err) {
            console.error("Commission load failed", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: 20, color: PURE_BLACK, fontWeight: 'bold' }}>Loading commission data...</div>;
    }

    const { summary, commissions } = data;

    return (
        <div style={{ padding: isMobile ? 10 : 30, background: "#FDFDFD", minHeight: "100vh" }}>
            {/* Global CSS Injection for Premium Effects */}
            <style>{`
                .premium-container * { color: ${PURE_BLACK}; }
                .premium-container h2, .premium-container h3 { color: ${PREMIUM_GOLD} !important; }
                .gold-btn { 
                    background: ${GOLD_GRADIENT} !important; 
                    color: ${PURE_BLACK} !important; 
                    font-weight: 700 !important; 
                    transition: all 0.3s ease !important;
                    box-shadow: 0 4px 10px rgba(184, 134, 11, 0.2) !important;
                }
                .gold-btn:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 6px 15px rgba(184, 134, 11, 0.4) !important; 
                }
                tr:hover { background-color: rgba(212, 175, 55, 0.05) !important; }
                .summary-card:hover { transform: translateY(-5px); transition: 0.3s; }
            `}</style>

            <div className="premium-container">
                <h2 style={{ textAlign: 'center', marginBottom: 30, textTransform: 'uppercase', letterSpacing: 1 }}>Commission Overview</h2>
                
                {/* Summary */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                    gap: 15,
                    marginBottom: 30
                }}>
                    <SummaryCard title="Total Commission" value={`₹${summary.totalCommission}`} goldGradient={GOLD_GRADIENT} />
                    <SummaryCard title="Paid Commission" value={`₹${summary.paidCommission}`} goldGradient={GOLD_GRADIENT} />
                    <SummaryCard title="Unpaid Commission" value={`₹${summary.unpaidCommission}`} goldGradient={GOLD_GRADIENT} />
                    <SummaryCard title="Total Bookings" value={summary.totalBookings} goldGradient={GOLD_GRADIENT} />
                </div>

                {/* Table */}
                <div style={{ 
                    overflowX: "auto", 
                    background: SOFT_WHITE, 
                    borderRadius: 15, 
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(184, 134, 11, 0.2)"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ background: GOLD_GRADIENT }}>
                            <tr>
                                <th style={{...th, color: PURE_BLACK}}>Room</th>
                                <th style={{...th, color: PURE_BLACK}}>User</th>
                                <th style={{...th, color: PURE_BLACK}}>Host</th>
                                <th style={{...th, color: PURE_BLACK}}>Nights</th>
                                <th style={{...th, color: PURE_BLACK}}>Commission</th>
                                <th style={{...th, color: PURE_BLACK}}>Paid</th>
                                <th style={{...th, color: PURE_BLACK}}>Status</th>
                                <th style={{...th, color: PURE_BLACK}}>Date</th>
                                <th style={{...th, color: PURE_BLACK, textAlign: 'center'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissions.map(c => (
                                <tr key={c.bookingId} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{...td, fontWeight: '600'}}>{c.roomName}</td>
                                    <td style={td}>{c.user}</td>
                                    <td style={td}>{c.host?.name || "N/A"}</td>
                                    <td style={td}>{c.nights}</td>
                                    <td style={{...td, fontWeight: 'bold'}}>₹{c.totalCommission}</td>
                                    <td style={td}>
                                        <span style={{ color: c.commissionPaid ? "#27ae60" : "#e74c3c", fontWeight: 'bold' }}>
                                            {c.commissionPaid ? "✅ Paid" : "❌ Unpaid"}
                                        </span>
                                    </td>
                                    <td style={td}>{c.bookingStatus}</td>
                                    <td style={td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td style={{...td, textAlign: 'center'}}>
                                        <button 
                                            className="gold-btn"
                                            onClick={() => { setSelectedHost(c.host); setSelectedBooking(c); }}
                                            style={btn}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* HOST DETAILS MODAL */}
                {selectedHost && selectedBooking && (
                    <div style={modalOverlay}>
                        <div style={{...modalBox, border: `2px solid ${PREMIUM_GOLD}`}}>
                            <div style={{ height: 5, background: GOLD_GRADIENT, margin: "-25px -25px 20px -25px", borderRadius: "10px 10px 0 0" }}></div>
                            <h3 style={{ marginBottom: 20, borderBottom: `1px solid #eee`, paddingBottom: 10 }}>Host & Booking Details</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                <p><b>Room Name:</b> {selectedBooking.roomName || "N/A"}</p>
                                <p><b>Host Name:</b> {selectedHost.name}</p>
                                <p><b>Email:</b> {selectedHost.email}</p>
                                <p><b>Mobile:</b> {selectedHost.mobile || "N/A"}</p>
                                <p><b>Status:</b> <span style={{color: selectedHost.isActive ? '#27ae60' : '#e74c3c'}}>{selectedHost.isActive ? "Active" : "Inactive"}</span></p>
                                <p><b>Wallet Balance:</b> ₹{selectedHost.wallet ?? 0}</p>
                                <p><b>Joined:</b> {selectedHost.createdAt ? new Date(selectedHost.createdAt).toLocaleDateString() : "N/A"}</p>
                            </div>

                            <button 
                                className="gold-btn" 
                                onClick={() => { setSelectedHost(null); setSelectedBooking(null); }} 
                                style={{...closeBtn, width: '100%', marginTop: 25}}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --------------------
const SummaryCard = ({ title, value, goldGradient }) => (
    <div className="summary-card" style={{ 
        ...BOX_STYLE, 
        background: SOFT_WHITE, 
        padding: 20, 
        borderRadius: 15, 
        borderLeft: `5px solid #D4AF37`,
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
    }}>
        <div style={{ fontSize: 13, color: "#666", textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>{title}</div>
        <div style={{ fontSize: 24, fontWeight: "800", color: "#000" }}>
            {value}
        </div>
    </div>
);

const th = { padding: "15px 12px", textAlign: "left", fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 };
const td = { padding: 15, fontSize: 14 };

const btn = {
    padding: "8px 14px",
    border: "none",
    borderRadius: 50,
    cursor: "pointer",
    fontSize: 12,
    textTransform: 'uppercase'
};

const modalOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)"
};

const modalBox = {
    background: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "90%",
    maxWidth: 450,
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
};

const SOFT_WHITE = "#FFFFFF";

const closeBtn = {
    padding: "10px 15px",
    border: "none",
    borderRadius: 50,
    cursor: "pointer",
    fontSize: 14
};

export default CommissionPage;