import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaPaw, FaCamera, FaUser, FaMapMarkerAlt, FaDollarSign, 
    FaCheckSquare, FaWeight, FaClock, FaBook, FaUpload, 
    FaVideo, FaDog 
} from 'react-icons/fa';
import './DogStayListingForm.css'; // ⬅️ NEW: Import the CSS file

const initialFormState = {
    roomName: '', shortDescription: '', photos: [], video: null, 
    ownerFullName: '', contactNumber: '', emailAddress: '', idProof: null, 
    fullAddress: '', pinCode: '', googleMapsLink: '',
      // ✅ NEW
  latitude: '',
  longitude: '',
    pricePerDay: '', additionalPetCharge: '', availableFrom: '', availableTo: '', minimumStay: '', refundPolicy: 'Flexible', 
    amenities: [], foodProvided: 'No', groomingService: 'No', playArea: 'No', vetOnCall: 'No', stayType: 'Indoor', 
    allowedSizes: [], weightLimit: '', breedRestrictions: '', vaccinationRequired: 'Yes', 
    checkInTime: '09:00', checkOutTime: '18:00', rulesGuidelines: '',
    termsConfirmed: false,
};

const AMENITIES_OPTIONS = ['Food', 'Toys', 'Grooming', 'Air-conditioned', 'CCTV', 'Fenced Area', 'Heating', 'Daily Walks'];
const SIZES_OPTIONS = ['Small (0-10 kg)', 'Medium (10-25 kg)', 'Large (25+ kg)'];
const REFUND_POLICIES = ['Flexible', 'Moderate', 'Strict'];

const API_URL = 'https://cado-dog-grooming-backend.onrender.com/api/admin/dogstay';

// --- Sub-components (Refactored to use Classes) ---

const FormInput = ({ label, type = 'text', name, value, onChange, required = false, icon: Icon, placeholder = '' }) => (
    <div className="input-group">
        <label className="label-text">
            {label} {required && <span style={{ color: '#ff385c' }}>*</span>}
        </label>
        <div className="input-wrapper">
            {Icon && <Icon size={18} className="field-icon" />}
            <input
                className="custom-input"
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder || label}
            />
        </div>
    </div>
);

const FormTextarea = ({ label, name, value, onChange, required = false, rows = 3 }) => (
    <div className="input-group">
        <label className="label-text">
            {label} {required && <span style={{ color: '#ff385c' }}>*</span>}
        </label>
        <textarea
            className="custom-textarea"
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            rows={rows}
        />
    </div>
);

const FileUpload = ({ label, name, onChange, multiple = false, icon: Icon, filesCount = 0 }) => (
    <div className="input-group">
        <label className="label-text">{label}</label>
        <div className="upload-box" onClick={() => document.getElementById(`file-upload-${name}`).click()}>
            <Icon size={30} color="#ff385c" style={{ marginBottom: '10px' }} />
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
                {filesCount > 0 ? `${filesCount} File${filesCount > 1 ? 's' : ''} Uploaded` : (multiple ? 'Upload Photos' : 'Upload File')}
            </p>
            <p style={{ margin: '5px 0 0', opacity: 0.6, fontSize: '12px' }}>
                {multiple ? '(Max 5 recommended)' : '(PDF, JPG, or Video)'}
            </p>
            <input
                type="file"
                id={`file-upload-${name}`}
                name={name}
                onChange={onChange} 
                multiple={multiple}
                style={{ display: 'none' }}
                accept={multiple ? 'image/*' : 'image/*,application/pdf,video/*'} 
            />
        </div>
    </div>
);

const FormSection = ({ title, icon: Icon, children }) => (
    <div className="form-section">
        <h2 className="section-title">
            <Icon size={24} style={{ marginRight: '12px' }} />
            {title}
        </h2>
        {children}
    </div>
);

