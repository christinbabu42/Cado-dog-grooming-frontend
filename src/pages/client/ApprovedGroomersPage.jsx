import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaStar, FaMapMarkerAlt, FaFilter, FaSearch, 
  FaAngleLeft, FaTimes, FaSortAmountDown, FaCrosshairs, FaCrown
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAP_API_KEY = "AIzaSyCa5DNrEb02NKai_q38Z_lDPnmh1CMCrxg";

// --- Premium Golden Color Palette ---
const COLORS = {
  primary: "#D4AF37",    // Classic Gold
  primaryDark: "#AA8439", // Deep Gold
  accent: "#F9F4E8",     // Soft Champagne
  textMain: "#1A1A1A",   // Obsidian Black
  textLight: "#707070",  // Muted Gray
  bgLight: "#FAF9F6",    // Off-White Pearl
  success: "#28a745",
  border: "#E5D5A0"      // Light Gold Border
};

// --- Haversine Distance Helper ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

// --- Logic Helpers ---
const saveGroomerToLocalStorage = (groomer) => {
  const groomerData = {
    _id: groomer._id,
    staffID: groomer.staffID?._id || groomer.staffID,
    fullName: groomer.fullName,
    specialization: groomer.specialization,
    placeAddress: groomer.placeAddress,
    servicesOffered: groomer.servicesOffered,
    rating: groomer.rating,
    price: groomer.price,
    phone: groomer.phone,
    alternatePhone: groomer.alternatePhone,
    location: {
      lat: Number(groomer.location?.lat || 0),
      lng: Number(groomer.location?.lng || 0),
    },
  };
  localStorage.setItem("selectedGroomer", JSON.stringify(groomerData));
};

