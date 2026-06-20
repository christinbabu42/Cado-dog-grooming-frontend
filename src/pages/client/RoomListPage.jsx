import React, { useState, useEffect } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import { FaStar, FaMapMarkerAlt, FaChevronDown, FaFilter, FaAngleRight, FaSearch } from 'react-icons/fa';
import './RoomListPage.css';

// OYO-inspired color palette
const OYO_PRIMARY = '#ff385c'; 
const OYO_SECONDARY = '#007bff'; 
const OYO_ACCENT_TEXT = '#484848'; 
const OYO_BG_LIGHT = '#f7f7f7'; 
const OYO_RATING_GREEN = '#28a745'; 

// --- Custom Hook for Responsiveness ---
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
        isTablet: windowWidth >= 768 && windowWidth < 1024,
        isDesktop: windowWidth >= 1024,
    };
};

// ✅ Price Calculation Helper
const calculateRoomPrice = (pricePerDay) => {
    const fakePrice = Math.round(pricePerDay + (pricePerDay * 0.20)); 
    const userPrice = Math.round(pricePerDay - (pricePerDay * 0.10)); 
    const discount = fakePrice - userPrice;
    return { fakePrice, userPrice, discount };
};

// ----------------------------------------------------------------------
// 1. RoomCard Component
// ----------------------------------------------------------------------
const RoomCard = ({ room }) => {
    const { isMobile } = useWindowWidth();
    const navigate = useNavigate();
    const { fakePrice, userPrice, discount } = calculateRoomPrice(room.pricePerDay);

    const handleViewDetails = () => navigate(`/details/${room._id}`);
    const handleBookNow = (e) => {
        e.stopPropagation();
        navigate(`/book/${room._id}`);
    };

    return (
        <div 
style={{ 
  display: 'flex', 
  flexDirection: isMobile ? 'column' : 'row',
  borderRadius: '12px', 
  margin: '15px 0', 
  boxShadow: `
    0 6px 20px rgba(212, 175, 55, 0.25),  /* soft gold shadow */
    0 2px 6px rgba(0,0,0,0.08)             /* subtle black depth */
  `,
  background: 'linear-gradient(130deg, #fff9e6, #fff6c271, #ffcc005f)', // soft premium gold
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.3s',
  cursor: 'pointer',
}}

            onClick={handleViewDetails}
        >
            <div style={{ 
                flexShrink: 0,
                width: isMobile ? '100%' : '300px', 
                height: '220px', 
                overflow: 'hidden'
            }}>
                <img 
                    src={room.photos && room.photos.length > 0 ? `http://localhost:5000/${room.photos[0]}` : 'https://via.placeholder.com/400x300?text=Dog+Stay+Hotel'} 
                    alt={room.roomName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            
            <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0', color: OYO_ACCENT_TEXT, fontSize: '20px', fontWeight: 'bold' }}>{room.roomName}</h3>
                    {room.isApproved && (
                        <span style={{ color: '#28a745', fontWeight: 'bold', backgroundColor: '#e9f7ef', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-block', marginBottom: '8px' }}>
                            ✅ Approved
                        </span>
                    )}
                    <p style={{ margin: '0 0 15px 0', color: '#999', fontSize: '14px' }}>
                        <FaMapMarkerAlt size={12} style={{ marginRight: '5px' }} />
                        {room.fullAddress}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ backgroundColor: OYO_RATING_GREEN, color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', marginRight: '8px', fontSize: '14px' }}>
                            <FaStar size={12} style={{ marginRight: '4px' }} />4.5
                        </span>
                        <span style={{ color: OYO_ACCENT_TEXT, fontWeight: '600' }}>Excellent</span>
                    </div>
                </div>
            </div>

            <div style={{ width: isMobile ? '100%' : '180px', textAlign: 'right', padding: '20px', borderLeft: isMobile ? 'none' : '1px solid #eee', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>₹{fakePrice}</span>
                    <h4 style={{ margin: '0', fontSize: '26px', color: OYO_PRIMARY, fontWeight: 'bold' }}>₹{userPrice}</h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>per day</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}> 
                    <button onClick={handleViewDetails} style={{ padding: '10px', backgroundColor: OYO_PRIMARY, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>View</button>
                    <button onClick={handleBookNow} style={{ padding: '10px', backgroundColor: OYO_SECONDARY, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Book</button>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// 2. FilterSidebar Component
// ----------------------------------------------------------------------
const FilterSidebar = ({ isMobile, maxPrice, setMaxPrice, onReset }) => {
    if (isMobile) return null;

    return (
        <div className="filter-sticky-wrapper">
            <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <FaFilter size={14} style={{ marginRight: '8px', color: OYO_PRIMARY }} />
                Refine Your Search
            </h4>

            <div style={{ marginBottom: '20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    <span>Price Range</span>
                    <span>Up to ₹{maxPrice}</span>
                </div>

                <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{ width: '100%', accentColor: OYO_PRIMARY }}
                />
            </div>

            <button
                onClick={onReset}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#f0f0f0',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Reset Filters
            </button>
        </div>
    );
};

// ----------------------------------------------------------------------
// 3. Header Component (Updated to Remove Space)
// ----------------------------------------------------------------------
// Header Component (fixed for mobile, search bar centered without overlapping)
const Header = ({ isMobile, searchTerm, setSearchTerm, resultCount }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #fff9e6, #fff1b8, #ffe066)', // soft luxury gold
      borderBottom: '1px solid rgba(212, 175, 55, 0.45)',
      boxShadow: '0 6px 16px rgba(212, 175, 55, 0.35)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      padding: isMobile ? '10px 16px' : '10px 40px',
    }}
  >
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '10px' : '0',
      }}
    >
      {/* LEFT: Home + Title */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
        <a
          href="/"
          style={{
            textDecoration: 'none',
            color: '#fff8e1', // soft cream gold
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '2px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#fff8e1')}
        >
          <FaAngleRight
            size={14}
            style={{ transform: 'rotate(180deg)', marginRight: '5px', color: '#fff8e1' }}
          />
          Home
        </a>

        <h1
style={{ 
  margin: 0,
  fontSize: isMobile ? '18px' : '24px',
  color: '#8c7703', // soft golden title
  lineHeight: '1.2',
  textAlign: isMobile ? 'center' : 'left',
  textShadow: `
    0 1px 0 #b38f00,    /* subtle dark shadow for depth */
    0 2px 3px rgba(0,0,0,0.2),  /* soft larger shadow */
    0 0 8px rgba(255, 217, 0, 0.6)  /* golden glow */
  `,
}}

        >
          Approved Dog-Stays
        </h1>
      </div>

      {/* CENTERED SEARCH BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: isMobile ? '100%' : '480px',
          backgroundColor: 'white',
          border: '1px solid #ffda55', // brighter golden border
          borderRadius: '50px',
          padding: '0 18px',
          height: '46px',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.25)', // subtle golden glow
          marginTop: isMobile ? '10px' : '0',
        }}
      >
        <FaSearch color="#ffda55" style={{ marginRight: '10px' }} />
        <input
          type="text"
          placeholder="Search by city, area or boarding name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '14px',
            color: '#333', // dark enough for readability
          }}
        />
      </div>

      {/* RIGHT: Result Count (desktop only) */}
      {!isMobile && (
        <p
          style={{
  color: '#8c7703', // soft golden title
  lineHeight: '1.2',
  textAlign: isMobile ? 'center' : 'left',
  textShadow: `
    0 1px 0 #b38f00,    /* subtle dark shadow for depth */
    0 2px 3px rgba(0,0,0,0.2),  /* soft larger shadow */
    0 0 8px rgba(255, 217, 0, 0.6)  /* golden glow */
  `,
          }}
        >
          <strong>{resultCount}</strong> results found
        </p>
      )}
    </div>
  </div>
);



// ----------------------------------------------------------------------
// 4. RoomListPage Component
// ----------------------------------------------------------------------
const RoomListPage = () => {
    const { isMobile } = useWindowWidth(); 
    const [roomList, setRoomList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState(10000);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/dogstay/approved');
                const data = await res.json();
                if (data.success) setRoomList(data.listings);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const handleReset = () => {
        setSearchTerm('');
        setMaxPrice(10000);
    };

    const filteredRooms = roomList.filter((room) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = (
            room.fullAddress?.toLowerCase().includes(query) ||
            room.roomName?.toLowerCase().includes(query) ||
            room.pinCode?.toString().includes(query)
        );
        const matchesPrice = room.pricePerDay <= maxPrice;
        return matchesSearch && matchesPrice;
    });

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: OYO_BG_LIGHT, minHeight: '100%', width: '100vw', overflowX: 'hidden', paddingTop: '130px', }}>
            <Header 
                isMobile={isMobile} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                resultCount={filteredRooms.length} 
            />

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '0 10px' : '0 60px', display: 'flex', gap: '30px' }}>
                <FilterSidebar 
                    isMobile={isMobile} 
                    maxPrice={maxPrice} 
                    setMaxPrice={setMaxPrice} 
                    onReset={handleReset} 
                />
                
                <div style={{
                    flexGrow: 1,
                    minWidth: 0,
                    marginLeft: isMobile ? '0' : '310px'
                }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading dog stays...</p>
                    ) : filteredRooms.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <p>No matches found.</p>
                            <button onClick={handleReset} style={{ color: OYO_PRIMARY, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Clear Filters</button>
                        </div>
                    ) : (
                        filteredRooms.map((room) => <RoomCard key={room._id} room={room} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomListPage;
