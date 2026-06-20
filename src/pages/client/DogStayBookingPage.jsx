import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaPaw, FaStar, FaUser, FaEnvelope, FaMobileAlt, FaCalendarAlt,
  FaCreditCard, FaLock, FaCheckCircle, FaDog
} from 'react-icons/fa';

// --- Premium Golden Color Palette ---
const GOLD_PRIMARY = '#D4AF37'; // Classic Gold
const GOLD_DARK = '#AA8439';    // Deep Golden
const GOLD_LIGHT = '#F9F4E8';   // Soft Creamy Gold Background
const TEXT_BLACK = '#000000';   // Pure Black Text
const CARD_BG = '#ffffff';
const BOX_STYLE = { boxSizing: 'border-box' };
const BACKEND_BASE_URL = 'http://localhost:5000';

// --- Helper Components ---
const RatingBadge = ({ rating, count }) => (
  <div style={{
    display: 'flex', alignItems: 'center', backgroundColor: GOLD_LIGHT,
    padding: '5px 10px', borderRadius: '15px', border: `1px solid ${GOLD_PRIMARY}`
  }}>
    <FaStar size={12} color={GOLD_DARK} style={{ marginRight: '5px' }} />
    <span style={{ color: TEXT_BLACK, fontWeight: 'bold', fontSize: '13px' }}>{rating}</span>
    <span style={{ color: TEXT_BLACK, marginLeft: '5px', opacity: 0.7, fontSize: '11px' }}>({count} Ratings)</span>
  </div>
);

const BookingInput = ({ icon: Icon, placeholder, value, onChange, type = 'text', readOnly = false, name }) => (
  <div style={{
    display: 'flex', alignItems: 'center', marginBottom: '20px',
    border: `1px solid ${readOnly ? '#e0e0e0' : GOLD_PRIMARY}`,
    borderRadius: '8px', overflow: 'hidden',
    backgroundColor: readOnly ? '#f5f5f5' : CARD_BG
  }}>
    <Icon size={20} color={GOLD_DARK} style={{ margin: '0 15px' }} />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      name={name}
      style={{
        ...BOX_STYLE,
        width: '100%',
        padding: '14px 0',
        border: 'none',
        fontSize: '16px',
        color: TEXT_BLACK,
        outline: 'none',
        backgroundColor: 'transparent'
      }}
    />
  </div>
);

// --- SUB-COMPONENTS ---

const StaySummaryCard = ({ stayData, costDetails, bookingDetails, averageRating, totalReviews }) => {
  if (!stayData) return <p style={{ color: TEXT_BLACK }}>Loading stay details...</p>;

  return (
    <div style={{ ...BOX_STYLE, backgroundColor: CARD_BG, padding: '20px', borderRadius: '12px', marginBottom: '30px', border: `1px solid ${GOLD_PRIMARY}`, boxShadow: '0 4px 15px rgba(212, 175, 55, 0.1)' }}>
      <h2 style={{ color: TEXT_BLACK, margin: '0 0 15px 0', fontSize: '24px', borderBottom: `1px solid ${GOLD_LIGHT}`, paddingBottom: '10px' }}>
        <FaPaw color={GOLD_PRIMARY} style={{ marginRight: '10px' }} /> Booking Summary
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
<div>
  <h3 style={{ 
    margin: '0 0 5px 0', 
    color: TEXT_BLACK, 
    fontSize: '32px', 
    fontWeight: '800', 
    letterSpacing: '-0.5px', // Modern tight kerning for high-end brands
    textTransform: 'capitalize',
    fontFamily: '"Playfair Display", "Georgia", serif', // High-end serif font look
    lineHeight: '1.2'
  }}>
    {stayData.roomName}
  </h3>
  
  <p style={{ 
    margin: '0 0 12px 0', 
    fontSize: '13px', 
    color: GOLD_DARK, // Using gold for the address to separate it from the title
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase', // Address in uppercase looks more like a luxury brand label
    display: 'flex',
    alignItems: 'center'
  }}>
    <span style={{ marginRight: '5px' }}>📍</span> {stayData.address}
  </p>

  {/* Using dynamic rating logic from props */}
  <div style={{ transform: 'scale(1.05)', transformOrigin: 'left' }}>
    <RatingBadge 
      rating={averageRating > 0 ? averageRating : (stayData.rating || 0)} 
      count={totalReviews > 0 ? totalReviews : (stayData.reviewCount || 0)} 
    />
  </div>
</div>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: `1px dashed ${GOLD_PRIMARY}` }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: TEXT_BLACK }}>
          <FaCalendarAlt color={GOLD_PRIMARY} style={{ marginRight: '10px' }} />
          Duration: {costDetails.nights} Night{costDetails.nights > 1 ? 's' : ''}
        </p>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: TEXT_BLACK }}>
          <FaDog color={GOLD_PRIMARY} style={{ marginRight: '10px' }} />
          Dogs: {bookingDetails.numDogs}
        </p>
      </div>
    </div>
  );
};