const DogStayListingForm = () => {
    useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setFormData(prev => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    },
    (error) => {
      console.warn('Location permission denied');
    }
  );
}, []);

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateCurrentLocation = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            setFormData(prev => ({
                ...prev,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }));
        },
        () => {
            alert("Unable to fetch location. Please allow location access.");
        }
    );
};


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files, multiple } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: multiple ? Array.from(files).slice(0, 5) : files[0] || null,
        }));
    };

    const handleCheckboxGroupChange = (e, fieldName) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentArray = prev[fieldName];
            return {
                ...prev,
                [fieldName]: checked
                    ? [...currentArray, value]
                    : currentArray.filter(item => item !== value),
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formPayload = new FormData();

        for (const key in formData) {
            const value = formData[key];
            if (key === 'photos' || key === 'video' || key === 'idProof') continue;

            if (Array.isArray(value)) {
                formPayload.append(key, JSON.stringify(value));
            } else {
                formPayload.append(key, value);
            }
        }

        formPayload.append(
  'location',
  JSON.stringify({
    type: 'Point',
    coordinates: [
      Number(formData.longitude),
      Number(formData.latitude),
    ],
  })
);




        formData.photos.forEach((file) => formPayload.append('photos', file, file.name));
        if (formData.video) formPayload.append('video', formData.video, formData.video.name);
        if (formData.idProof) formPayload.append('idProof', formData.idProof, formData.idProof.name);
        
        try {
            const hostId = localStorage.getItem("userId");
            formPayload.append("hostId", hostId);
            const response = await axios.post(API_URL, formPayload);
            alert('🎉 Listing successfully submitted for review!');
            setFormData(initialFormState);
        } catch (error) {
            console.error(error);
            alert('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dogstay-container">
            <div className="form-wrapper">
                <div className="header-section">
                    <h1 className="header-title">
                        <FaDog color="#ff385c" style={{marginRight: '15px'}} />
                        Become a Host
                    </h1>
                    <p className="header-subtitle">Showcase your space to dog parents in need.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <FormSection title="1. Basic Information" icon={FaBook}>
                        <FormInput label="Room / Stay Name" name="roomName" value={formData.roomName} onChange={handleInputChange} required icon={FaPaw} />
                        <FormTextarea label="Short Description" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} required rows={2} />
                        <div className="responsive-grid">
                            <FileUpload label="Listing Photos" name="photos" onChange={handleFileChange} multiple icon={FaCamera} filesCount={formData.photos.length} />
                            <FileUpload label="Video Tour" name="video" onChange={handleFileChange} icon={FaVideo} filesCount={formData.video ? 1 : 0} />
                        </div>
                    </FormSection>

                    <FormSection title="2. Owner Details" icon={FaUser}>
                        <div className="responsive-grid">
                            <FormInput label="Full Name" name="ownerFullName" value={formData.ownerFullName} onChange={handleInputChange} required icon={FaUser} />
                            <FormInput label="Contact Number" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleInputChange} required icon={FaClock} />
                            <FileUpload label="ID Proof" name="idProof" onChange={handleFileChange} icon={FaUpload} filesCount={formData.idProof ? 1 : 0} />
                        </div>
                    </FormSection>

                    <FormSection title="3. Location" icon={FaMapMarkerAlt}>
                        <FormTextarea label="Full Address" name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required rows={2} />
                        <div className="responsive-grid">
                            <FormInput label="Pin Code" name="pinCode" type="number" value={formData.pinCode} onChange={handleInputChange} required icon={FaMapMarkerAlt} />
                            <FormInput label="Google Maps Link" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} icon={FaMapMarkerAlt} />
                        </div>
                    </FormSection>

<div className="responsive-grid">
  <FormInput
    label="Latitude"
    name="latitude"
    value={formData.latitude}
    onChange={handleInputChange}
    icon={FaMapMarkerAlt}
  />
  <FormInput
    label="Longitude"
    name="longitude"
    value={formData.longitude}
    onChange={handleInputChange}
    icon={FaMapMarkerAlt}
  />
</div>

