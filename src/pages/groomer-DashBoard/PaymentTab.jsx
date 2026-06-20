import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { 
    FaMoneyBillWave, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaClock, 
    FaSpinner, 
    FaListAlt, 
    FaTrash, 
    FaCreditCard, 
    FaWallet,
    FaPaw
} from 'react-icons/fa';

const OYO_PRIMARY = '#ff385c';
const OYO_SECONDARY = '#484848';
const OYO_BG_LIGHT = '#f7f7f7';
const CARD_BG = '#ffffff';

const PaymentTab = ({ isMobile }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ FETCH GROOMER PAYMENTS (NEWEST FIRST)
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axiosInstance.get("/api/admin/groomer/all-bookings");

                if (res.data.success) {
                    const sortedBookings = (res.data.bookings || [])
                        .map(b => ({
                            ...b,
                            createdAt: new Date(b.createdAt)
                        }))
                        .sort((a, b) => b.createdAt - a.createdAt); // 🔥 NEW FIRST

                    setBookings(sortedBookings);
                }
            } catch (err) {
                console.error("Error fetching groomer payments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    // ✅ DELETE BOOKING / TRANSACTION
    const deleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to delete this grooming payment record?")) return;
        try {
            const res = await axiosInstance.delete(`/api/groomer/delete/${id}`);
            if (res.data.success) {
                setBookings(prev => prev.filter(b => b._id !== id));
            }
        } catch (err) {
            alert("Failed to delete record");
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Status Badge
    const StatusBadge = ({ status }) => {
        const s = status?.toLowerCase();
        let style = {
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        };

        if (s === 'paid')
            return <span style={{ ...style, backgroundColor: '#d4edda', color: '#155724' }}><FaCheckCircle /> PAID</span>;

        if (s === 'pending')
            return <span style={{ ...style, backgroundColor: '#fff3cd', color: '#856404' }}><FaClock /> PENDING</span>;

        return <span style={{ ...style, backgroundColor: '#f8d7da', color: '#721c24' }}><FaTimesCircle /> {status}</span>;
    };

    return (
        <div style={{ padding: isMobile ? '15px' : '30px', backgroundColor: OYO_BG_LIGHT, minHeight: '80vh', borderRadius: '15px' }}>
            <div style={{ marginBottom: '25px' }}>
                <h2 style={{ color: OYO_SECONDARY, display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                    <FaMoneyBillWave color={OYO_PRIMARY} /> Groomer Payouts
                </h2>
                <p style={{ color: '#717171', marginTop: '5px' }}>
                    Revenue tracking for grooming services and travel charges.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <FaSpinner className="spin" size={30} color={OYO_PRIMARY} />
                    <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (
                <div style={{ backgroundColor: CARD_BG, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    {bookings.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#ccc' }}>
                            <FaListAlt size={40} />
                            <p>No grooming transactions found.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eee' }}>
                                    <tr>
                                        <th style={thStyle}>ID</th>
                                        <th style={thStyle}>Customer</th>
                                        <th style={thStyle}>Service & Pet</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}>Method</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                            <td style={tdStyle}>
                                                <small style={{ color: '#999' }}>
                                                    {b.paymentId ? b.paymentId.slice(-8) : b._id.slice(-5)}
                                                </small>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: '600' }}>{b.name}</div>
                                                <div style={{ fontSize: '11px', color: '#888' }}>{b.phone}</div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <FaPaw size={10} color={OYO_PRIMARY} /> {b.service}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#666' }}>
                                                    Pet: {b.petName} ({b.breed})
                                                </div>
                                            </td>
                                            <td style={{ ...tdStyle, fontWeight: 'bold', color: '#27ae60' }}>
                                                ₹{b.finalAmount}
                                                {b.travelCharge > 0 && (
                                                    <div style={{ fontSize: '10px', color: '#999' }}>
                                                        incl. ₹{b.travelCharge} travel
                                                    </div>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                                                    {b.paymentMethod === 'Cash'
                                                        ? <FaWallet color="#f39c12" />
                                                        : <FaCreditCard color={OYO_PRIMARY} />
                                                    }
                                                    {b.paymentMethod}
                                                </div>
                                            </td>
                                            <td style={tdStyle}><StatusBadge status={b.paymentStatus} /></td>
                                            <td style={tdStyle}>{formatDate(b.createdAt)}</td>
                                            <td style={tdStyle}>
                                                <button onClick={() => deleteBooking(b._id)} style={btnDel}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const thStyle = {
    padding: '15px',
    textAlign: 'left',
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const tdStyle = {
    padding: '15px',
    fontSize: '14px',
    color: OYO_SECONDARY
};

const btnDel = {
    border: 'none',
    background: 'none',
    color: '#ff4d4d',
    cursor: 'pointer',
    padding: '5px'
};

export default PaymentTab;
