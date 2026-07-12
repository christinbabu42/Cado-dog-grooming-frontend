import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRulerCombined,
  FaPaw,
  FaDog,
  FaMoneyBillWave,
  FaArrowLeft
} from 'react-icons/fa';
import { BiTimeFive } from 'react-icons/bi';

import "./RoomsSection.css"; 

const HostRoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const hostId = localStorage.getItem("hostId");

        if (!hostId) {
          setError("Please log in as a host to view your rooms.");
          setLoading(false);
          return;
        }

const res = await axios.get(
    "https://cado-dog-grooming-backend.onrender.com/api/rooms/my-rooms",
    {
        withCredentials: true
    }
);

setRooms(res.data.rooms);

        if (res.data.success) {
          setRooms(res.data.rooms);
        } else {
          setError(res.data.message || "Failed to fetch rooms.");
        }
      } catch (err) {
        setError("An error occurred while connecting to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    localStorage.setItem("roomId", room._id);
    localStorage.setItem("hostId", room.hostId);
  };

  const getStatusDisplay = (room) => {
    if (room.isApproved) {
      return <span className="status-badge approved">Approved ✅</span>;
    }
    if (room.isRejected) {
      return <span className="status-badge rejected">Rejected ❌</span>;
    }
    return <span className="status-badge pending">Pending ⏳</span>;
  };

  if (loading) {
    return <div className="status-center"><p className="loading-text gold-text">✨ Polishing your rooms...</p></div>;
  }

  if (error) {
    return <div className="status-center"><p className="error-text">Error: {error}</p></div>;
  }

  if (rooms.length === 0) {
    return (
      <div className="status-center">
        <p className="no-rooms-text gold-text">No rooms found. Create your first Dog Stay 🐶</p>
      </div>
    );
  }

  const RoomDetail = ({ room }) => (
    <div className={`room-detail-panel fade-in`}>
      <div className="mobile-detail-header">
         <button className="back-btn" onClick={() => setSelectedRoom(null)}>
           <FaArrowLeft /> Back
         </button>
         <h2>Room Details</h2>
      </div>

      <div className="detail-header-section">
        <h2 className="gold-text">{room.roomName}</h2>
        {getStatusDisplay(room)}
      </div>

      <div className="room-info-grid">
        <div className="room-section premium-card">
          <h3 className="section-header">📋 General Information</h3>
          <p><FaDog className="gold-icon" /> <strong>Description:</strong> {room.shortDescription}</p>
          <p><FaMapMarkerAlt className="gold-icon" /> <strong>Address:</strong> {room.fullAddress}, {room.pinCode}</p>
          <p><FaMoneyBillWave className="gold-icon" /> <strong>Price:</strong> <span className="price-tag">₹{room.pricePerDay} / day</span></p>
          <p><span role="img" aria-label="host">🧑‍💻</span> <strong>Owner:</strong> {room.ownerFullName}</p>
        </div>

        <div className="room-section premium-card">
          <h3 className="section-header">🗓️ Booking & Timing</h3>
          <p><FaCalendarAlt className="gold-icon" /> <strong>Available:</strong> {room.availableFrom} - {room.availableTo}</p>
          <p><BiTimeFive className="gold-icon" /> <strong>Check-in/out:</strong> {room.checkInTime} / {room.checkOutTime}</p>
          <p><strong>Min Stay:</strong> {room.minimumStay} day(s)</p>
          <p><strong>Refund:</strong> {room.refundPolicy || 'Standard'}</p>
        </div>

        <div className="room-section premium-card">
          <h3 className="section-header">🐕 Dog Requirements</h3>
          <p><FaPaw className="gold-icon" /> <strong>Sizes:</strong> {room.allowedSizes?.join(', ') || 'Any'}</p>
          <p><FaRulerCombined className="gold-icon" /> <strong>Weight:</strong> Up to {room.weightLimit || 'N/A'} kg</p>
          <p><strong>Vaccination:</strong> {room.vaccinationRequired || 'Required'}</p>
        </div>
      </div>

      {room.photos?.length > 0 && (
        <div className="room-section premium-card">
          <h3 className="section-header">🖼️ Gallery</h3>
          <div className="photo-grid">
            {room.photos.map((photo, index) => (
              <div key={index} className="photo-wrapper">
                <img src={photo} alt="room" className="room-photo" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button className="close-btn-web" onClick={() => setSelectedRoom(null)}>
        Close Panel
      </button>
    </div>
  );

  return (
    <div className="host-rooms-scope" id="premium-host-dashboard">
      <div className={`host-container ${selectedRoom ? 'detail-open' : ''}`}>
        
        {/* SIDEBAR: Hidden on mobile when a room is selected */}
        <div className="room-list-sidebar">
          <h2 className="sidebar-title gold-text">Your Dog Stays</h2>
          <div className="room-list">
            {rooms.map((room) => (
              <div
                key={room._id}
                className={`room-list-item premium-card ${selectedRoom?._id === room._id ? "active" : ""}`}
                onClick={() => handleSelectRoom(room)}
              >
                <div className="room-list-header">
                  <h4>{room.roomName}</h4>
                  {getStatusDisplay(room)}
                </div>
                <p className="room-address">
                  <FaMapMarkerAlt className="gold-icon" /> {room.fullAddress}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DETAIL AREA: Shown as a full screen overlay on mobile */}
        <div className={`room-detail-area ${selectedRoom ? 'show' : ''}`}>
          {selectedRoom ? (
            <RoomDetail room={selectedRoom} />
          ) : (
            <div className="placeholder-area">
              <div className="placeholder-content">
                <FaPaw className="paw-icon animate-pulse" />
                <h3>Select a Stay to View Details</h3>
                <p>Manage your dog stays and check approval status here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostRoomsManagement;