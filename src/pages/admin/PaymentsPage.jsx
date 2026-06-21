import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaClock, FaSpinner, FaListAlt, FaTrash } from 'react-icons/fa';

const OYO_PRIMARY = '#ff385c';
const OYO_SECONDARY = '#484848';
const OYO_BG_LIGHT = '#f7f7f7';
const CARD_BG = '#ffffff';
const BOX_STYLE = { boxSizing: 'border-box' };
const BACKEND_BASE_URL = 'https://cado-dog-grooming-backend.onrender.com';

// Format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

// Status Badge
const StatusBadge = ({ status }) => {
    let style = {
        padding: '4px 10px', borderRadius: '15px', fontWeight: 'bold',
        textTransform: 'uppercase', fontSize: '12px', display: 'inline-flex',
        alignItems: 'center', gap: '5px'
    };
    let Icon = FaClock;

    switch (status?.toLowerCase()) {
        case 'paid':
        case 'active':
            style.backgroundColor = '#d4edda'; style.color = '#155724'; Icon = FaCheckCircle; break;
        case 'pending':
            style.backgroundColor = '#fff3cd'; style.color = '#856404'; Icon = FaClock; break;
        case 'refunded':
            style.backgroundColor = '#f8d7da'; style.color = '#721c24'; Icon = FaTimesCircle; break;
        default:
            style.backgroundColor = '#e2e3e5'; style.color = '#383d41'; break;
    }

    return <span style={style}><Icon size={10} />{status}</span>;
};

// Payments Page
const PaymentsPage = ({ isMobile }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`${BACKEND_BASE_URL}/api/roombookings/all-payments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data.bookings || []);
            } catch (err) {
                console.error("Error fetching payment bookings:", err);
                setBookings([]);
            } finally { setLoading(false); }
        };
        fetchBookings();
    }, []);

    // Delete booking function
    const deleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.delete(`${BACKEND_BASE_URL}/api/roombookings/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setBookings(bookings.filter(b => b._id !== id));
                alert("Booking deleted successfully!");
            } else {
                alert(res.data.message || "Failed to delete booking");
            }
        } catch (err) {
            console.error("Error deleting booking:", err);
            alert("Failed to delete booking");
        }
    };

    return (
        <div style={{ ...BOX_STYLE, padding: isMobile ? '20px' : '40px', backgroundColor: OYO_BG_LIGHT, minHeight: '100vh' }}>
            <h2 style={{ color: OYO_SECONDARY, fontSize: isMobile ? '28px' : '36px', marginBottom: '10px' }}>
                <FaMoneyBillWave color={OYO_PRIMARY} style={{ marginRight: '15px' }} /> Payments Dashboard
            </h2>
            <p style={{ color: OYO_SECONDARY, opacity: 0.7, marginBottom: '30px', borderBottom: `1px solid ${OYO_PRIMARY}` }}>
                Overview of all DogStay and Groomer bookings ({bookings.length} records)
            </p>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <FaSpinner size={30} color={OYO_PRIMARY} style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '10px', color: OYO_SECONDARY }}>Loading transaction data...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (
                <div style={{ backgroundColor: CARD_BG, borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                    {bookings.length === 0 ? (
                        <div style={{ padding: '50px', textAlign: 'center' }}>
                            <FaListAlt size={40} color={OYO_SECONDARY} style={{ opacity: 0.3 }} />
                            <p style={{ color: OYO_SECONDARY, opacity: 0.6, marginTop: '15px' }}>No transactions found.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead style={{ backgroundColor: OYO_PRIMARY, color: CARD_BG }}>
                                <tr>
                                    <th style={tableHeaderStyle}>Booking ID</th>
                                    <th style={tableHeaderStyle}>Customer</th>
                                    <th style={tableHeaderStyle}>Type</th>
                                    <th style={tableHeaderStyle}>Amount</th>
                                    <th style={tableHeaderStyle}>Method</th>
                                    <th style={tableHeaderStyle}>Status</th>
                                    <th style={tableHeaderStyle}>Date/Time</th>
                                    <th style={tableHeaderStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b, index) => (
                                    <tr key={b._id} style={{ borderBottom: `1px solid ${OYO_BG_LIGHT}`, backgroundColor: index % 2 === 0 ? CARD_BG : OYO_BG_LIGHT }}>
                                        <td style={tableCellStyle}>{b._id.slice(-6)}</td>
                                        <td style={tableCellStyle}>{b.fullName || "N/A"}</td>
                                        <td style={tableCellStyle}>{b.roomName}</td>
                                        <td style={{ ...tableCellStyle, fontWeight: 'bold', color: '#2ecc71' }}>₹{b.totalAmount}</td>
                                        <td style={tableCellStyle}>
                                            <span style={{ color: b.paymentMethod === 'Cash' ? OYO_SECONDARY : OYO_PRIMARY }}>
                                                {b.paymentMethod}
                                            </span>
                                        </td>
                                        <td style={tableCellStyle}><StatusBadge status={b.paymentStatus} /></td>
                                        <td style={tableCellStyle}>{formatDate(b.createdAt)}</td>
                                        <td style={tableCellStyle}>
                                            <button
                                                onClick={() => deleteBooking(b._id)}
                                                style={{
                                                    backgroundColor: 'red',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

// Table Styles
const tableHeaderStyle = {
    padding: '15px 10px',
    textAlign: 'left',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};

const tableCellStyle = {
    padding: '12px 10px',
    fontSize: '14px',
    color: OYO_SECONDARY,
    verticalAlign: 'middle',
};

export default PaymentsPage;
