import React, { useState, useEffect } from 'react';
import axiosInstance from "../utils/axios";
import './UserProfile.css'; // Importing the separate CSS file
import {
    FaStar, FaMapMarkerAlt, FaCalendarAlt, FaChevronDown, FaTimes, FaFilter, FaAngleRight,
    FaUserCircle, FaHeart, FaHistory, FaEdit, FaTrashAlt, FaCalendarCheck,
    FaRegCalendarAlt, FaStarHalfAlt, FaEnvelope, FaPhone, FaCheck, FaTimesCircle
} from 'react-icons/fa';

const OYO_PRIMARY = '#ff385c';
const OYO_SECONDARY = '#007bff';
const OYO_ACCENT_TEXT = '#484848';
const OYO_RATING_GREEN = '#28a745';

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return {
        width: windowWidth,
        isMobile: windowWidth < 768,
    };
};

// Dummy bookings for UI
const bookings = [
    { id: 'UP001', property: 'Canine Comfort Retreat', date: 'Dec 15 - Dec 18', status: 'Upcoming', price: 3400, canModify: true },
];

const BookingCard = ({ booking }) => {
    const statusColor =
        booking.status === 'Upcoming'
            ? OYO_RATING_GREEN
            : booking.status === 'Cancelled'
            ? OYO_PRIMARY
            : '#6c757d';

    return (
        <div className="user-profile-booking-item">
            <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: OYO_ACCENT_TEXT }}>{booking.property}</h4>
                <p style={{ margin: '0', fontSize: '12px', color: '#999', display: 'flex', alignItems: 'center' }}>
                    <FaRegCalendarAlt size={10} style={{ marginRight: '5px' }} />
                    {booking.date}
                </p>
            </div>
            <div style={{ textAlign: 'right', minWidth: '180px' }}>
                <span
                    style={{
                        backgroundColor: statusColor,
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        marginRight: '15px',
                    }}
                >
                    {booking.status}
                </span>
                {booking.canModify ? (
                    <>
                        <FaEdit color={OYO_SECONDARY} size={14} style={{ cursor: 'pointer', marginRight: '10px' }} title="Modify Booking" />
                        <FaTrashAlt color={OYO_PRIMARY} size={14} style={{ cursor: 'pointer' }} title="Cancel Booking" />
                    </>
                ) : (
                    <span style={{ fontSize: '12px', color: '#ccc' }}>Archived</span>
                )}
            </div>
        </div>
    );
};

const UserProfilePage = () => {
    const { isMobile } = useWindowWidth();
    const [user, setUser] = useState(null);
    const [savingLocation, setSavingLocation] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        axiosInstance.get("/api/user/me")
        .then(res => {
            setUser(res.data);
            setEditData(res.data);
        })
        .catch(err => console.log("Fetch error", err));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const saveProfileUpdate = async () => {
        setIsUpdating(true);
        try {
            await axiosInstance.put("/api/user/update", editData);
            setUser(editData);
            setIsEditing(false);
            alert("Profile updated successfully! ✨");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    const saveUserLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }
        setSavingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    await axiosInstance.put(
                        "/api/user/location",
                        {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                            address: editData.address || "Saved via GPS"
                        }
                    );
                    fetchUserData();
                    alert("Location coordinates saved! 📍");
                } catch (err) {
                    alert("Failed to save location");
                } finally {
                    setSavingLocation(false);
                }
            },
            () => {
                alert("Location permission denied");
                setSavingLocation(false);
            }
        );
    };

    if (!user) {
        return <p style={{ padding: 40, fontSize: 20 }}>Loading profile...</p>;
    }

    return (
        <div className="user-profile-container">
            <div className="user-profile-wrapper">
                <h1 className="user-profile-header" style={{ fontSize: isMobile ? '28px' : '36px' }}>
                    Profile
                </h1>

                <div className={`user-profile-card user-profile-flex-responsive`} style={{ display: 'flex', gap: '30px', padding: '30px' }}>
                    
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={user.profilePic || "/default-user.png"}
                            alt="Profile"
                            className="user-profile-pic"
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        {!isEditing ? (
                            <>
                                <h2 style={{ margin: '0 0 5px 0', color: OYO_ACCENT_TEXT, fontSize: '26px' }}>{user.name}</h2>
                                <p style={{ color: OYO_SECONDARY, fontWeight: 'bold', fontSize: '14px', marginBottom: '15px' }}>{user.role?.toUpperCase()}</p>
                                
                                <div className="user-profile-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <p style={{ margin: '5px 0', fontSize: '14px' }}><FaEnvelope style={{ marginRight: 8 }}/> {user.email}</p>
                                    <p style={{ margin: '5px 0', fontSize: '14px' }}><FaPhone style={{ marginRight: 8 }}/> {user.phone || "No Phone"}</p>
                                    <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Country:</strong> {user.country || "Not set"}</p>
                                    <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Wallet:</strong> ₹{user.walletBalance}</p>
                                </div>
                                
                                <p style={{ marginTop: '15px', fontSize: '14px', color: '#555' }}>
                                    <FaMapMarkerAlt style={{ marginRight: 8, color: OYO_PRIMARY }}/>
                                    <strong>Address:</strong> {user.address || "No address saved"}
                                </p>

                                {user.location?.lat && (
                                    <div style={{ marginTop: '15px' }}>
                                        <div style={{ width: '220px', height: '130px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                            <iframe
                                                title="map"
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                src={`https://maps.google.com/maps?q=${user.location.lat},${user.location.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                            ></iframe>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Full Name</label>
                                <input className="user-profile-input" name="name" value={editData.name} onChange={handleEditChange} />
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Phone</label>
                                        <input className="user-profile-input" name="phone" value={editData.phone} onChange={handleEditChange} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Country</label>
                                        <input className="user-profile-input" name="country" value={editData.country} onChange={handleEditChange} />
                                    </div>
                                </div>

                                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Full Address</label>
                                <textarea 
                                    className="user-profile-input"
                                    style={{ height: '60px', fontFamily: 'inherit' }} 
                                    name="address" 
                                    value={editData.address || ""} 
                                    onChange={handleEditChange} 
                                    placeholder="Enter street, city, state..."
                                />

                                <button onClick={saveUserLocation} className="user-profile-gps-btn">
                                    <FaMapMarkerAlt /> {savingLocation ? "Pinpointing..." : "Update GPS Coordinates"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="user-profile-btn-primary">
                                <FaEdit style={{ marginRight: '8px' }} /> Edit Profile
                            </button>
                        ) : (
                            <>
                                <button onClick={saveProfileUpdate} disabled={isUpdating} className="user-profile-btn-success">
                                    <FaCheck style={{ marginRight: '8px' }} /> {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                                <button onClick={() => { setIsEditing(false); setEditData(user); }} className="user-profile-btn-secondary">
                                    <FaTimesCircle style={{ marginRight: '8px' }} /> Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
};

const App = () => {
    return (
        <div style={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', boxSizing: 'border-box', overflowX: 'hidden' }}>
            <UserProfilePage />
        </div>
    );
};

export default App;