// ----------------------------------------------------------------------
// 1. Groomer Card Component
// ----------------------------------------------------------------------
const GroomerCard = ({ g, navigate, distance }) => {
  return (
    <div className="groomer-card" onClick={() => {
        saveGroomerToLocalStorage(g);
        navigate(`/groomer-booking/${g._id}`);
      }}>
      <div className="card-image-wrapper">
        <img src={g.profileImage || "/fallback-profile.png"} alt={g.fullName} 
             onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=Expert"} />
        <div className="card-badge"><FaCrown style={{marginRight: '4px'}}/> Luvio Expert</div>
      </div>

      <div className="card-content">
        <div className="card-info-main">
          <div className="card-header-row">
            <h3 className="groomer-name">{g.fullName}</h3>
            <div className="rating-pill">
                <FaStar size={12} color={COLORS.primary} /> <span>{g.rating || "New"}</span>
            </div>
          </div>
          
          <p className="location-text">
            <FaMapMarkerAlt size={12} color={COLORS.primary} /> {g.placeAddress || "Nearby"}
            {distance && <span style={{ marginLeft: '8px', color: COLORS.primaryDark }}>• {distance.toFixed(1)} km away</span>}
          </p>
          
          <div className="skills-row">
            {g.skills?.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>

          <div className="perks-row">
             <span>✓ Certified Professional</span>
             <span>✓ Premium Care</span>
          </div>
        </div>

        <div className="card-pricing">
          <div className="price-wrapper">
            <span className="price-sub">Starts From</span>
            <span className="price-amount">₹{g.price || "499"}</span>
          </div>
          <button className="book-btn">View Profile</button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Main Page Component
// ----------------------------------------------------------------------
const ApprovedGroomersPage = () => {
  const [approvedGroomers, setApprovedGroomers] = useState([]);
  const [filteredGroomers, setFilteredGroomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const navigate = useNavigate();

  // --- Advanced Filter States ---
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [userCoords, setUserCoords] = useState(null); 
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [experience, setExperience] = useState("all");
  const [radius, setRadius] = useState(50); 

  const fetchApprovedGroomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/grooming-staff");
      if (res.data.success) {
        const approved = res.data.data.filter((g) => g.isApproved);
        setApprovedGroomers(approved);
        setFilteredGroomers(approved);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchApprovedGroomers(); }, []);

  const handleLocationSearch = async (val) => {
    setLocation(val);
    if (val.length > 3) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${val}&key=${GOOGLE_MAP_API_KEY}`);
        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          setUserCoords({ lat, lng });
        }
      } catch (err) { console.error("Geocoding error", err); }
    } else if (val === "") {
      setUserCoords(null);
    }
  };

  const detectMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        try {
          const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`);
          if (res.data.results[0]) setLocation(res.data.results[0].formatted_address.split(',')[0]);
        } catch (e) { setLocation("Current Location"); }
      });
    }
  };

  useEffect(() => {
    let filtered = approvedGroomers.map(g => {
        const dist = userCoords ? calculateDistance(userCoords.lat, userCoords.lng, g.location?.lat, g.location?.lng) : null;
        return { ...g, distance: dist };
    }).filter((g) => {
      const matchSearch = !search || g.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                          g.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()));
      
      const matchLoc = userCoords 
        ? (g.distance ? g.distance <= radius : true) 
        : (!location || g.placeAddress?.toLowerCase().includes(location.toLowerCase()));

      const matchPrice = (g.price || 0) <= maxPrice;
      const matchRating = (g.rating || 0) >= minRating;
      
      let matchExp = true;
      if (experience === "expert") matchExp = parseInt(g.experience) >= 5;
      if (experience === "mid") matchExp = parseInt(g.experience) >= 2 && parseInt(g.experience) < 5;

      return matchSearch && matchLoc && matchPrice && matchRating && matchExp;
    });

    if (userCoords) {
        filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    setFilteredGroomers(filtered);
  }, [search, location, userCoords, radius, maxPrice, minRating, experience, approvedGroomers]);

  const clearFilters = () => {
    setSearch(""); setLocation(""); setUserCoords(null); setMaxPrice(2000); setMinRating(0); setExperience("all");
  };

  const FilterSidebar = () => (
    <aside className={`sidebar ${isMobileFilterOpen ? "active" : ""}`}>
      <div className="sidebar-header">
        <span className="sidebar-title" style={{ color: COLORS.textMain, fontWeight: '800', letterSpacing: '1px' }}>REFINE SEARCH</span>
        {isMobileFilterOpen && <FaTimes onClick={() => setIsMobileFilterOpen(false)} />}
      </div>

      <style>{`
        input::placeholder { color: #aaa; opacity: 1; }
        .filter-group label { color: ${COLORS.textMain}; font-family: 'Playfair Display', serif; }
        .filter-group select { color: ${COLORS.textMain}; border: 1px solid ${COLORS.border}; }
        .near-me-btn { width: 100%; margin-top: 8px; padding: 10px; background: ${COLORS.accent}; border: 1px solid ${COLORS.primary}; color: ${COLORS.primaryDark}; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.3s; }
        .near-me-btn:hover { background: ${COLORS.primary}; color: white; }
      `}</style>

      <div className="filter-group">
        <label>Service Location</label>
        {/* <div className="input-with-icon">
            <FaMapMarkerAlt className="input-icon" color={COLORS.primary} />
            <input type="text" placeholder="Search city..." value={location} onChange={(e) => handleLocationSearch(e.target.value)} />
        </div> */}
        <button className="near-me-btn" onClick={detectMyLocation}>
            <FaCrosshairs /> Find Near Me
        </button>
      </div>

      {userCoords && (
        <div className="filter-group">
            <label>Distance Radius: <span style={{color: COLORS.primaryDark}}>{radius} km</span></label>
            <input type="range" min="5" max="200" step="5" value={radius} onChange={(e) => setRadius(e.target.value)} className="slider" />
        </div>
      )}

      <div className="filter-group">
        <label>Investment: <span style={{color: COLORS.primaryDark}}>Up to ₹{maxPrice}</span></label>
        <input type="range" min="200" max="3000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="slider" />
        <div className="range-labels"><span>₹200</span><span>₹3000+</span></div>
      </div>

      <div className="filter-group">
        <label>Expertise Level</label>
        <select value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="all">All Professionals</option>
            <option value="expert">Master Groomer (5+ Yrs)</option>
            <option value="mid">Senior Groomer (2-5 Yrs)</option>
        </select>
      </div>

      <button className="clear-btn" onClick={clearFilters}>Reset Selection</button>
      
      {isMobileFilterOpen && (
          <button className="apply-btn-mobile" onClick={() => setIsMobileFilterOpen(false)}>Apply Filters</button>
      )}
    </aside>
  );

  return (
    <div className="page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
        
        .page-wrapper { font-family: 'Inter', sans-serif; background-color: ${COLORS.bgLight}; min-height: 100vh; color: ${COLORS.textMain}; }
        
        .top-nav { background: #1A1A1A; padding: 15px 20px; position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .nav-content { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 20px; }
        
        .search-bar { flex: 1; display: flex; align-items: center; background: #2A2A2A; border: 1px solid #444; border-radius: 8px; padding: 10px 16px; transition: 0.3s; }
        .search-bar input { background: transparent; border: none; outline: none; padding-left: 10px; width: 100%; font-size: 14px; color: white; }
        
        .main-container { max-width: 1280px; margin: 0 auto; padding: 30px 24px; display: grid; grid-template-columns: 320px 1fr; gap: 40px; }
        
        .sidebar { background: white; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 24px; height: fit-content; position: sticky; top: 100px; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.05); }
        .filter-group label { display: block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        
        .input-with-icon input { width: 100%; padding: 12px 12px 12px 40px; border: 1px solid ${COLORS.border}; border-radius: 8px; font-size: 14px; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); }
        
        .slider { width: 100%; accent-color: ${COLORS.primary}; height: 4px; border-radius: 2px; }
.clear-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(
    135deg,
    #F5E7A1 0%,
    #D4AF37 40%,
    #B8962E 60%,
    #8C6B1F 100%
  );
  border: 1.5px solid #8C6B1F;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  color: #1a1a1a;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 12px rgba(212, 175, 55, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* Hover – luxury glow */
.clear-btn:hover {
  background: linear-gradient(
    135deg,
    #FFF2B2 0%,
    #E6C75E 45%,
    #c9a33a9a 100%
  );
  color: #000;
  box-shadow:
    0 6px 18px rgba(187, 156, 55, 0.49),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
}

/* Active (pressed) */
.clear-btn:active {
  transform: translateY(0);
  box-shadow:
    0 3px 8px rgba(212, 175, 55, 0.4),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}


        .groomer-card { background: white; border-radius: 20px; display: flex; margin-bottom: 28px; overflow: hidden; border: 1px solid ${COLORS.border}; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .groomer-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15); border-color: ${COLORS.primary}; }
        
        .card-image-wrapper { width: 260px; position: relative; overflow: hidden; }
        .card-image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .groomer-card:hover .card-image-wrapper img { transform: scale(1.1); }
        .card-badge { position: absolute; top: 15px; left: 15px; background: ${COLORS.textMain}; color: ${COLORS.primary}; padding: 6px 12px; border-radius: 30px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border: 1px solid ${COLORS.primary}; }
        
        .card-content { flex: 1; padding: 25px; display: flex; justify-content: space-between; }
        .groomer-name { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; margin-bottom: 5px; color: ${COLORS.textMain}; }
        .rating-pill { background: ${COLORS.accent}; padding: 4px 12px; border-radius: 20px; border: 1px solid ${COLORS.primary}; display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13px; }
        
        .location-text { display: flex; align-items: center; gap: 5px; color: ${COLORS.textLight}; font-size: 13px; margin: 10px 0; }
        .skill-tag { display: inline-block; background: ${COLORS.bgLight}; border: 1px solid #eee; padding: 5px 15px; border-radius: 30px; font-size: 11px; font-weight: 600; margin: 0 6px 8px 0; color: ${COLORS.textMain}; transition: 0.3s; }
        .groomer-card:hover .skill-tag { border-color: ${COLORS.primary}; background: ${COLORS.accent}; }
        
        .perks-row { margin-top: 15px; display: flex; gap: 20px; font-size: 11px; color: ${COLORS.primaryDark}; font-weight: 700; text-transform: uppercase; }
        
        .card-pricing { border-left: 1px solid ${COLORS.accent}; padding-left: 30px; display: flex; flex-direction: column; justify-content: center; min-width: 180px; text-align: right; background: linear-gradient(to right, #ffffff, ${COLORS.accent}); }
        .price-amount { font-size: 32px; font-weight: 800; color: ${COLORS.textMain}; margin: 5px 0; }
        .price-sub { font-size: 10px; color: ${COLORS.textLight}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .book-btn { margin-top: 15px; background: ${COLORS.textMain}; color: ${COLORS.primary}; border: 1px solid ${COLORS.primary}; padding: 12px; border-radius: 8px; font-weight: 800; text-transform: uppercase; cursor: pointer; font-size: 12px; transition: 0.3s; }
        .book-btn:hover { background: ${COLORS.primary}; color: white; border-color: white; }

        .mobile-filter-bar { display: none; position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: ${COLORS.textMain}; color: ${COLORS.primary}; padding: 15px 35px; border-radius: 40px; z-index: 1001; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; border: 1px solid ${COLORS.primary}; }
        
        .spinner { width: 40px; height: 40px; border: 4px solid ${COLORS.accent}; border-top: 4px solid ${COLORS.primary}; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .main-container { grid-template-columns: 1fr; padding: 20px; }
          .sidebar { display: none; }
          .sidebar.active { display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 2000; border-radius: 0; padding-top: 80px; }
          .groomer-card { flex-direction: column; }
          .card-image-wrapper { width: 100%; height: 240px; }
          .card-pricing { border-left: none; padding: 20px; text-align: left; border-top: 1px solid ${COLORS.accent}; flex-direction: row; justify-content: space-between; align-items: center; }
          .mobile-filter-bar { display: flex; }
        }
      `}</style>

      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-content">
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary }}><FaAngleLeft size={24} /></button>
          <div className="search-bar">
            <FaSearch color={COLORS.primary} size={16} />
            <input type="text" placeholder="Search elite groomers, skills, or services..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </nav>

      <div className="main-container">
        <FilterSidebar />

        <main className="results-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, fontFamily: 'Playfair Display, serif' }}>
              {filteredGroomers.length} {userCoords ? 'Available Nearby' : 'Exclusive Experts'}
            </h2>
            <div style={{ fontSize: '13px', fontWeight: '600', color: COLORS.textLight, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaSortAmountDown color={COLORS.primary} /> SORT: {userCoords ? 'PROXIMITY' : 'RELEVANCE'}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px" }}>
                <div className="spinner"></div>
                <p style={{ fontWeight: '600', letterSpacing: '1px' }}>CURATING TOP PROFESSIONALS...</p>
            </div>
          ) : filteredGroomers.length === 0 ? (
            <div style={{ background: "white", padding: "80px 20px", borderRadius: "20px", textAlign: "center", border: `1px solid ${COLORS.border}` }}>
              <FaSearch size={40} color={COLORS.primary} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px' }}>No matching experts found</h3>
              <p style={{ color: COLORS.textLight, marginTop: '10px' }}>Consider expanding your search radius or adjusting price filters.</p>
              <button onClick={clearFilters} style={{ color: COLORS.primaryDark, background: 'none', border: 'none', fontWeight: 800, textTransform: 'uppercase', marginTop: '20px', cursor: 'pointer', borderBottom: `2px solid ${COLORS.primary}` }}>Reset All Preferences</button>
            </div>
          ) : (
            filteredGroomers.map((g) => <GroomerCard key={g._id} g={g} navigate={navigate} distance={g.distance} />)
          )}
        </main>
      </div>

      <div className="mobile-filter-bar" onClick={() => setIsMobileFilterOpen(true)}>
        <FaFilter size={14} /> Refine Results
      </div>
    </div>
  );
};

export default ApprovedGroomersPage;