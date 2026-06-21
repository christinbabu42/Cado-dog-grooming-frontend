import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    FaPaw, FaStar, FaMapMarkerAlt, FaDollarSign, FaCheckSquare, FaUser,
    FaClock, FaCalendarAlt, FaDog, FaShieldAlt, FaArrowLeft, FaUpload, FaPaperPlane, FaTimesCircle
} from 'react-icons/fa';
import './DogStayDetails.css';

// --- ✨ Golden Theme Color Palette and Constants ---
const GOLD_PRIMARY = '#D4AF37'; // Metallic Gold
const GOLD_DARK = '#996515';    // Golden Brown
const GOLD_LIGHT = '#F4E0AF';   // Soft Gold
const OYO_SECONDARY = '#1a1a1a'; // Deep Obsidian for contrast
const OYO_BG_LIGHT = '#faf9f6';  // Ivory White
const CARD_BG = '#ffffff';
const GOLD_ACCENT_LIGHT = '#fdf8e6';
const BOX_STYLE = { boxSizing: 'border-box' };
const BACKEND_BASE_URL = 'https://cado-dog-grooming-backend.onrender.com/';

// --- STYLES Object ---
const STYLES = {
    pageContainer: { ...BOX_STYLE, width: '100vw', overflowX: 'hidden', backgroundColor: OYO_BG_LIGHT, minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    contentWrapper: (isMobile) => ({
        ...BOX_STYLE,
        padding: isMobile ? '20px' : '40px 80px',
        margin: '0 auto',
        maxWidth: '1280px',
        backgroundColor: CARD_BG,
        paddingTop: isMobile ? '20px' : '40px',
        borderRadius: isMobile ? '0' : '15px',
        boxShadow: isMobile ? 'none' : '0 15px 45px rgba(212, 175, 55, 0.12)',
        border: isMobile ? 'none' : `1px solid ${GOLD_LIGHT}`
    }),
    headerTitle: (isMobile) => ({ color: OYO_SECONDARY, fontSize: isMobile ? '32px' : '48px', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }),
    headerSubline: { display: 'flex', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '15px' },
    locationText: { color: OYO_SECONDARY, opacity: 0.85, fontSize: '16px', margin: 0, fontWeight: '500' },
    galleryPlaceholder: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', fontSize: '24px', color: GOLD_DARK, backgroundColor: GOLD_ACCENT_LIGHT, fontWeight: 'bold', flexDirection: 'column', gap: '10px' },
    smallImagePlaceholder: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', width: '100%', fontSize: '18px', color: '#777', backgroundColor: '#f0f0f0', fontWeight: '500', flexDirection: 'column', gap: '5px', borderRadius: '12px', marginBottom: '15px', border: '1px dashed #ccc' },
    photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px', marginBottom: '40px' },
    photoCard: { overflow: 'hidden', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '220px', border: `1px solid ${GOLD_LIGHT}`, transition: 'transform 0.2s' },
    desktopLayout: { display: 'flex', gap: '60px', alignItems: 'flex-start' },
    sidebarArea: (isMobile) => ({ flex: isMobile ? 'none' : '1', width: isMobile ? '100%' : '350px', position: isMobile ? 'static' : 'sticky', top: '120px', zIndex: 10 }),
    contentArea: { flex: 2, width: '100%' },
    hostInfoContainer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${GOLD_ACCENT_LIGHT}`, paddingBottom: '25px', marginBottom: '35px' },
    hostAvatar: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: GOLD_PRIMARY, display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px', color: CARD_BG, flexShrink: 0, boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)' },
    hostName: { margin: 0, fontWeight: 'bold', fontSize: '22px', color: OYO_SECONDARY },
    hostDetails: { margin: '3px 0 0 0', color: OYO_SECONDARY, opacity: 0.7, fontSize: '15px' },
    verifiedBadge: { display: 'flex', alignItems: 'center', color: GOLD_DARK, fontWeight: '700', fontSize: '15px', backgroundColor: GOLD_ACCENT_LIGHT, padding: '8px 15px', borderRadius: '25px', border: `1px solid ${GOLD_PRIMARY}` },
    descriptionText: { fontSize: '18px', lineHeight: '1.7', color: OYO_SECONDARY },
    dogStats: { fontSize: '15px', color: OYO_SECONDARY, opacity: 0.7, marginTop: '15px', fontWeight: '600' },
    miniGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px' },
    amenityItem: { display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: GOLD_ACCENT_LIGHT, borderRadius: '12px', border: `1px solid ${GOLD_PRIMARY}`, transition: 'transform 0.2s, box-shadow 0.2s', fontWeight: '600' },
    serviceList: { listStyleType: 'none', padding: 0, margin: 0, fontSize: '16px', lineHeight: '2.5' },
    serviceListItem: { fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' },
    timingBox: { display: 'flex', flexDirection: 'column', padding: '15px', backgroundColor: '#fff', borderRadius: '12px', border: `2px solid ${GOLD_LIGHT}`, textAlign: 'center' },
    timingLabel: { fontSize: '13px', color: OYO_SECONDARY, opacity: 0.8, marginBottom: '5px' },
    timingValue: { fontSize: '18px', color: GOLD_DARK, fontWeight: 'bold' },
    locationCard: { marginBottom: '40px', backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: `1px solid ${GOLD_LIGHT}`, boxShadow: '0 10px 20px rgba(0,0,0,0.03)' },
    mapPlaceholder: { height: '450px', backgroundColor: GOLD_ACCENT_LIGHT, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: `1px solid ${GOLD_LIGHT}`, marginBottom: '15px', fontSize: '20px', fontWeight: 'bold', color: OYO_SECONDARY, overflow: 'hidden' },
    mapAddress: { textAlign: 'center', color: OYO_SECONDARY, fontWeight: 'bold', fontSize: '16px' },
    reviewForm: { marginTop: '50px', padding: '25px', borderRadius: '15px', border: `1px solid ${GOLD_LIGHT}`, backgroundColor: CARD_BG, boxShadow: '0 5px 20px rgba(0,0,0,0.05)' },
    reviewTextarea: { width: '100%', padding: '15px', borderRadius: '12px', border: `1px solid ${GOLD_LIGHT}`, fontSize: '15px', resize: 'vertical', marginBottom: '15px',  color: '#000000',          // ✅ FORCE BLACK TEXT
  backgroundColor: '#ffffff' },
    reviewInput: { padding: '10px', borderRadius: '10px', border: `1px solid ${GOLD_LIGHT}`, width: '100%', marginBottom: '15px' },
    reviewDisplay: { backgroundColor: GOLD_ACCENT_LIGHT, padding: '20px', borderRadius: '10px', marginBottom: '20px', borderLeft: `5px solid ${GOLD_PRIMARY}` },
    reviewPhoto: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }
};

// ⭐ Price Helper
const calculateRoomPrice = (pricePerDay) => {
    const fakePrice = Math.round(pricePerDay + (pricePerDay * 0.20));
    const userPrice = Math.round(pricePerDay - (pricePerDay * 0.10));
    const discount = fakePrice - userPrice;
    return { fakePrice, userPrice, discount };
};

// ⭐ Custom Hooks
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);
    return isMobile;
};

// ⭐ Subcomponents
const DetailSectionHeader = ({ title, icon: Icon }) => (
    <h3 style={{ display: 'flex', alignItems: 'center', color: OYO_SECONDARY, borderBottom: `2px solid ${GOLD_LIGHT}`, paddingBottom: '10px', marginBottom: '20px', fontSize: '24px', fontWeight: '700' }}>
        <Icon size={24} color={GOLD_PRIMARY} style={{ marginRight: '10px' }} />{title}
    </h3>
);

const RatingBadge = ({ rating, count, roomId }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/reviews/${roomId}`)}
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: '10px 20px',
                borderRadius: '25px',
                border: `1px solid ${GOLD_PRIMARY}`,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.15)'
            }}
        >
            <FaStar size={18} color={GOLD_PRIMARY} style={{ marginRight: '8px' }} />
            <span style={{ color: GOLD_DARK, fontWeight: '900', fontSize: '18px' }}>{rating}</span>
            <span style={{ color: OYO_SECONDARY, marginLeft: '10px', opacity: 0.7, fontSize: '14px', fontWeight: '500' }}>
                ({count} Reviews)
            </span>
        </div>
    );
};

