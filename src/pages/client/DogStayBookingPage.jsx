import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaPaw, FaStar, FaUser, FaEnvelope, FaMobileAlt, FaCalendarAlt,
  FaLock, FaCheckCircle, FaDog
} from 'react-icons/fa';

// --- Premium Golden Color Palette ---
const GOLD_PRIMARY = '#D4AF37'; 
const GOLD_DARK = '#AA8439';    
const GOLD_LIGHT = '#F9F4E8';   
const TEXT_BLACK = '#000000';   
const CARD_BG = '#ffffff';
const BOX_STYLE = { boxSizing: 'border-box' };
const BACKEND_BASE_URL = 'https://cado-dog-grooming-backend.onrender.com';

// --- Helper Date Formatting Functions ---
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

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
            letterSpacing: '-0.5px', 
            textTransform: 'capitalize',
            fontFamily: '"Playfair Display", "Georgia", serif', 
            lineHeight: '1.2'
          }}>
            {stayData.roomName}
          </h3>
          
          <p style={{ 
            margin: '0 0 12px 0', 
            fontSize: '13px', 
            color: GOLD_DARK, 
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase', 
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '5px' }}>📍</span> {stayData.address}
          </p>

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

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ color: '#000000', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Check-In</label>
          <input 
            type="date" 
            name="checkInDate" 
            value={bookingDetails.checkInDate} 
            min={formatDate(today)}
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
            min={bookingDetails.checkInDate}
            onChange={handleChange}
            style={dateInputStyle} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ color: '#000000', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Number of Dogs</label>
        <input 
          type="number" 
          name="numDogs" 
          min="1" 
          max="10" 
          value={bookingDetails.numDogs} 
          onChange={handleChange}
          style={{ ...dateInputStyle, flex: 'none', width: '100px' }} 
        />
      </div>
    </div>
  );
};

const UserDetailsForm = ({
  bookingDetails,
  handleChange,
  passcodeSent,
  setPasscodeSent
}) => {
  const [otpRequested, setOtpRequested] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // 🛡️ FIX 1: Handle real server-side OTP generation dispatch
  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(bookingDetails.mobile)) {
      alert("⚠️ Please provide a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_BASE_URL}/api/otp/send`, { mobile: bookingDetails.mobile });
      setOtpRequested(true);
      alert("📱 Passcode sent to your phone number!");
    } catch (err) {
      console.error(err);
      alert("Failed to send verification passcode. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ FIX 1: Validate input token on backend before unlocking confirmation state
  const handleVerifyOtp = async () => {
    if (!inputOtp || inputOtp.length < 4) {
      alert("⚠️ Please enter the complete passcode.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_BASE_URL}/api/otp/verify`, {
        mobile: bookingDetails.mobile,
        otp: inputOtp
      });
      if (res.data.success) {
        setPasscodeSent(true);
      } else {
        alert("❌ Invalid passcode. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed. Please ensure the code is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: otpRequested && !passcodeSent ? '15px' : '0px' }}>
        <div style={{ flex: 1 }}>
          <BookingInput
            icon={FaMobileAlt}
            placeholder="Mobile Number"
            name="mobile"
            type="tel"
            value={bookingDetails.mobile}
            onChange={handleChange}
            readOnly={otpRequested || passcodeSent}
          />
        </div>

        <button
          type="button"
          onClick={handleSendOtp}
          disabled={!bookingDetails.mobile || bookingDetails.mobile.length < 10 || otpRequested || passcodeSent || loading}
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
          {passcodeSent ? <FaCheckCircle color="white" /> : loading && !otpRequested ? 'Sending...' : 'Send Passcode'}
        </button>
      </div>

      {/* Actual verification slot to mitigate client spoofing loops */}
      {otpRequested && !passcodeSent && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', animation: 'fadeIn 0.3s' }}>
          <div style={{ flex: 1 }}>
            <BookingInput
              icon={FaLock}
              placeholder="Enter Received Passcode"
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
              type="text"
            />
          </div>
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: GOLD_PRIMARY,
              color: TEXT_BLACK,
              border: `1px solid ${GOLD_DARK}`,
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      )}
    </div>
  );
};

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

      {/* 🛡️ Typo Fix: justifycontent corrected to standard camelCase rule style object */}
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

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const totalReviews = reviews.length;

  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: formatDate(today),
    checkOutDate: formatDate(tomorrow),
    numDogs: 1,
    fullName: "",
    email: "",
    mobile: "",
    paymentMethod: "Card",
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
      const { checkInDate, checkOutDate, numDogs, fullName, email, mobile } = bookingDetails;
      const listingId = stayData?._id;

      const orderRes = await axios.post(`${BACKEND_BASE_URL}/api/payment/create-order`, {
        listingId,
        checkInDate,
        checkOutDate,
        numDogs,
        fullName,
        email,
        mobile
      });
      
      const { id: order_id, currency, amount: verifiedOrderAmount } = orderRes.data.order;

      const options = {
        // 🛡️ FIX 7: Shift environment variables directly securely configuration maps
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RhXTG9ZAbtd8Ra",
        amount: verifiedOrderAmount, 
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
                listingId, 
                checkInDate, 
                checkOutDate, 
                numDogs, 
                fullName, 
                email, 
                mobile
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
      const listingId = stayData?._id;
      const { checkInDate, checkOutDate, numDogs, fullName, email, mobile } = bookingDetails;

      const cashBookingRes = await axios.post(
        `${BACKEND_BASE_URL}/api/payment/cash-booking`,
        {
          bookingData: {
            listingId, 
            checkInDate, 
            checkOutDate, 
            numDogs, 
            fullName, 
            email, 
            mobile
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