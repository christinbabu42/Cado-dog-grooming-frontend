import React, { useState, useEffect, useCallback } from "react";
// 🔑 CHANGED: Switched vanilla axios to your custom instance
import axios from "../../utils/axios"; 
import { FaMapMarkerAlt, FaEdit, FaCheckCircle, FaSatellite, FaPaw, FaUser, FaCat, FaDog } from 'react-icons/fa';
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2'; // Beautiful Alert Library
import "./GroomerBookingPage.css";

const GroomerBookingPage = () => {
    const location = useLocation();

    // STATE MANAGEMENT
    const [selectedStaffID, setSelectedStaffID] = useState(null);
    const [staffInfo, setStaffInfo] = useState(null);
    const [isEditAddress, setIsEditAddress] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingLocation, setSavingLocation] = useState(false);
    
    // PET SETTINGS
    const [petType, setPetType] = useState("Dog");
    const [petCount, setPetCount] = useState(1);

    const [localGroomer, setLocalGroomer] = useState(null);

    const [form, setForm] = useState({
      service: "",
      dogSize: "", 
      petName: "",
      breed: "",
      name: "",
      phone: "",
      address: "",
      city: "",
      price: 0,
      lat: null,
      lng: null
    });

    const [distanceInfo, setDistanceInfo] = useState({
      km: 0,
      travelCharge: 0,
      finalAmount: 0
    });

    const services = [
      { name: "Basic Bath", prices: { "Medium (<10kg)": 600, "Large (10-25kg)": 800, "Maximum (>25kg)": 1000 }, includes: "Shampoo, Conditioning, Drying, Perfume" },
      { name: "Basic Grooming", prices: { "Medium (<10kg)": 1200, "Large (10-25kg)": 1600, "Maximum (>25kg)": 1800 }, includes: "Bath items + Nail Clipping, Eye Cleaning, Oral Hygiene" },
      { name: "Advanced Grooming", prices: { "Medium (<10kg)": 1600, "Large (10-25kg)": 2000, "Maximum (>25kg)": 2200 }, includes: "Full Grooming + Oil Massage, Hair Cut, Styling, Paw Massage, Serum" },
    ];

    const dogSizes = ["Medium (<10kg)", "Large (10-25kg)", "Maximum (>25kg)"];

    // RESET FUNCTION
    const resetForm = () => {
      setPetType("Dog");
      setPetCount(1);
      setForm(prev => ({
        ...prev,
        service: "",
        dogSize: "",
        petName: "",
        breed: "",
        price: 0
      }));
      setDistanceInfo({
        km: 0,
        travelCharge: 0,
        finalAmount: 0
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // BEAUTIFUL PREMIUM GOLD ALERT HELPER
    const showAlert = (title, text, icon = 'success') => {
      Swal.fire({
        title,
        text,
        icon,
        background: '#1a1a1a',        // dark premium background
        color: '#FFD700',              // golden text
        iconColor: icon === 'success' ? '#FFD700' : (icon === 'warning' ? '#FFA500' : '#ef4444'),
        confirmButtonColor: '#FFD700', // gold button
        confirmButtonText: 'Great!',
        customClass: {
          popup: 'premium-swal-popup',
          title: 'premium-swal-title',
          content: 'premium-swal-content',
          confirmButton: 'premium-swal-btn'
        }
      });
    };

    // DATA FETCHING
    const fetchStaff = async (id) => {
      try { 
        const { data } = await axios.get(`/api/groomer/${id}`); 
        if (data.success) setStaffInfo(data.staff); 
      } 
      catch (err) { console.error("Failed to fetch staff info:", err); }
    };

    const fetchUserProfile = async () => {
      try {
        // Axios interceptor automatically passes global headers now
        const { data } = await axios.get("/api/user/me");
        if (data) {
          setForm(prev => ({
            ...prev,
            name: data.name || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.location?.address || "",
            lat: data.location?.lat || null,
            lng: data.location?.lng || null
          }));
          setIsEditAddress(!data.address);
        }
      } catch (err) { console.error("Error fetching profile:", err); setIsEditAddress(true); }
      finally { setLoadingProfile(false); }
    };

    const calculateTravel = useCallback(async () => {
      if (!form.price || !form.lat || !form.lng || !selectedStaffID) return;
      try {
        const totalServicePrice = form.price * petCount;
        
        const { data } = await axios.post(
          "/api/groomer/calculate-travel",
          { staffID: selectedStaffID, servicePrice: totalServicePrice, userLat: form.lat, userLng: form.lng }
        );
        setDistanceInfo({ km: data.distanceKm, travelCharge: data.travelCharge, finalAmount: data.finalAmount });
      } catch (err) { console.error("Travel calculation failed:", err); }
    }, [form.price, form.lat, form.lng, selectedStaffID, petCount]);

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      fetchUserProfile();

      const groomer = JSON.parse(localStorage.getItem("selectedGroomer"));
      if (groomer) {
        setLocalGroomer(groomer);
        const idToSet = groomer.staffID || groomer._id;
        if (idToSet) setSelectedStaffID(idToSet);
      }
    }, []);

    useEffect(() => { if (selectedStaffID) fetchStaff(selectedStaffID); }, [selectedStaffID]);
    
    useEffect(() => { calculateTravel(); }, [calculateTravel]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const updatePrice = (serviceName, size) => {
      const selectedService = services.find(s => s.name === serviceName);
      
      setForm(prev => ({
        ...prev,
        service: serviceName,
        dogSize: size,
        price: (selectedService && size) ? selectedService.prices[size] : 0
      }));
    };

    const handleGetGPS = () => {
      if (!navigator.geolocation) return showAlert("Error", "Geolocation not supported", "error");
      navigator.geolocation.getCurrentPosition((pos) => {
        setForm(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude, city: "GPS Captured" }));
        showAlert("📍 Location Captured", "Your coordinates have been updated successfully.");
      });
    };

    const saveAddressToBackend = async () => {
      setSavingLocation(true);
      try {
        await axios.put("/api/user/location", { address: form.address, lat: form.lat, lng: form.lng });
        showAlert("Address Saved", "Your service location is now locked in. ✅");
        setIsEditAddress(false);
        calculateTravel();
      } catch (err) { showAlert("Error", "Failed to save address.", "error"); } finally { setSavingLocation(false); }
    };

    const validateForm = () => {
      if (!form.service) { showAlert("Missing Info", "Please select a service package.", "info"); return false; }
      if (!form.dogSize) { showAlert("Missing Info", "Please select your pet's size.", "info"); return false; }
      if (!form.petName) { showAlert("Missing Info", "What is your pet's name?", "info"); return false; }
      if (!form.breed) { showAlert("Missing Info", "Please specify the pet breed.", "info"); return false; }
      if (!form.name) { showAlert("Missing Info", "Please enter your name.", "info"); return false; }
      if (!form.phone) { showAlert("Missing Info", "Please enter your contact number.", "info"); return false; }
      if (!form.address || !form.lat || !form.lng) { showAlert("Location Required", "Please provide an address and lock your GPS location.", "warning"); return false; }
      if (!distanceInfo.finalAmount || distanceInfo.finalAmount <= 0) { showAlert("Wait a moment", "We are still calculating travel charges...", "info"); return false; }
      return true;
    };

    const getBookingPayload = () => {
      return {
        ...form,
        ...distanceInfo,
        petType,
        petCount,
        staffId: localGroomer?._id || selectedStaffID,
        staffName: localGroomer?.fullName || staffInfo?.name,
        staffPhone: localGroomer?.phone || "",
        staffLocation: localGroomer?.location || staffInfo?.location,
        userLocation: { lat: form.lat, lng: form.lng }
      };
    };

    const openRazorpay = async () => {
      if (!validateForm()) return; 

      try {
        const { data } = await axios.post(
          "/api/groomer/create-order",
          { finalAmount: distanceInfo.finalAmount }
        );

        const options = {
          key: "rzp_test_RhXTG9ZAbtd8Ra",
          amount: data.order.amount,
          currency: "INR",
          name: "Pet Grooming",
          order_id: data.order.id,
          handler: async function (res) {
            try {
              await axios.post(
                "/api/groomer/verify-payment",
                { 
                  razorpay_payment_id: res.razorpay_payment_id, 
                  razorpay_order_id: res.razorpay_order_id, 
                  razorpay_signature: res.razorpay_signature, 
                  form: getBookingPayload() 
                }
              );
              showAlert("Booking Confirmed!", "Payment successful! Your groomer is notified. ✅");
              resetForm();
            } catch (err) {
              showAlert("Booking Error", "Payment was received, but we couldn't create the booking. Contact support.", "error");
            }
          },
          prefill: { name: form.name, contact: form.phone },
          theme: { color: "#4f46e5" }
        };

        new window.Razorpay(options).open();
      } catch (error) {
        showAlert("Error", "Could not initiate payment. Please try again.", "error");
      }
    };

    const handleCashPayment = async () => {
      if (!validateForm()) return; 
      try {
        await axios.post("/api/groomer/cash-payment", getBookingPayload());
        showAlert("Booking Successful!", `Order placed for ₹${distanceInfo.finalAmount}. Please pay the groomer in cash.`);
        resetForm();
      } catch (err) { showAlert("Error", "Cash booking failed. Please try online payment.", "error"); }
    };

    const handleSubmit = (e) => { 
        e.preventDefault(); 
        openRazorpay(); 
    };

    if (loadingProfile) return <div className="loading-screen">Preparing your grooming session...</div>;

    const getMapUrl = (lat, lng, address) => {
      const query = lat && lng ? `${lat},${lng}` : encodeURIComponent(address || 'India');
      return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    };

    return (
      <div className="full-width-container">
        <div className="booking-header">
          <h1>Complete Your Booking</h1>
          <p>Expert grooming for {form.petName || 'your pet'} with {localGroomer?.fullName || staffInfo?.name || 'our top professional'}</p>
        </div>

        <div className="booking-main-content">
          <form onSubmit={handleSubmit} className="booking-form-side">

            {/* PET SELECTION TOP BAR */}
            <div className="pet-selector-bar">
               <div className="selector-group">
                  <span className="selector-label">I have a:</span>
                  <div className="type-toggle">
                    <button type="button" className={petType === "Dog" ? "active dog" : ""} onClick={() => setPetType("Dog")}><FaDog /> Dog</button>
                    <button type="button" className={petType === "Cat" ? "active cat" : ""} onClick={() => setPetType("Cat")}><FaCat /> Cat</button>
                  </div>
               </div>
               <div className="selector-group">
                  <span className="selector-label">Total {petType}s:</span>
                  <div className="count-toggle">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button type="button" key={num} className={petCount === num ? "active" : ""} onClick={() => setPetCount(num)}>{num}</button>
                    ))}
                  </div>
               </div>
            </div>

            <section className="form-card">
              <div className="section-header"><FaPaw className="section-icon" /><h3>Service Selection</h3></div>
              
              <label className="field-label">1. Choose {petType} Size</label>
              <div className="size-grid">{dogSizes.map(size => (
                <div key={size} className={`size-option ${form.dogSize === size ? 'active' : ''}`} onClick={() => updatePrice(form.service, size)}>
                  <FaPaw />
                  <span className="size-name">{size.split(' ')[0]}</span>
                  <span className="size-weight">{size.match(/\(([^)]+)\)/)?.[0]}</span>
                </div>
              ))}</div>

              <label className="field-label">2. Select Package</label>
              <div className="service-vertical-list">{services.map(service => (
                <div key={service.name} onClick={() => updatePrice(service.name, form.dogSize)} className={`premium-service-card ${form.service === service.name ? "selected" : ""}`}>
                  <div className="service-top">
                    <span className="service-title">{service.name}</span>
                    {form.dogSize && <span className="service-tag">₹{service.prices[form.dogSize]}</span>}
                  </div>
                  <p className="service-desc">{service.includes}</p>
                </div>
              ))}</div>
            </section>

            <section className="form-card">
              <div className="section-header"><FaUser className="section-icon" /><h3>Pet & Contact Info</h3></div>
              <div className="form-row">
                <div className="form-group"><label>{petType}'s Name</label><input type="text" name="petName" value={form.petName} placeholder="Mia" onChange={handleChange} required /></div>
                <div className="form-group"><label>Breed Description</label><input type="text" name="breed" value={form.breed} placeholder="e.g. Golden Retriever" onChange={handleChange} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Your Name</label><input type="text" name="name" value={form.name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={form.phone} onChange={handleChange} required /></div>
              </div>
            </section>

            <section className="form-card">
              <div className="section-header"><FaMapMarkerAlt className="section-icon" /><h3>Service Location</h3></div>
              <button type="button" className="btn-link" onClick={() => setIsEditAddress(true)}>Change Address</button>

              {!isEditAddress ? (
                <div className="address-display-box">
                  <p><strong>Current Address:</strong> {form.address}</p>
                  <div className="map-holder mini-map">
                    <iframe title="Current Map" src={getMapUrl(form.lat, form.lng, form.address)} />
                  </div>
                </div>
              ) : (
                <div className="address-edit-mode">
                  <input type="text" name="address" value={form.address} placeholder="House/Flat No, Area" onChange={handleChange} required />
                  <div className="map-holder">
                    <iframe title="Map Editor" src={getMapUrl(form.lat, form.lng, form.address)} />
                  </div>
                  <div className="address-actions">
                    <button type="button" onClick={handleGetGPS} className="btn-secondary">Use GPS</button>
                    <button type="button" onClick={saveAddressToBackend} className="btn-primary-sm">
                      {savingLocation ? "Saving..." : "Lock Location"}
                    </button>
                  </div>      
                </div>
              )}
            </section>
          </form>

          <aside className="summary-sidebar">
            <div className="summary-sticky-card">
              <div style={{marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px'}}>
                <p style={{fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 5px 0'}}>Selected Expert</p>
                <p style={{margin: 0, fontWeight: 700, color: '#FFD700'}}>{localGroomer?.fullName}</p> 
                <p style={{fontSize: '0.7rem', color: '#64748b', margin: '3px 0'}}>ID: {localGroomer?._id}</p>
                <p style={{fontSize: '0.75rem', color: '#94a3b8', margin: '5px 0 0 0'}}>Base: {localGroomer?.placeAddress}</p>
              </div>

              <h3 style={{color: '#FFD700'}}>Booking Summary</h3>
              <div className="summary-item"><span>Service</span><span style={{color: '#FFD700'}}>{form.service || "Not selected"}</span></div>
              <div className="summary-item"><span>{petType} Count</span><span>x {petCount}</span></div>
              <div className="summary-item"><span>Base Price</span><span style={{color: '#FFD700'}}>₹{form.price * petCount}</span></div>
              <div className="summary-item travel"><span>Travel ({distanceInfo.km}km)</span><span>+ ₹{distanceInfo.travelCharge}</span></div>
              <div className="total-divider"></div>
              <div className="summary-item total"><span>Grand Total</span><span style={{color: '#FFD700', fontWeight: 700}}>₹{distanceInfo.finalAmount}</span></div>

              <div className="payment-actions">
                <button type="submit" onClick={handleSubmit} className="pay-online-premium">
                  Confirm & Pay Online
                </button>
                <button type="button" onClick={handleCashPayment} className="pay-cash-premium">
                  Book Now, Pay Cash
                </button>
              </div>

              <div className="trust-badges">
                <span><FaCheckCircle /> Professional Groomers</span>
                <span><FaCheckCircle /> Safe & Hygienic</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
};

export default GroomerBookingPage;