const FormTextarea = ({ label, name, value, onChange, rows = 3, readOnly = false }) => (
    <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: OYO_SECONDARY, fontSize: '16px' }}>{label}</label>
        <textarea name={name} value={value} onChange={onChange} rows={rows} readOnly={readOnly} style={{ ...STYLES.reviewTextarea }} />
    </div>
);

const resolveImageURL = (photoPath) => {
    if (!photoPath) return null;
    return `${BACKEND_BASE_URL}${photoPath}`;
};

// ⭐ AddReviewForm Component
const AddReviewForm = ({ roomId, hostId, onReviewAdded }) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastSubmitted, setLastSubmitted] = useState(null);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    const handlePhotoChange = (e) => { if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]); };

    const fetchReviews = async () => {
        try { const { data } = await axios.get(`${BACKEND_BASE_URL}api/reviews/${roomId}`); setReviews(data); }
        catch (err) { console.error('Failed to fetch reviews:', err); }
    };

    useEffect(() => { fetchReviews(); }, [roomId, lastSubmitted]);

    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText) return alert('Please enter review text.');
        const formData = new FormData();
        formData.append("hostId", hostId);
        formData.append('reviewText', reviewText);
        formData.append('rating', rating);
        if (photo) formData.append('photo', photo);

        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const res = await axios.post(`${BACKEND_BASE_URL}api/reviews/${roomId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });
            alert('Review added successfully!');
            setLastSubmitted({ reviewText, rating, photoPath: res.data.photoPath });
            setReviewText(''); setRating(5); setPhoto(null);
            if (onReviewAdded) onReviewAdded();
        } catch (err) { console.error(err); alert(`Failed to add review: ${err.response?.data?.message || err.message}`); }
        finally { setLoading(false); }
    };

    return (
        <div style={STYLES.reviewForm}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: OYO_SECONDARY }}>Add Your Review</h3>

            {reviews.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '10px 15px', backgroundColor: GOLD_ACCENT_LIGHT, borderRadius: '10px', border: `1px solid ${GOLD_PRIMARY}` }}>
                    <FaStar color={GOLD_PRIMARY} size={22} style={{ marginRight: '8px' }} />
                    <span style={{ fontWeight: '700', fontSize: '16px', color: GOLD_DARK }}>{averageRating} / 5 ({reviews.length} Reviews)</span>
                </div>
            )}

            {reviews.length > 0 && (
                <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '20px', border: `1px solid ${GOLD_LIGHT}`, borderRadius: '10px', padding: '15px', backgroundColor: '#fff' }}>
{reviews.map((r, idx) => (
  <div
    key={idx}
    style={{
      marginBottom: '20px',
      borderBottom: `1px solid ${GOLD_ACCENT_LIGHT}`,
      paddingBottom: '15px'
    }}
  >
    {/* USER REVIEW */}
    <p style={{ margin: '0 0 5px 0', fontWeight: '700', color: OYO_SECONDARY }}>
      {r.user?.name || r.user?.username || 'Guest'}
    </p>

    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: GOLD_DARK }}>
      <FaStar color={GOLD_PRIMARY} /> {r.rating}/5
    </p>

    <p style={{ fontStyle: 'italic', margin: '0', color: 'black' }}>
      “{r.reviewText}”
    </p>

    {r.photo && (
      <img
        src={resolveImageURL(r.photo)}
        alt="Review attachment"
        style={STYLES.reviewPhoto}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/100?text=Image+Error';
        }}
      />
    )}

    {/* ✅ HOST RESPONSE */}
    {r.hostResponse?.text && (
      <div
        style={{
          marginTop: '12px',
          padding: '12px 15px',
          backgroundColor: '#ffffff',
          borderLeft: `4px solid ${GOLD_PRIMARY}`,
          borderRadius: '8px',
          boxShadow: '0 3px 10px rgba(212,175,55,0.15)'
        }}
      >
        <p
          style={{
            margin: '0 0 5px 0',
            fontWeight: '700',
            color: GOLD_DARK,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FaUser /> Host Response
        </p>

        <p style={{ margin: 0, fontSize: '14px', color: '#000' }}>
          {r.hostResponse.text}
        </p>

        <p style={{ marginTop: '6px', fontSize: '12px', opacity: 0.6 }}>
          {new Date(r.hostResponse.respondedAt).toLocaleDateString()}
        </p>
      </div>
    )}
  </div>
))}

                </div>
            )}

            {reviews.length > 0 && <button onClick={() => navigate(`/reviews/${roomId}`)} style={{ marginBottom: '25px', width: '100%', padding: '12px 0', backgroundColor: GOLD_PRIMARY, color: CARD_BG, border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Show All Reviews</button>}

            {lastSubmitted && (
                <div style={STYLES.reviewDisplay}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px'}}>
                        <p style={{margin: 0, fontWeight: '700', color: GOLD_DARK}}>✅ Review Submitted (Awaiting Approval)</p>
                        <button onClick={() => setLastSubmitted(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: GOLD_PRIMARY}}><FaTimesCircle/></button>
                    </div>
                    <p style={{margin: '5px 0', fontSize: '15px'}}><FaStar color={GOLD_PRIMARY}/> Rating: {lastSubmitted.rating}/5</p>
                    <p style={{margin: '5px 0', fontStyle: 'italic'}}>"{lastSubmitted.reviewText}"</p>
                    {lastSubmitted.photoPath && <div style={{marginTop: '15px'}}><p style={{fontWeight: '700', margin: '0 0 5px 0'}}>Photo Uploaded:</p><img src={resolveImageURL(lastSubmitted.photoPath)} alt="Review attachment" style={STYLES.reviewPhoto} /></div>}
                </div>
            )}

            <div style={{ display: "flex", marginBottom: "15px", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <FaStar key={star} size={28} onClick={() => setRating(star)} style={{ cursor: "pointer", transition: "0.2s" }} color={star <= rating ? GOLD_PRIMARY : "#ccc"} />
                ))}
            </div>

            <FormTextarea label="Review" name="review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />

            <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px'}}>
                <label style={{fontWeight: '700', color: OYO_SECONDARY, flexShrink: 0}}>Upload Photo (Optional):</label>
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{...STYLES.reviewInput, marginBottom: '0', color:'black'}} />
            </div>

            <button onClick={handleSubmit} disabled={loading} style={{ ...STYLES.reviewInput, backgroundColor: GOLD_PRIMARY, color: CARD_BG, border: 'none', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FaPaperPlane /> {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </div>
    );
};

// ⭐ Main Component
const DogStayDetailsPage = () => {
    const { id, roomId } = useParams()
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reviewsUpdated, setReviewsUpdated] = useState(false);
    const isMobile = useIsMobile(768);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const { data: apiData } = await axios.get(`${BACKEND_BASE_URL}api/admin/dogstay/${roomId}`);
                if (apiData) setData(apiData);
                else setError('Room details not found.');
            } catch (err) {
                console.error('Error fetching listing:', err);
                setError(err.response?.data?.message || 'Failed to fetch room details.');
            } finally { setLoading(false); }
        };
        if (roomId) fetchListing();
        else setLoading(false);
    }, [roomId, reviewsUpdated]);

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: GOLD_DARK }}>Loading the finest stays... 🐾</p>;
    if (error) return <p style={{ textAlign: 'center', marginTop: '50px', color: GOLD_PRIMARY, fontSize: '18px', fontWeight: 'bold' }}>{error}</p>;
    if (!data) return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: OYO_SECONDARY }}>Room details unavailable.</p>;

    const images = data.photos || [];
    const { fakePrice, userPrice, discount } = calculateRoomPrice(data.pricePerDay);

    const PriceBox = () => (
        <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '18px', fontWeight: '600' }}>₹{fakePrice}</span>
                <span style={{ backgroundColor: GOLD_ACCENT_LIGHT, color: GOLD_DARK, padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', border: `1px solid ${GOLD_PRIMARY}` }}>Exclusive Save ₹{discount}</span>
            </div>
            <h2 style={{ margin: '5px 0 0 0', color: GOLD_DARK, fontSize: '38px', fontWeight: '900' }}>
                ₹{userPrice} <span style={{ fontSize: '18px', color: OYO_SECONDARY, opacity: 0.7, fontWeight: '500' }}> / night</span>
            </h2>
            <RatingBadge rating={data.rating} count={data.reviewCount} roomId={roomId} />
            <div style={{ margin: '30px 0', border: `1px solid ${GOLD_LIGHT}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(212, 175, 55, 0.08)' }}>
            </div>
            <p style={{ fontSize: '15px', color: OYO_SECONDARY, opacity: 0.8, margin: '0 0 20px 0', fontWeight: '500' }}>+ Pet Service Fee: <span style={{ fontWeight: 'bold', color: GOLD_DARK }}>₹{data.additionalPetCharge || 0}</span></p>
            <Link to={`/book/${data._id}`} state={{ stayData: data }} style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{ ...BOX_STYLE, width: '100%', padding: '18px', backgroundColor: OYO_SECONDARY, color: GOLD_PRIMARY, border: `1px solid ${GOLD_PRIMARY}`, borderRadius: '10px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                    onMouseOver={e => { e.currentTarget.style.backgroundColor = GOLD_PRIMARY; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { e.currentTarget.style.backgroundColor = OYO_SECONDARY; e.currentTarget.style.color = GOLD_PRIMARY; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <FaCalendarAlt style={{ marginRight: '10px' }} /> Reserve Luxury Stay
                </button>
            </Link>
        </div>
    );

    return (
        <div style={STYLES.pageContainer}>
            <div style={STYLES.contentWrapper(isMobile)}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: GOLD_DARK, cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '16px', fontWeight: '600', opacity: 0.8, padding: '5px 0' }}>
                    <FaArrowLeft style={{ marginRight: '10px' }} /> Back to Collection
                </button>

                {/* Title & Rating */}
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={STYLES.headerTitle(isMobile)}>{data.roomName}</h1>
                    <div style={STYLES.headerSubline}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaMapMarkerAlt size={16} color={GOLD_PRIMARY} style={{ marginRight: '8px' }} />
                            <p style={STYLES.locationText}>{data.fullAddress}, {data.pinCode}</p>
                        </div>
                        <RatingBadge rating={data.rating} count={data.reviewCount} roomId={roomId} />
                    </div>
                </div>

                {/* Photo Gallery */}
                <DetailSectionHeader title="Premier Gallery" icon={FaPaw} />
                <div style={{ marginBottom: '50px' }}>
                    {images.length > 0 ? (
                        <div style={STYLES.photoGrid}>
                            {images.map((photo, index) => (
                                <div key={index} style={STYLES.photoCard} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <img src={resolveImageURL(photo)} alt={`Photo ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://via.placeholder.com/250x220?text=Load+Error'} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{...STYLES.galleryPlaceholder, height: '300px', borderRadius: '15px'}}>
                            <FaPaw size={50} style={{ marginBottom: '10px' }} color={GOLD_PRIMARY} />
                            <span style={{ fontSize: '18px' }}>No photos uploaded yet.</span>
                        </div>
                    )}
                </div>

                {/* Main Content & Sidebar */}
                <div style={isMobile ? {} : STYLES.desktopLayout}>
                    <div style={STYLES.contentArea}>
                        {/* Host Info */}
                        <div style={STYLES.hostInfoContainer}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={STYLES.hostAvatar}><FaUser size={30} /></div>
                                <div>
                                    <p style={STYLES.hostName}>Hosted by {data.ownerFullName}</p>
                                    <p style={STYLES.hostDetails}> Experience Tier: <strong style={{color: GOLD_DARK}}>{data.stayType}</strong></p>
                                </div>
                            </div>
                            {data.verifiedHost && <div style={STYLES.verifiedBadge}><FaShieldAlt style={{ marginRight: '8px' }} /> Elite Verified</div>}
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '50px' }}>
                            <DetailSectionHeader title="The Experience" icon={FaDog} />
                            <p style={STYLES.descriptionText}>{data.shortDescription}</p>
                            <p style={STYLES.dogStats}>
                                Preferred Sizes: <span style={{ fontWeight: '700', color: GOLD_DARK }}>{data.allowedSizes?.join(', ')}</span> | Max Weight: <span style={{ fontWeight: '700', color: GOLD_DARK }}>{data.weightLimit || 'Unlimited'} kg</span>
                            </p>
                        </div>

                        {/* Amenities */}
                        <div style={{ marginBottom: '50px' }}>
                            <DetailSectionHeader title="Elite Amenities" icon={FaCheckSquare} />
                            <div style={STYLES.miniGrid}>
                                {data.amenities?.map(amenity => (
                                    <div key={amenity} style={STYLES.amenityItem}><FaPaw size={18} color={GOLD_PRIMARY} style={{ marginRight: '10px' }} /><span style={{ fontSize: '15px', color: OYO_SECONDARY }}>{amenity}</span></div>
                                ))}
                            </div>
                        </div>

                        {/* Rules & Timings */}
                        <div style={{ marginBottom: '50px' }}>
                            <DetailSectionHeader title="Stay Guidelines" icon={FaClock} />
                            <div style={STYLES.miniGrid}>
                                <div style={STYLES.timingBox}><FaClock size={20} color={GOLD_PRIMARY} style={{ marginBottom: '8px' }} /><span style={STYLES.timingLabel}>Check-in</span><span style={STYLES.timingValue}>{data.checkInTime}</span></div>
                                <div style={STYLES.timingBox}><FaClock size={20} color={GOLD_PRIMARY} style={{ marginBottom: '8px' }} /><span style={STYLES.timingLabel}>Check-out</span><span style={STYLES.timingValue}>{data.checkOutTime}</span></div>
                                <div style={STYLES.timingBox}><FaDog size={20} color={GOLD_PRIMARY} style={{ marginBottom: '8px' }} /><span style={STYLES.timingLabel}>Health Records</span><span style={STYLES.timingValue}>{data.vaccinationRequired}</span></div>
                            </div>
                            <FormTextarea label="Host Expectations" name="rulesGuidelines" value={data.rulesGuidelines} rows={3} readOnly={true} />
                        </div>

                        {/* Location & Map */}
                        <div style={{ ...STYLES.locationCard }}>
                            <DetailSectionHeader title="Elite Location" icon={FaMapMarkerAlt} />
                            <div style={{ ...STYLES.mapPlaceholder }}>
                                {data.location?.coordinates && data.location.coordinates.length === 2 ? (
                                    (() => {
                                        const [lng, lat] = data.location.coordinates;
                                        return <iframe title="Stay Location Map" width="100%" height="100%" frameBorder="0" style={{ border: 0, borderRadius: '12px' }} src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`} allowFullScreen></iframe>
                                    })()
                                ) : (
                                    <iframe title="Stay Location Map fallback" width="100%" height="100%" frameBorder="0" style={{ border: 0, borderRadius: '12px' }} src={`https://maps.google.com/maps?q=${encodeURIComponent(data.fullAddress)}&z=15&output=embed`} allowFullScreen></iframe>
                                )}
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ ...STYLES.mapAddress, fontSize: '18px', marginBottom: '10px' }}>{data.fullAddress}</p>
                                <p style={{ color: OYO_SECONDARY, opacity: 0.7, fontSize: '14px' }}>Postal Code: {data.pinCode}</p>
                                <a href={data.googleMapsLink || (data.location?.coordinates ? `https://www.google.com/maps?q=${data.location.coordinates[1]},${data.location.coordinates[0]}` : `https://www.google.com/maps?q=${encodeURIComponent(data.fullAddress)}`)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '15px', color: GOLD_DARK, fontWeight: 'bold', textDecoration: 'none', padding: '10px 20px', border: `1px solid ${GOLD_PRIMARY}`, borderRadius: '8px', backgroundColor: GOLD_ACCENT_LIGHT }}>Navigate with Google Maps</a>
                            </div>
                        </div>

                        {/* Add Review */}
                        <AddReviewForm roomId={roomId} hostId={data?.hostId} onReviewAdded={() => setReviewsUpdated(!reviewsUpdated)} />
                    </div>

                    {/* Sidebar */}
                    <div style={STYLES.sidebarArea(isMobile)}><PriceBox /></div>
                </div>

                <div style={{height: '50px'}}></div>
            </div>
        </div>
    );
};

export default DogStayDetailsPage;