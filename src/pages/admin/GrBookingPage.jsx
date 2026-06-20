import React, { useEffect, useState } from "react";
import "./GrBookingPage.css"; 
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCreditCard, FaPaw, FaSpinner, FaTable, FaUser, FaTrash } from 'react-icons/fa';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const StatusBadge = ({ status }) => {
    let style = { padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'capitalize', fontSize: '12px' };
    let text = status;
    switch (status) {
        case 'active':
        case 'paid':
        case 'completed':
            style.backgroundColor = '#d4edda'; style.color = '#155724'; break;
        case 'pending':
            style.backgroundColor = '#fff3cd'; style.color = '#856404'; break;
        case 'cancelled':
        case 'refunded':
            style.backgroundColor = '#f8d7da'; style.color = '#721c24'; break;
        default:
            style.backgroundColor = '#e2e3e5'; style.color = '#383d41'; break;
    }
    return <span style={style}>{text}</span>;
};

const GrBookingPage = ({ isMobile }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/admin/groomer/all-bookings");
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setBookings(data.bookings || []);
            } catch (err) {
                console.error("Error fetching groomer bookings:", err);
            } finally { setLoading(false); }
        };
        fetchBookings();
    }, []);

    const openBookingDetails = (bookingId) => {
        navigate(`/admin/groomer-booking/${bookingId}`);
    };

    const deleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/groomer/delete/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setBookings(bookings.filter(b => b._id !== id));
                alert("Booking deleted successfully");
            } else {
                alert(data.message || "Failed to delete booking");
            }
        } catch (err) {
            console.error("Error deleting booking:", err);
            alert("Failed to delete booking");
        }
    };

    if (loading) {
        return (
            <div className="gr-container">
                <div className="loading-state">
                    <FaSpinner className="spinner" size={30} />
                    <p>Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="gr-container">
            <header className="gr-header">
                <h2 className="gr-title"><FaPaw /> Grooming Bookings Overview</h2>
                <span className="gr-count">Total Bookings: {bookings.length}</span>
            </header>

            {bookings.length === 0 && <p className="no-bookings">No bookings found.</p>}

            <div className="gr-table-wrapper">
                <table className="gr-booking-table">
                    <thead>
                        <tr>
                            <th>ID / Date <FaTable /></th>
                            <th>Customer / Pet <FaUser /></th>
                            <th>Service / Groomer <FaPaw /></th>
                            <th>Date / Time <FaCalendarAlt /></th>
                            <th>Amount <FaCreditCard /></th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b._id} className="booking-row-item">
                                <td data-label="ID / Date" onClick={() => openBookingDetails(b._id)}>
                                    <span className="id-text">...{b._id.slice(-6)}</span>
                                    <span className="date-text">{formatDate(b.createdAt)}</span>
                                </td>
                                <td data-label="Customer / Pet" onClick={() => openBookingDetails(b._id)}>
                                    <p className="main-text">{b.name || 'Guest'}</p>
                                    <p className="sub-text">{b.petName} ({b.breed})</p>
                                </td>
                                <td data-label="Service / Groomer" onClick={() => openBookingDetails(b._id)}>
                                    <p className="main-text">{b.serviceName || 'Full Groom'}</p>
                                    <p className="sub-text">Groomer: {b.groomerName || 'Staff'}</p>
                                </td>
                                <td data-label="Date / Time" onClick={() => openBookingDetails(b._id)}>
                                    <p className="main-text">{formatDate(b.bookingDate)}</p>
                                    <p className="sub-text">{b.bookingTime || 'Morning'}</p>
                                </td>
                                <td data-label="Amount" onClick={() => openBookingDetails(b._id)}>
                                    <p className="main-text amount-cell">₹{b.price}</p>
                                    <p className="sub-text">{b.paymentMethod}</p>
                                </td>
                                <td data-label="Status" onClick={() => openBookingDetails(b._id)}>
                                    <StatusBadge status={b.paymentStatus} />
                                    <StatusBadge status={b.bookingStatus || 'active'} />
                                </td>
                                <td data-label="Action">
                                    <button 
                                        onClick={() => deleteBooking(b._id)}
                                        style={{
                                            backgroundColor: 'red',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="table-note">Click any row to view full booking details.</p>
        </div>
    );
};

export default GrBookingPage;
