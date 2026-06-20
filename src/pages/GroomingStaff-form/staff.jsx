import React, { useState, useCallback } from 'react';
import axios from "axios";
import "./staff.css";

// --- Constants ---
const GROOMING_SKILLS = [
    'Brushing & Deshedding',
    'Bathing',
    'Haircuts / Styling',
    'Nail Trimming (Clipper/Grinder)',
    'Ear Cleaning',
    'Eye Cleaning (Tear Stain Removal)',
    'Anal Gland Expression',
    'Cat Grooming',
    'Pet First Aid Certified',
];

// --- Custom Modal Component ---
const MessageModal = ({ show, title, message, isSuccess, onClose }) => {
    const iconClass = isSuccess ? 'modal-success-icon' : 'modal-error-icon';

    const SuccessIcon = () => (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
    );

    const ErrorIcon = () => (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.812-1.397 2.639-2.936l-1.383-10.379C18.667 3.974 16.012 3 12.923 3H11.077c-3.088 0-5.744.974-6.069 3.754l-1.383 10.379C2.47 18.603 3.742 20 5.286 20z" />
        </svg>
    );

    return (
        <div className={`modal-overlay ${show ? 'show' : ''}`}>
            <div className="modal-box">
                <div className="p-6 sm:p-8">
                    <div className="flex items-start">
                        <div className={`modal-icon-wrapper ${iconClass}`}>
                            {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="modal-title">{title}</h3>
                            <div className="mt-1">
                                <p className="modal-message">{message}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end border-t border-gray-100">
                    <button type="button" onClick={onClose} className="modal-button">Close</button>
                </div>
            </div>
        </div>
    );
};



// --- Main Application Component ---
const App = () => {
    // --- 1. State Management ---
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        permanentAddress: '',
        experience: '',
        placeAddress: '',
        coverLetter: '',
        idProof: null,
        location: { lat: null, lng: null }
    });
    
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isSuccess: false });
    
    // State for Distance Logic (as requested in snippet)
    const [distanceInfo, setDistanceInfo] = useState({
        km: 0,
        travelCharge: 0,
        finalAmount: 0
    });

    // --- 2. Handlers & Logic ---

    // Placeholder for the distance calculation logic you provided
    const handleOrderCreation = async (formPrice, selectedStaffId) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post(
                "http://localhost:5000/api/groomer/create-order",
                { servicePrice: formPrice, staffId: selectedStaffId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDistanceInfo({
                km: data.distanceKm,
                travelCharge: data.travelCharge,
                finalAmount: data.finalAmount
            });
        } catch (error) {
            console.error("Order Creation Error", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, idProof: e.target.files[0] }));
    };

    const handleSkillToggle = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleModalClose = () => setModal(prev => ({ ...prev, show: false }));
    
    const showMessage = (title, message, isSuccess) => {
        setModal({ show: true, title, message, isSuccess });
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            showMessage("Not Supported", "Geolocation is not supported by your browser", false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapLocationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

                setFormData(prev => ({
                    ...prev,
                    placeAddress: mapLocationUrl,
                    location: { lat: latitude, lng: longitude }
                }));
            },
            () => {
                showMessage("Permission Denied", "Please allow location access to use this feature.", false);
            }
        );
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);


            const userId = localStorage.getItem("userId");

            if (!userId) {
            showMessage(
                "Login Required",
                "Please login before submitting the application.",
                false
            );
            setIsLoading(false);
            return;
            }


        try {
            const formDataToSend = new FormData();
            formDataToSend.append("userId", userId); // ✅ REQUIRED
            formDataToSend.append("fullName", formData.fullName);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("alternatePhone", formData.alternatePhone);
            formDataToSend.append("permanentAddress", formData.permanentAddress); 
            formDataToSend.append("experience", formData.experience);
            formDataToSend.append("placeAddress", formData.placeAddress);
            formDataToSend.append("lat", formData.location.lat);
            formDataToSend.append("lng", formData.location.lng);
            formDataToSend.append("coverLetter", formData.coverLetter);
            formDataToSend.append("skills", JSON.stringify(selectedSkills));

            
            if (formData.idProof) {
                formDataToSend.append("idProof", formData.idProof);
            }

            const response = await fetch("http://localhost:5000/api/grooming-staff", {
                method: "POST",
                body: formDataToSend,
            });

            const result = await response.json();

            if (response.ok) {
                showMessage("Application Submitted!", "Your application has been saved to our database.", true);
                setFormData({ 
                    fullName: '', email: '', phone: '', alternatePhone: '', 
                    permanentAddress: '', experience: '', placeAddress: '', 
                    coverLetter: '', idProof: null, location: { lat: null, lng: null }
                });
                setSelectedSkills([]);
            } else {
                showMessage("Submission Failed", result.message || "Something went wrong.", false);
            }
        } catch (error) {
            console.error("Submission Error:", error);
            showMessage("Error", "Could not connect to the server.", false);
        } finally {
            setIsLoading(false);
        }
    }, [formData, selectedSkills]);

    // --- 3. Render ---
    return (
        <div className="app-container">
            <header>
                <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <h1 className="main-title">Grooming Specialist Application</h1>
                <p className="subtitle">Join our passionate team of animal lovers.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="form-group">
                    {/* Basic Info Fields */}
                    <div>
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" required value={formData.fullName} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label htmlFor="alternatePhone">Alternate Phone</label>
                        <input type="tel" id="alternatePhone" name="alternatePhone" required value={formData.alternatePhone} onChange={handleInputChange} />
                    </div>

                    <div className="full-address-box">
                        <label htmlFor="permanentAddress">Permanent Address</label>
                        <textarea
                            id="permanentAddress"
                            name="permanentAddress"
                            required
                            rows="3"
                            value={formData.permanentAddress}
                            onChange={handleInputChange}
                            placeholder="Enter your full permanent address"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #ccc' }}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="experience">Years of Professional Grooming Experience</label>
                        <select id="experience" name="experience" required value={formData.experience} onChange={handleInputChange}>
                            <option value="" disabled>Select experience level</option>
                            <option value="<1">Less than 1 year</option>
                            <option value="1-3">1 - 3 years</option>
                            <option value="4-7">4 - 7 years</option>
                            <option value="8+">8+ years</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="placeAddress">Place Address</label>
                        <input type="text" id="placeAddress" name="placeAddress" required value={formData.placeAddress} onChange={handleInputChange} placeholder="Enter your current place address" />
                        <button type="button" onClick={handleGetCurrentLocation} className="location-btn" style={{ marginTop: '10px', padding: '8px 12px', cursor: 'pointer', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}>
                            📍 Use Current Location
                        </button>
                    </div>

                    <div>
                        <label htmlFor="idProof">Upload ID Proof (Aadhar, Passport, etc.)</label>
                        <input type="file" id="idProof" name="idProof" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
                    </div>
                </div>

                {/* Skills Checklist */}
                <div>
                    <h2 className="section-title">Proficiency Checklist (Select all you are skilled at)</h2>
                    <div className="skills-wrapper">
                        {GROOMING_SKILLS.map(skill => {
                            const isSelected = selectedSkills.includes(skill);
                            return (
                                <label key={skill} className={`skill-label ${isSelected ? 'selected' : ''}`}>
                                    <input type="checkbox" name="skill" value={skill} checked={isSelected} onChange={() => handleSkillToggle(skill)} className="skill-checkbox" />
                                    <span>{skill}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Cover Letter */}
                <div>
                    <h2 className="section-title">Cover Letter</h2>
                    <textarea id="coverLetter" name="coverLetter" rows="5" required value={formData.coverLetter} onChange={handleInputChange} placeholder="Tell us why you are the perfect fit for our grooming team..."></textarea>
                </div>

                {/* Submit Section */}
                <div>
                    <button type="submit" disabled={isLoading} className="submit-button">
                        {isLoading ? (
                            <>
                                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : 'Submit Application'}
                    </button>
                </div>
            </form>

            <MessageModal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                isSuccess={modal.isSuccess}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default App;