{/* ✅ MAP PREVIEW (CORRECT PLACE) */}
{formData.latitude && formData.longitude && (
  <div className="map-preview-box">
    <iframe
      title="Map Preview"
      src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
      width="100%"
      height="180"
      style={{ border: 0, borderRadius: '12px' }}
      loading="lazy"
      allowFullScreen
    />

    <button
      type="button"
      className="update-location-btn"
      onClick={updateCurrentLocation}
    >
      📍 Update Current Location
    </button>
  </div>
)}


                    <FormSection title="4. Pricing & Policy" icon={FaDollarSign}>
                        <div className="responsive-grid">
                            <FormInput label="Price per Day (₹)" name="pricePerDay" type="number" value={formData.pricePerDay} onChange={handleInputChange} required icon={FaDollarSign} />
                            <FormInput label="Available From" name="availableFrom" type="date" value={formData.availableFrom} onChange={handleInputChange} required />
                            <div>
                                <label className="label-text">Refund Policy *</label>
                                <div className="input-wrapper">
                                    <select name="refundPolicy" value={formData.refundPolicy} onChange={handleInputChange} className="custom-select">
                                        {REFUND_POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </FormSection>
                    
                    <FormSection title="5. Facilities" icon={FaCheckSquare}>
                        <label className="label-text">Amenities (Select all that apply)</label>
                        <div className="responsive-grid" style={{marginBottom: '20px'}}>
                            {AMENITIES_OPTIONS.map(amenity => (
                                <label key={amenity} className="checkbox-item">
                                    <input type="checkbox" value={amenity} checked={formData.amenities.includes(amenity)} onChange={(e) => handleCheckboxGroupChange(e, 'amenities')} style={{marginRight: '10px'}} />
                                    {amenity}
                                </label>
                            ))}
                        </div>
                        <div className="responsive-grid">
                            {[
                                { label: 'Food Provided', name: 'foodProvided' },
                                { label: 'Vet On Call', name: 'vetOnCall' }
                            ].map(field => (
                                <div key={field.name}>
                                    <label className="label-text">{field.label}</label>
                                    <div className="radio-group">
                                        {['Yes', 'No'].map(opt => (
                                            <label key={opt}><input type="radio" name={field.name} value={opt} checked={formData[field.name] === opt} onChange={handleInputChange} /> {opt}</label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FormSection>

                    <FormSection title="6. Restrictions" icon={FaWeight}>
                        <label className="label-text">Allowed Dog Sizes</label>
                        <div className="responsive-grid" style={{marginBottom: '20px'}}>
                            {SIZES_OPTIONS.map(size => (
                                <label key={size} className="checkbox-item">
                                    <input type="checkbox" value={size} checked={formData.allowedSizes.includes(size)} onChange={(e) => handleCheckboxGroupChange(e, 'allowedSizes')} style={{marginRight: '10px'}} />
                                    {size}
                                </label>
                            ))}
                        </div>
                        <div className="responsive-grid">
                            <FormInput label="Breed Restrictions" name="breedRestrictions" value={formData.breedRestrictions} onChange={handleInputChange} />
                            <FormInput label="Max Weight (kg)" name="weightLimit" type="number" value={formData.weightLimit} onChange={handleInputChange} icon={FaWeight} />
                        </div>
                    </FormSection>

                    <FormSection title="7. Rules & Timings" icon={FaClock}>
                        <div className="responsive-grid">
                            <FormInput label="Check-in" name="checkInTime" type="time" value={formData.checkInTime} onChange={handleInputChange} required />
                            <FormInput label="Check-out" name="checkOutTime" type="time" value={formData.checkOutTime} onChange={handleInputChange} required />
                        </div>
                        <FormTextarea label="House Rules" name="rulesGuidelines" value={formData.rulesGuidelines} onChange={handleInputChange} required />
                    </FormSection>

                    <div className="terms-box">
                        <input type="checkbox" name="termsConfirmed" checked={formData.termsConfirmed} onChange={handleInputChange} required id="terms" />
                        <label htmlFor="terms" style={{fontWeight: '600', cursor: 'pointer'}}>I agree to the Host Terms & Conditions.</label>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isSubmitting || !formData.termsConfirmed}
                        style={{ backgroundColor: (isSubmitting || !formData.termsConfirmed) ? '#ccc' : '#ff385c' }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Listing for Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DogStayListingForm;