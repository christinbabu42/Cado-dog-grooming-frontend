import React, { useState, useEffect } from 'react';
import { 
    FaEnvelope, FaPhone, FaWhatsapp, FaHeadset, 
    FaQuestionCircle, FaChevronDown, FaChevronUp, 
    FaDog, FaCat, FaCut, FaHome 
} from 'react-icons/fa';

// OYO-inspired color palette
const OYO_PRIMARY = '#ff385c'; // Vibrant Red
const OYO_SECONDARY = '#007bff'; // Blue for 'Book Now'
const OYO_ACCENT_TEXT = '#484848'; // Dark Gray for titles
const OYO_BG_LIGHT = '#f7f7f7'; // Light Gray Background
const OYO_RATING_GREEN = '#28a745'; // Green for success
const OYO_LIGHT_BLUE = '#eaf5ff'; // Light Blue

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

// --- FAQ Item Component ---
const FAQItem = ({ question, answer, isMobile }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const itemStyle = {
        marginBottom: '15px',
        border: `1px solid ${OYO_BG_LIGHT}`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: isOpen ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
        transition: 'all 0.3s ease',
    };

    const headerStyle = {
        padding: isMobile ? '12px 15px' : '15px 20px',
        backgroundColor: isOpen ? OYO_LIGHT_BLUE : 'white',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        color: OYO_ACCENT_TEXT,
        fontSize: isMobile ? '14px' : '16px',
        userSelect: 'none',
    };

    const answerStyle = {
        padding: isMobile ? '15px' : '20px',
        backgroundColor: '#fff',
        borderTop: isOpen ? `1px solid ${OYO_BG_LIGHT}` : 'none',
        color: '#6c757d',
        fontSize: isMobile ? '13px' : '14px',
        maxHeight: isOpen ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s ease-in-out, padding 0.4s ease-in-out',
    };

    return (
        <div style={itemStyle}>
            <div style={headerStyle} onClick={() => setIsOpen(!isOpen)}>
                {question}
                {isOpen ? <FaChevronUp size={12} color={OYO_SECONDARY} /> : <FaChevronDown size={12} color={OYO_ACCENT_TEXT} />}
            </div>
            <div style={answerStyle}>
                {answer}
            </div>
        </div>
    );
};

// --- Contact Form Component ---
const ContactForm = ({ isMobile }) => {
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formState);
        setIsSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        boxSizing: 'border-box',
        fontSize: '14px',
    };

    const buttonStyle = {
        width: '100%',
        padding: '15px',
        backgroundColor: OYO_PRIMARY,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        boxShadow: '0 4px 6px rgba(255, 56, 92, 0.3)',
    };

    return (
        <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: OYO_PRIMARY, fontSize: '24px', marginBottom: '10px' }}>Quick Inquiry</h3>
            <p style={{ color: '#6c757d', marginBottom: '25px', fontSize: '14px' }}>Ask us about customized pet stay packages or grooming appointments.</p>
            
            {isSubmitted && (
                <div style={{ padding: '15px', backgroundColor: OYO_RATING_GREEN, color: 'white', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
                    Message sent! Cado's team will contact you soon.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Your Name" value={formState.name} onChange={handleChange} required style={inputStyle} />
                <input type="email" name="email" placeholder="Your Email" value={formState.email} onChange={handleChange} required style={inputStyle} />
                <select name="subject" value={formState.subject} onChange={handleChange} required style={inputStyle}>
                    <option value="">Select Service Interest</option>
                    <option value="Dog Stay">Dog Stay / Boarding</option>
                    <option value="Cat Stay">Cat Stay / Boarding</option>
                    <option value="Grooming">Professional Grooming</option>
                    <option value="Other">General Query</option>
                </select>
                <textarea name="message" placeholder="Tell us about your pet's needs..." value={formState.message} onChange={handleChange} required rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                <button type="submit" style={buttonStyle}>Submit Inquiry</button>
            </form>
        </div>
    );
};

const ContactUsPage = () => {
    const { isMobile } = useWindowWidth();

    const mainContainerStyle = {
        fontFamily: 'Inter, sans-serif',
        backgroundColor: OYO_BG_LIGHT,
        minHeight: '100vh',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '20px 0' : '50px 0',
        boxSizing: 'border-box',
    };

    const serviceCardStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        flex: 1,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        borderTop: `4px solid ${OYO_PRIMARY}`
    };

    const faqData = [
        { q: "What is included in a Dog Stay?", a: "Our dog stays include temperature-controlled rooms, 3 nutritional meals daily, 2 walking sessions, and supervised socialization. We also provide 24/7 CCTV monitoring for your peace of mind." },
        { q: "Do you offer separate areas for Cats?", a: "Absolutely. We have a dedicated 'Cats-Only' wing to ensure a stress-free environment away from dogs. This includes vertical climbing spaces and individual cat condos." },
        { q: "What grooming services do you provide?", a: "We offer Full Grooming (Bath, haircut, nail clipping, ear cleaning) and Basic Spa (Bath & Brush). We use breed-specific shampoos for both cats and dogs." },
        { q: "Are vaccinations mandatory?", a: "Yes. For the safety of all pets, we require up-to-date vaccination records (DHPP/L and Rabies for dogs; FVRCP for cats) prior to check-in." },
        { q: "How do I book a grooming session?", a: "You can book via the website or simply WhatsApp Cado at +91 8592041280 for an immediate slot confirmation." },
    ];

    return (
        <div style={mainContainerStyle}>
            <div style={{ padding: isMobile ? '0 15px' : '0 60px' }}>

                {/* Header Section */}
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <FaHeadset size={40} color={OYO_PRIMARY} style={{ marginBottom: '10px' }} />
                    <h1 style={{ color: OYO_ACCENT_TEXT, fontSize: isMobile ? '32px' : '48px', margin: '0 0 10px 0' }}>Contact PetCare Support</h1>
                    <p style={{ color: '#6c757d', fontSize: isMobile ? '16px' : '18px' }}>Managed by Cado — Dedicated to your pet's comfort.</p>
                </header>

                {/* Service Overview */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginBottom: '40px' }}>
                    <div style={serviceCardStyle}>
                        <FaHome size={30} color={OYO_PRIMARY} />
                        <h4>Pet Boarding</h4>
                        <p style={{fontSize: '13px'}}>Safe stays for <FaDog/> & <FaCat/> starting from ₹499/day.</p>
                    </div>
                    <div style={serviceCardStyle}>
                        <FaCut size={30} color={OYO_SECONDARY} />
                        <h4>Pro Grooming</h4>
                        <p style={{fontSize: '13px'}}>Full spa treatments including de-shedding and styling.</p>
                    </div>
                </div>

                {/* Direct Contact Links */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginBottom: '50px' }}>
                    <a href="tel:+918592041280" style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <FaPhone size={24} color={OYO_SECONDARY} style={{ marginBottom: '10px' }} />
                        <h4 style={{ margin: '0 0 5px 0', color: OYO_ACCENT_TEXT }}>Call Cado</h4>
                        <p style={{ margin: 0, color: OYO_SECONDARY, fontWeight: 'bold' }}>+91 8592041280</p>
                    </a>
                    <a href="mailto:cado12345@gmail.com" style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <FaEnvelope size={24} color={OYO_SECONDARY} style={{ marginBottom: '10px' }} />
                        <h4 style={{ margin: '0 0 5px 0', color: OYO_ACCENT_TEXT }}>Email Us</h4>
                        <p style={{ margin: 0, color: OYO_SECONDARY, fontWeight: 'bold' }}>cado1234@gmail.com</p>
                    </a>
                    <a href="https://wa.me/918592041280" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <FaWhatsapp size={24} color={OYO_RATING_GREEN} style={{ marginBottom: '10px' }} />
                        <h4 style={{ margin: '0 0 5px 0', color: OYO_ACCENT_TEXT }}>WhatsApp Cado</h4>
                        <p style={{ margin: 0, color: OYO_RATING_GREEN, fontWeight: 'bold' }}>Chat Now (+91 8592041280)</p>
                    </a>
                </div>

                {/* Form and FAQ Container */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: isMobile ? '40px' : '50px', alignItems: 'flex-start' }}>
                    <ContactForm isMobile={isMobile} />
                    <div>
                        <h2 style={{ color: OYO_ACCENT_TEXT, fontSize: isMobile ? '28px' : '32px', marginBottom: '20px', borderBottom: `2px solid ${OYO_PRIMARY}`, paddingBottom: '10px' }}>
                            <FaQuestionCircle size={24} style={{ marginRight: '10px', color: OYO_PRIMARY }} />
                            Stay & Grooming FAQs
                        </h2>
                        {faqData.map((item, index) => (
                            <FAQItem key={index} question={item.q} answer={item.a} isMobile={isMobile} />
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #ddd', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                    © 2025 PetStays Network. Service Lead: Cado. All pets are insured during their stay.
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <div style={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', boxSizing: 'border-box', overflowX: 'hidden' }}>
            <ContactUsPage />
        </div>
    );
};

export default App;