const DateAndDogSelector = ({ bookingDetails, handleChange }) => {
  const dateInputStyle = {
    ...BOX_STYLE,
    flex: 1,
    minWidth: '150px',
    padding: '12px',
    border: `2px solid ${GOLD_PRIMARY}`,
    borderRadius: '8px',
    fontSize: '16px',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none'
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(0) brightness(0);
          padding: 5px;
        }
      `}</style>

      <h3 style={{ 
        color: '#000000', 
        borderBottom: `2px solid ${GOLD_PRIMARY}`, 
        paddingBottom: '10px', 
        marginBottom: '20px' 
      }}>
        <FaCalendarAlt color={GOLD_PRIMARY} style={{ marginRight: '10px' }} /> 
        Select Dates & Guests
      </h3>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ color: '#000000', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Check-In</label>
          <input 
            type="date" 
            name="checkInDate" 
            value={bookingDetails.checkInDate} 
            onChange={handleChange}
            style={dateInputStyle} 
          />
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ color: '#000000', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Check-Out</label>
          <input 
            type="date" 
            name="checkOutDate" 
            value={bookingDetails.checkOutDate} 
            onChange={handleChange}
            style={dateInputStyle} 
          />
        </div>
      </div>
    </div>
  );
};

const UserDetailsForm = ({
  bookingDetails,
  handleChange,
  passcodeSent,
  setPasscodeSent
}) => (
  <div style={{ marginBottom: '30px' }}>
    <h3 style={{ color: TEXT_BLACK, borderBottom: `2px solid ${GOLD_PRIMARY}`, paddingBottom: '10px', marginBottom: '20px' }}>
      <FaUser color={GOLD_PRIMARY} style={{ marginRight: '10px' }} /> Enter Your Details
    </h3>

    <BookingInput
      icon={FaUser}
      placeholder="Full Name"
      name="fullName"
      value={bookingDetails.fullName}
      onChange={handleChange}
    />

    <BookingInput
      icon={FaEnvelope}
      placeholder="Email Address"
      name="email"
      type="email"
      value={bookingDetails.email}
      onChange={handleChange}
    />

    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <BookingInput
          icon={FaMobileAlt}
          placeholder="Mobile Number"
          name="mobile"
          type="tel"
          value={bookingDetails.mobile}
          onChange={handleChange}
          readOnly={passcodeSent}
        />
      </div>

      <button
        type="button"
        onClick={() => setPasscodeSent(true)}
        disabled={!bookingDetails.mobile || bookingDetails.mobile.length < 10 || passcodeSent}
        style={{
          padding: '12px 20px',
          backgroundColor: passcodeSent ? '#28a745' : TEXT_BLACK,
          color: GOLD_PRIMARY,
          border: `1px solid ${GOLD_PRIMARY}`,
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: '0.3s'
        }}
      >
        {passcodeSent ? <FaCheckCircle color="white" /> : 'Send Passcode'}
      </button>
    </div>
  </div>
);

const PriceDetailsCard = ({ stayData, costDetails }) => {
  if (!stayData) return <p style={{ color: TEXT_BLACK }}>Loading price details...</p>;

  return (
    <div style={{
      backgroundColor: CARD_BG,
      padding: '25px',
      borderRadius: '12px',
      border: `2px solid ${GOLD_PRIMARY}`,
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        color: TEXT_BLACK,
        marginBottom: '15px',
        fontSize: '20px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        Premium Price Breakdown
      </h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: TEXT_BLACK }}>
        <span>Original Price</span>
        <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>
          ₹{costDetails.fakeAmt}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#B8860B', fontWeight: 'bold' }}>
        <span>Exclusive Discount</span>
        <span>
          - ₹{costDetails.discount}
        </span>
      </div>

      <hr style={{ border: `0.5px solid ${GOLD_LIGHT}` }} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px'
      }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: TEXT_BLACK }}>Payable Amount</span>
        <span style={{ fontSize: '26px', fontWeight: 'bold', color: TEXT_BLACK }}>
          ₹{costDetails.userAmt}
        </span>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const DogStayBookingPage = () => {
  const { id } = useParams();
  const [stayData, setStayData] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch Stay Data
  useEffect(() => {
    if (!id) return;
    axios.get(`${BACKEND_BASE_URL}/api/admin/dogstay/${id}`)
      .then(res => setStayData(res.data))
      .catch(err => console.error("Error loading room", err));
  }, [id]);

  // Fetch Reviews Data
  useEffect(() => {
    if (!id) return;
    axios.get(`${BACKEND_BASE_URL}/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Error loading reviews", err));
  }, [id]);

  // Review Calculations
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const totalReviews = reviews.length;

  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '2025-11-10',
    checkOutDate: '2025-11-11',
    numDogs: 1,
    fullName: '',
    email: '',
    mobile: '',
    paymentMethod: 'Card',
  });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [days, setDays] = useState(1);
  const [passcodeSent, setPasscodeSent] = useState(false);

  useEffect(() => {
    const date1 = new Date(bookingDetails.checkInDate);
    const date2 = new Date(bookingDetails.checkOutDate);
    if (date1 && date2) {
      const diffDays = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
      setDays(Math.max(1, diffDays));
    }
  }, [bookingDetails.checkInDate, bookingDetails.checkOutDate]);

  const handleChange = (e) => setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });

  const buildPricingSnapshot = () => {
    if (!stayData) return null;
    const pricePerDay = Number(stayData.pricePerDay);
    const nights = days;
    return {
      pricingBreakup: {
        fakePricePerDay: Math.round(pricePerDay * 1.2),
        userPricePerDay: Math.round(pricePerDay * 0.9),
        websiteCommissionPerDay: Math.round(pricePerDay * 0.1),
        hostPricePerDay: Math.round(pricePerDay * 0.8),
      },
      totals: {
        nights,
        totalCommission: Math.round(pricePerDay * 0.1 * nights),
        totalHostEarning: Math.round(pricePerDay * 0.8 * nights),
      }
    };
  };

  const calculateTotalCost = () => {
    if (!stayData) {
      return { fakeAmt: 0, userAmt: 0, discount: 0, nights: days, finalPayable: 0 };
    }
    const pricePerDay = Number(stayData.pricePerDay || 0);
    const fakeAmtPerDay = pricePerDay + (pricePerDay * 0.20);
    const userAmtPerDay = pricePerDay - (pricePerDay * 0.10);
    const fakeAmt = Math.round(fakeAmtPerDay * days);
    const userAmt = Math.round(userAmtPerDay * days);
    const discount = Math.round(fakeAmt - userAmt);
    return { fakeAmt, userAmt, discount, finalPayable: userAmt, nights: days };
  };

  const costDetails = calculateTotalCost();

  const handleRazorpayPayment = async () => {
    if (!bookingDetails.fullName || !bookingDetails.email || !bookingDetails.mobile) {
      alert("⚠️ Please fill in all your contact details before payment.");
      return;
    }
    if (!passcodeSent) {
      alert("📱 Please verify your mobile number first.");
      return;
    }

    try {
      const orderRes = await axios.post(`${BACKEND_BASE_URL}/api/payment/create-order`, {
        amount: costDetails.finalPayable,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      const { id: order_id, currency } = orderRes.data.order;
      const userId = localStorage.getItem("userId");
      const listingId = stayData?._id;
      const hostId = stayData?.hostId;
      const { checkInDate, checkOutDate, numDogs, fullName, email, mobile } = bookingDetails;
      const pricingSnapshot = buildPricingSnapshot();

      const options = {
        key: "rzp_test_RhXTG9ZAbtd8Ra",
        amount: costDetails.finalPayable * 100,
        currency: currency,
        name: "Premium DogStay Booking",
        description: `Booking for ${stayData.roomName}`,
        order_id: order_id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            `${BACKEND_BASE_URL}/api/payment/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                userId, listingId, hostId, roomName: stayData?.roomName,
                checkInDate, checkOutDate, numDogs, fullName, email, mobile,
                pricePerDay: stayData?.pricePerDay,
                additionalPetCharge: stayData?.additionalPetCharge,
                couponDiscount: stayData?.couponDiscount,
                instantDiscount: stayData?.instantDiscount,
                taxRate: stayData?.taxRate,
                totalAmount: costDetails.finalPayable,
                ...pricingSnapshot,
              }
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
          );

          if (verifyRes.data.success) {
            setIsConfirmed(true);
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: { name: fullName, email, contact: mobile },
        theme: { color: GOLD_PRIMARY },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  const handleCashBooking = async () => {
    if (!bookingDetails.fullName || !bookingDetails.email || !bookingDetails.mobile) {
      alert("⚠️ Please fill in all your contact details before confirming the booking.");
      return;
    }
    if (!passcodeSent) {
      alert("📱 Please verify your mobile number first.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const listingId = stayData?._id;
      const hostId = stayData?.hostId;
      const { checkInDate, checkOutDate, numDogs, fullName, email, mobile } = bookingDetails;
      const pricingSnapshot = buildPricingSnapshot();

      const cashBookingRes = await axios.post(
        `${BACKEND_BASE_URL}/api/payment/cash-booking`,
        {
          bookingData: {
            userId, listingId, hostId, roomName: stayData?.roomName,
            checkInDate, checkOutDate, numDogs, fullName, email, mobile,
            pricePerDay: stayData?.pricePerDay,
            additionalPetCharge: stayData?.additionalPetCharge,
            couponDiscount: stayData?.couponDiscount,
            instantDiscount: stayData?.instantDiscount,
            taxRate: stayData?.taxRate,
            totalAmount: costDetails.finalPayable,
            ...pricingSnapshot
          }
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      if (cashBookingRes.data.success) {
        setIsConfirmed(true);
      } else {
        alert("Cash booking failed to save!");
      }
    } catch (err) {
      console.error("Cash Booking Error:", err);
      alert("Cash booking failed. Please try again.");
    }
  };

  if (isConfirmed) {
    return (
      <div style={{
        ...BOX_STYLE, padding: '50px 20px', textAlign: 'center', maxWidth: '600px',
        margin: '50px auto', backgroundColor: CARD_BG, borderRadius: '16px',
        boxShadow: `0 10px 30px rgba(212, 175, 55, 0.3)`, border: `3px solid ${GOLD_PRIMARY}`
      }}>
        <FaCheckCircle size={80} color={GOLD_PRIMARY} style={{ marginBottom: '20px' }} />
        <h1 style={{ color: TEXT_BLACK, fontSize: '36px' }}>Booking Confirmed!</h1>
        <p style={{ fontSize: '18px', color: TEXT_BLACK }}>
          Your dog's stay at <b>{stayData?.roomName}</b> is secured.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      ...BOX_STYLE, width: '100vw', overflowX: 'hidden',
      backgroundColor: GOLD_LIGHT, minHeight: '100vh',
      fontFamily: '"Georgia", serif', color: TEXT_BLACK
    }}>
      <div style={{ ...BOX_STYLE, padding: '40px 20px', margin: '0 auto', maxWidth: '1000px' }}>
        <h1 style={{
          color: TEXT_BLACK, fontSize: '36px', textAlign: 'center',
          marginBottom: '30px', borderBottom: `3px solid ${GOLD_PRIMARY}`,
          paddingBottom: '15px', fontWeight: 'bold'
        }}>
          Finalize Your Dog's Stay 🐾
        </h1>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '300px' }}>
            <StaySummaryCard 
                stayData={stayData} 
                costDetails={costDetails} 
                bookingDetails={bookingDetails} 
                averageRating={averageRating}
                totalReviews={totalReviews}
            />
            <DateAndDogSelector bookingDetails={bookingDetails} handleChange={handleChange} />
            <UserDetailsForm
              bookingDetails={bookingDetails}
              handleChange={handleChange}
              passcodeSent={passcodeSent}
              setPasscodeSent={setPasscodeSent}
            />
          </div>

          <div style={{ flex: 1, minWidth: '300px', position: 'sticky', top: '20px' }}>
            <PriceDetailsCard stayData={stayData} costDetails={costDetails} />
            
            <button
              onClick={handleRazorpayPayment}
              disabled={!bookingDetails.fullName || !bookingDetails.email || !bookingDetails.mobile || !passcodeSent}
              style={{
                ...BOX_STYLE, width: '100%', padding: '18px',
                backgroundColor: (!bookingDetails.fullName || !bookingDetails.email || !bookingDetails.mobile || !passcodeSent) ? '#ccc' : TEXT_BLACK,
                color: GOLD_PRIMARY, border: `1px solid ${GOLD_PRIMARY}`, borderRadius: '8px',
                fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              <FaLock style={{ marginRight: '10px' }} /> Pay ₹{costDetails.finalPayable} Now
            </button>

            <button
              onClick={handleCashBooking}
              style={{
                ...BOX_STYLE, width: "100%", padding: "15px",
                backgroundColor: GOLD_PRIMARY, color: TEXT_BLACK,
                border: "none", borderRadius: "8px", fontSize: "18px",
                fontWeight: "bold", cursor: "pointer", marginTop: "10px",
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              Reserve via Cash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogStayBookingPage;